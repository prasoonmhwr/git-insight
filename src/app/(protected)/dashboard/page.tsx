'use client'
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CommitLog from './commit-log'
import AskQuestionCard from './ask-question-card'
import MeetingCard from './meeting-card'
import ArchiveButton from './archive-button'
import dynamic from 'next/dynamic'
const InviteButton = dynamic(()=> import('./invite-button'), {ssr:false})
import TeamMembers from './team-members'

const Dashboard = () => {
  const { project,projects } = useProject()
  return (
    
    <div>
      {projects?.length == 0 && <div className='h-[calc(100vh-170px)] flex items-center justify-center font-sans text-2xl'>No projects, please create a project to continue</div>}
      {project?.status == "PENDING_INDEX" && <div className='h-[calc(100vh-170px)] flex items-center justify-center font-sans text-2xl'>Indexing....</div>}
      {project?.status == "INDEXED" && <div className='h-[calc(100vh-170px)] flex items-center justify-center font-sans text-2xl'>Polling Commits....</div>}
      {project?.status == "COMMITS_PROCESSED" && <><div className='flex items-center justify-between flex-wrap gap-y-4'>
        <div className='w-fit rounded-md bg-slate-200 px-4 py-3'>
          <div className="flex items-center">
            <Github className='size-5 text-slate-900' />
            <div className='ml-2'>
              <p className='text-sm font-medium text-slate-900'>
                This project is linked to {' '}
                <Link href={project?.repoUrl ?? ""} className='inline-flex items-center text-slate-900/80 hover:underline'>
                  {project?.repoUrl}
                  <ExternalLink className='ml-1 size-4' />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>

        <div className='flex items-center gap-4'>
          <TeamMembers />
          <InviteButton />
          <ArchiveButton />
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard />
          <MeetingCard />
        </div>
      </div>

      <div className='mt-8'></div>
      <CommitLog /> </>}
    </div>

  )
}

export default Dashboard