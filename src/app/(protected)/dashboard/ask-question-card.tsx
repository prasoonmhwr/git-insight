'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import Image from 'next/image'
import React, { useState } from 'react'
import { askQuestion } from './action'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from './code-references'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

const AskQuestionCard = () => {
    const {project} = useProject()
    const [open,setOpen] = useState(false)
    const [question,setQuestion] = useState('')
    const [loading,setLoading] = useState(false)
    const [filesReferences,setFilesReferences] = React.useState<{fileName: string; sourceCode: string; aiSummary:string}[]>([])
    const [answer, setAnswer] = useState('')
    const saveAnswer = api.project.saveAnswer.useMutation()
    const onSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        setAnswer('')
        setFilesReferences([])
        e.preventDefault()
        if(!project?.id) return
        
        setLoading(true)

        const {output,filesReferences} = await askQuestion(question, project.id)
        setOpen(true)
        setFilesReferences(filesReferences)
        for await(const delta of readStreamableValue(output)){
            if(delta){
                setAnswer(ans=>ans+delta)
            }
        }
        setLoading(false)
    }
    const refetch = useRefetch()
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[80vw]'>
        <DialogHeader>
            <div className="flex items-center gap-2">
                <DialogTitle>
                    <Image src='/logo.png' alt='gitInsight' width={40} height={40}/>
                </DialogTitle>
                <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={()=>{
                    saveAnswer.mutate({
                        projectId: project!.id,
                        question,
                        answer,
                        filesReferences
                    },{
                        onSuccess: ()=>{
                            toast.success('Answer saved!')
                            refetch()
                        },
                        onError: () => {
                            toast.error('Failed to save answer!')
                        }
                    })
                }}>Save Answer</Button>
            </div>
        </DialogHeader>
        <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll'/>
        <div className="h-4"></div>
        <CodeReferences filesReferences={filesReferences} />
        <Button type='button' onClick={() => {setOpen(false)}}>
            Close
        </Button>
        </DialogContent>
    </Dialog>
        <Card className='relative col-span-3 bg-slate-950 ring-1 ring-inset ring-slate-700'>
            <CardHeader>
                <CardTitle>Ask a question</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <Textarea placeholder='Which file should I edit to change the home page?' value={question} onChange={e => setQuestion(e.target.value)}/>
                    <div className="h-4"></div>
                    <Button className="bg-slate-200" type='submit' disabled={loading}>Ask</Button>
                </form>
            </CardContent>
        </Card>
    </>
  )
}

export default AskQuestionCard