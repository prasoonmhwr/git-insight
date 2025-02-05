'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useProject from '@/hooks/use-project'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProject.useMutation()
    const {projects,projectId, setProjectId} = useProject()
    const refetch = useRefetch()
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
      archiveProject.mutate(
        { projectId },
        {
          onSuccess: () => {
            toast.success("Project archived");
            refetch();
            if (projects && projects.length > 1) {
              setProjectId(projects[0]!.id);
            }
            setOpen(false);
          },
          onError: () => {
            toast.error("Failed to archive project");
            setOpen(false);
          },
        }
      );
    }
  return (
    <>
   <Button disabled={archiveProject.isPending} size="sm" variant='destructive' onClick={()=>setOpen(true)}>Archive</Button>
   <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-slate-900 text-slate-200 border border-slate-700">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p className="text-slate-400">This action cannot be undone. The project will be archived.</p>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="destructive" className="bg-red-600 text-white hover:bg-red-700">
            Yes, Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default ArchiveButton