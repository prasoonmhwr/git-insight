import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            repoUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ctx,input})=>{
        const project = await ctx.db.project.create({
            data: {
                repoUrl: input.repoUrl,
                name: input.name,
                userToProjects:{
                    create:{
                        userId: ctx.user.userId!,
                    }
                }
            }
        })
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
    })
})