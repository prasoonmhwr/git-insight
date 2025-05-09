import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";
import { enqueueJob } from "@/lib/queue";


export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            repoUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ctx,input})=>{
        const user = await ctx.db.user.findUnique({where: {id: ctx.user.userId!}, select: {credits: true}})
        if(!user){
            throw new Error('User not found')
        }
        const currentCredits = user.credits || 0
        const fileCount = await checkCredits(input.repoUrl, input.githubToken)
        if(currentCredits < fileCount){
            throw new Error('Insufficient credits')
        }
        // const project = await ctx.db.project.create({
        //     data: {
        //         repoUrl: input.repoUrl,
        //         name: input.name,
        //         userToProjects:{
        //             create:{
        //                 userId: ctx.user.userId!,
        //             }
        //         }
        //     }
        // })
        // await indexGithubRepo(project.id, input.repoUrl, input.githubToken)
        // await pollCommits(project.id)
        const project = await ctx.db.project.create({
            data: {
              repoUrl: input.repoUrl,
              name: input.name,
              status: 'PENDING_INDEX', // Add this field to your schema
              userToProjects: {
                create: { userId: ctx.user.userId! }
              }
            }
          })
      
          // Enqueue background jobs
          enqueueJob('indexRepo', { 
            projectId: project.id, 
            repoUrl: input.repoUrl, 
            githubToken: input.githubToken 
          })
      
          
        await ctx.db.user.update({where: {id: ctx.user.userId!}, data: {credits: {decrement: fileCount}}})
        return project
    }),
    getProjects: protectedProcedure.query(async ({ctx}) => {
        return await ctx.db.project.findMany({
            where:{
                userToProjects:{
                    some:{
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })
    }),
    getCommits: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      cursor: z.string().optional(), // ID of the last item from previous batch
      limit: z.number().int().positive().default(10)
    }))
    .query(async ({ ctx, input }) => {
          
          pollCommits(input.projectId).then().catch(console.error);
         
          const commits = await ctx.db.commit.findMany({
            where: { 
              projectId: input.projectId,
              ...(input.cursor 
                ? { commitDate: { lt: new Date(input.cursor) } } 
                : {})
            },
            take: input.limit + 1, 
            orderBy: { commitDate: 'desc' } 
          });
          
         
          let nextCursor: string | undefined | number = undefined;
          if (commits.length > input.limit) {
            const nextItem = commits.pop(); 
            if(nextItem){
                nextCursor = nextItem?.commitDate.toISOString() 
            }
            
          }
      
      return {
        commits,
        nextCursor
      };
    }),
    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any()
    })).mutation(async ({ctx, input}) => {
        return await ctx.db.question.create({
            data:{
                answer: input.answer,
                filesReferences: input.filesReferences,
                projectId: input.projectId,
                question: input.question,
                userId: ctx.user.userId!
            }
        })
    }),
    getQuestions: protectedProcedure.input(z.object({projectId: z.string()})).query(async({ctx,input})=>{
        return await ctx.db.question.findMany({
            where:{
                projectId: input.projectId
            },
            include:{
                user: true
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
    }),
    uploadMeeting: protectedProcedure.input(z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string()
    })).mutation(async ({ctx,input})=>{
        const meeting = await ctx.db.meeting.create({
            data:{
                meetingUrl: input.meetingUrl,
                projectId: input.projectId,
                name: input.name,
                status: "PROCESSING"
            }
        })
        return meeting
    }),
    getMeetings: protectedProcedure.input(z.object({projectId: z.string()})).query(async ({ctx,input}) =>{
        return await ctx.db.meeting.findMany({where: {projectId: input.projectId}, include: {issues: true}})
    }),
    deleteMeeting: protectedProcedure.input(z.object({meetingId: z.string()})).mutation(async ({ctx, input})=>{
        await ctx.db.issue.deleteMany({where: {meetingId:input.meetingId}})
        return await ctx.db.meeting.delete({where: {id: input.meetingId}})
    }),
    getMeetingById: protectedProcedure.input(z.object({meetingId: z.string()})).query(async ({ctx, input})=>{
        return await ctx.db.meeting.findUnique({where: {id: input.meetingId}, include: {issues:true}})
    }),
    archiveProject: protectedProcedure.input(z.object({projectId: z.string()})).mutation(async ({ctx,input})=>{
        return await ctx.db.project.update({where: {id: input.projectId}, data: {deletedAt: new Date()}})
    }),
    getTeamMembers: protectedProcedure.input(z.object({projectId: z.string()})).query(async ({ctx,input})=>{
        return await ctx.db.userToProject.findMany({
            where: {projectId: input.projectId},
            include:{
                user: true
            },
        })
    }),
    getMyCredits: protectedProcedure.query(async({ctx})=>{
        return await ctx.db.user.findUnique({where: {id: ctx.user.userId!}, select: {credits: true, transactions:true,firstName: true, lastName:true, emailAddress:true}})
    }),
    checkCredits: protectedProcedure.input(z.object({repoUrl: z.string(), githubToken: z.string().optional()})).mutation(async ({ctx,input}) => {
        const fileCount =  await checkCredits(input.repoUrl,input.githubToken)
        const userCredits = await ctx.db.user.findUnique({where: {id:ctx.user.userId!}, select:{credits: true}})
        return {fileCount, userCredits: userCredits?.credits || 0}
    }),
})