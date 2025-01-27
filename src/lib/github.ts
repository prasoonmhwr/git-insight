import { db } from '@/server/db';
import {Octokit} from 'octokit';
import axios from 'axios'
import { aiSummariseCommit } from './gemini';
export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}
export const getCommitHashes = async(repoUrl: string): Promise<Response[]> => {
    
    const [owner,repo] = repoUrl.split('/').slice(-2)
    if(!owner || !repo){
        throw new Error("Invalid Github Url")
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo
    })

    const sortedCommits = data.sort((a:any,b:any)=> new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime())
    return sortedCommits.slice(0,10).map((commit: any)=>({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url,
        commitDate: commit.commit?.author?.date ?? ""
    }))
}

export const pollCommits = async(projectId: string) => {
    const {project, repoUrl} = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(repoUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId,commitHashes)
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit =>{
        return summariseCommit(repoUrl,commit.commitHash)
    }))

    const summaries = summaryResponses.map((response)=>{
        if(response.status === 'fulfilled'){
            return response.value as string
        }
        return ""
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary,index)=>{
            return {
                projectId: projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                aiSummary:summary
            }
        })
    })
    return commits
}

async function summariseCommit(repoUrl: string, commitHash: string){
    const {data} = await axios.get(`${repoUrl}/commit/${commitHash}.diff`,{
        headers:{
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    return await aiSummariseCommit(data) || ""
}

async function fetchProjectGithubUrl(projectId: string){
    const project = await db.project.findUnique({
        where:{id: projectId},
        select: {
            repoUrl: true
        }
    })
    if(!project?.repoUrl){
        throw new Error("Project has no github url")
    }
    return {project, repoUrl: project?.repoUrl}
}

async function filterUnprocessedCommits(projectId:string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {projectId}
    })

    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}