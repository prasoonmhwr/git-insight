'use client'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CommitLog = () => {
  const { projectId, project } = useProject()
  const { data: commits } = api.project.getCommits.useQuery({ projectId })
  return (
    <>
      <ul className='space-y-6'>
        {commits?.map((commit, commitIdx) => {
          return <li key={commit.id} className='relative flex gap-x-4'>
            <div className={cn(
              commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}>
              <div className="w-px translate-x-1 bg-slate-600"></div>
            </div>
            <>
              <img src={commit.commitAuthorAvatar} alt='commit avatar' className='relative mt-4 size-8 flex-none rounded-full bg-slate-900' />
              <div className="flex-auto rounded-md bg-slate-950 p-3 ring-1 ring-inset ring-slate-700">
                <div className="flex justify-between gap-x-4">
                  <Link target='_blank' href={`${project?.repoUrl}/commit/${commit.commitHash}`} className='py-0.5 text-xs leading-5 text-slate-500'>
                    <span className='font-medium text-slate-300'>
                      {commit.commitAuthorName}
                    </span>{" "}
                    <span className='inline-flex items-center'>
                      commited
                      <ExternalLink className='ml-1 size-4' />
                    </span>
                  </Link>
                </div>
                <span className='font-semibold'>
                  {commit.commitMessage}
                </span>
                <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-500'>
                  {commit.aiSummary}
                </pre>
              </div>

            </>
          </li>
        })}
      </ul>
    </>
  )
}

export default CommitLog