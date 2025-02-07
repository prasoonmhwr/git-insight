'use client'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import React from 'react'
import MeetingCard from '../dashboard/meeting-card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'
import { Skeleton } from '@/components/ui/skeleton'

const MeetingsPage = () => {
    const { projectId } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId }, {
        refetchInterval: 5000
    })
    const deleteMeeting = api.project.deleteMeeting.useMutation()
    const refetch = useRefetch()
    return (
        <>
            <MeetingCard />
            <div className='h-6'></div>
            <div className="h-auto text-2xl font-bold">Meetings</div>
            {meetings && meetings.length === 0 &&
                <div className=' flex flex-col items-center justify-center m-auto min-h-[800px]'>
                    <img src="/meeting.svg" className='h-36 w-auto brightness-[85%]' />
                    <p className='pt-4 text-lg text-slate-200'>No meetinds found</p>
                </div>
            }
            {isLoading && [1, 2, 3, 4, 5, 6, 7].map((i) => (<Skeleton key={i} className="h-[82px] mt-2 rounded-xl bg-slate-800" />))}
            <ul className='divide-y divide-gray-200 mt-10'>
                {meetings?.map(meeting => (
                    <li key={meeting.id} className='flex items-center justify-between py-5 gap-x-6'>
                        <div>
                            <div className='min-w-0'>
                                <div className='flex items-center gap-2'>
                                    <Link href={`/meetings/${meeting.id}`} className='text-sm font-semibold'>
                                        {meeting.name}
                                    </Link>
                                    {meeting.status === 'PROCESSING' && (
                                        <Badge className='bg-yellow-500 text-white'>
                                            Processing...
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center text-xs text-gray-500 gap-x-2'>
                                <p className='whitespace-nowrap'>
                                    {meeting.createdAt.toLocaleDateString()}
                                </p>
                                <p className='truncate'>{meeting.issues.length} issues</p>
                            </div>
                        </div>
                        {meeting.status === 'COMPLETED' && 
                        (<div className='flex items-center flex-none gap-x-4'>
                            <Link href={`/meetings/${meeting.id}`}>
                                <Button size='sm' variant='outline'>
                                    View Meeting
                                </Button>

                            </Link>
                            <Button disabled={deleteMeeting.isPending} size='sm' variant='destructive' onClick={() => deleteMeeting.mutate({ meetingId: meeting.id }, {
                                onSuccess: () => {
                                    toast.success("Meeting deleted sucessfully")
                                    refetch()
                                }
                            })} className='ml-3'>
                                Delete Meeting
                            </Button>
                        </div>)}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default MeetingsPage