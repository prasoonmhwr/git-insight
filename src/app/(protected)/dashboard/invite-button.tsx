'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import React from 'react'
import { toast } from 'sonner'

const InviteButton = () => {
    const { projectId } = useProject()
    const [open, setOpen] = React.useState(false)
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='bg-slate-900'>
                    <DialogHeader>
                        <DialogTitle className='text-slate-200'>Invite Team Members</DialogTitle>
                    </DialogHeader>
                    <p className='text-sm text-slate-500'>
                        Ask them to copy and paste this link
                    </p>
                    <Input className='mt-4 bg-slate-950' readOnly onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
                        toast.success("copied to clipboard")
                    }}
                        value={`${window.location.origin}/join/${projectId}`}
                    />
                </DialogContent>
            </Dialog>
            <Button size='sm' className='bg-slate-200' onClick={() => setOpen(true)}>Invite Members</Button>
        </>
    )
}

export default InviteButton