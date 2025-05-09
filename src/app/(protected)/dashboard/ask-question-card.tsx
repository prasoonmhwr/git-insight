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
import { MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

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
        setLoading(false)
        setQuestion('')
        for await(const delta of readStreamableValue(output)){
            if(delta){
                setAnswer(ans=>ans+delta)
            }
        }
        
    }
    const refetch = useRefetch()
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[80vw] bg-slate-900'>
        <DialogHeader>
            <div className="flex items-center gap-2">
                <DialogTitle>
                    <Image src='/logo2.svg' alt='gitInsight' width={40} height={40}/>
                </DialogTitle>
                <Button disabled={saveAnswer.isPending} className='ml-4 bg-slate-600' variant={'outline'} onClick={()=>{
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
        <div className='w-full m-w-[100%]'><MDEditor.Markdown source={answer} className=' !h-full max-h-[40vh] overflow-auto'/></div>
        <div className="h-4"></div>
        <div className='w-full m-w-[100%]'><CodeReferences filesReferences={filesReferences} /></div>
        <Button type='button' onClick={() => {setOpen(false)}}>
            Close
        </Button>
        </DialogContent>
    </Dialog>
        {/* <Card className='relative col-span-3 bg-slate-950 ring-1 ring-inset ring-slate-700/80'>
            <CardHeader>
                <CardTitle>Ask a question</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <Textarea placeholder='Which file should I edit to change the home page?' className='resize-none' value={question} onChange={e => setQuestion(e.target.value)}/>
                    <div className="h-4"></div>
                    <div className='w-full flex justify-end'><Button className="bg-blue-500 text-slate-100" type='submit' disabled={loading}>{loading? 'Thinking...':'Ask'}</Button></div>
                </form>
            </CardContent>
        </Card> */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Ask a question</span>
          </div>
          <form onSubmit={onSubmit} className='w-full'>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your question..."
              className="flex-1 text-sm bg-gray-800 border-gray-700 text-white"
              value={question} onChange={e => setQuestion(e.target.value)}
            />
            <Button className="text-xs bg-blue-600 hover:bg-blue-700 text-white" type='submit' disabled={loading}>{loading? 'Thinking...':'Ask'}</Button>
          </div>
            </form>
        </div>
    </>
  )
}

export default AskQuestionCard