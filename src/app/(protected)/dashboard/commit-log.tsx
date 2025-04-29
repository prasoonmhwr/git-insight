'use client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { Commit } from '@prisma/client'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'


interface GetCommitsResponse {
  items: Commit[];
  nextCursor: string | undefined;
}
const CommitLog = () => {
  const { projectId, project } = useProject()
  const [commits, setCommits] = useState<Commit[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const { data, fetchNextPage, isFetchingNextPage, isLoading } = api.project.getCommits.useInfiniteQuery(
    {
      projectId,
      limit: 5,
    },
    {
      getNextPageParam: (lastPage:any) => {
        return lastPage.nextCursor;
      },
    }
  );
  useEffect(() => {
    if (data) {
      const allCommits = data.pages.flatMap(page => page.commits);
      setCommits(allCommits);
      
      
      const lastPage = data.pages[data.pages.length - 1];
      lastPage && setHasMore(!!lastPage.nextCursor);
    }
  }, [data]);
 
  return (
    <>
    {isLoading && [1, 2, 3, 4, 5].map((i) => (<Skeleton key={i} className="h-[120px] mt-2 rounded-xl bg-slate-800" />))}
      <ul className='space-y-6'>
        {data?.pages.flatMap(page => page.commits)?.map((commit, commitIdx) => {
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
      <div className='w-full mt-4 flex justify-center'>{hasMore && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="load-more-button w-full"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </Button>
      )}
      
      {!hasMore && commits.length > 0 && (
        <div className="no-more-commits w-2/3 text-slate-500 inline-flex items-center justify-between"> <span className="border-t border-slate-500 w-2/5 "></span><span className='w-fit flex justify-center font-light text-sm'> No more commits to load</span> <span className="border-t border-slate-500 w-2/5 "></span></div>
      )}</div>
    </>
  )
}

export default CommitLog