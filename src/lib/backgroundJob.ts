import { db } from '@/server/db'
import schedule from 'node-schedule'
import { indexGithubRepo } from './github-loader'
import { pollCommits } from './github'



interface JobData {
  projectId: string
  repoUrl?: string
  githubToken?: string
}

export const enqueueJob = (jobType: string, data: JobData) => {
  schedule.scheduleJob(new Date(), async () => {
    try {
      switch(jobType) {
        case 'indexRepo':
          await indexGithubRepo(data.projectId, data.repoUrl!, data.githubToken)
          await db.project.update({
            where: { id: data.projectId },
            data: { status: 'INDEXED' }
          })
          break
        case 'pollCommits':
          await pollCommits(data.projectId)
          await db.project.update({
            where: { id: data.projectId },
            data: { status: 'COMMITS_PROCESSED' }
          })
          break
      }
    } catch (error) {
      console.error(`Job ${jobType} failed:`, error)
      await db.project.update({
        where: { id: data.projectId },
        data: { 
          status: 'FAILED'
        }
      })
    }
  })
}