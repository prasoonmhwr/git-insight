import { pollCommits } from '@/lib/github'
import { indexGithubRepo } from '@/lib/github-loader'
import { db } from '@/server/db'
import { NextResponse } from 'next/server'

export const runtime = 'edge';
export async function POST(
  request: Request,
) {

  const data = await request.json()
  console.log("-------------Indexing started--------------")
  await indexGithubRepo(data.projectId, data.repoUrl!, data.githubToken)
  await db.project.update({
    where: { id: data.projectId },
    data: { status: 'INDEXED' }
  })
  console.log("-------------Indexing Completed--------------")
  console.log("-------------Polling Started--------------")
  await pollCommits(data.projectId)
  await db.project.update({
    where: { id: data.projectId },
    data: { status: 'COMMITS_PROCESSED' }
  })
  console.log("-------------Polling Completed--------------")

  return NextResponse.json({ success: true })
}