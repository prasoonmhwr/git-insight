'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import AskQuestionCard from '../dashboard/ask-question-card'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from '../dashboard/code-references'
import { Skeleton } from '@/components/ui/skeleton'

const QAPage = () => {
  const {projectId} = useProject()
  const {data: questions} = api.project.getQuestions.useQuery({projectId})
  const [questionIndex,setQuestionIndex] = useState(0)
  const question = questions?.[questionIndex]
  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2 min-h-[800px]">
        {!questions && (
          [1,2,3,4,5,6,7,8,9,10].map((i) => (<Skeleton key={i} className="h-[82px] rounded-xl bg-slate-800" />))
        )}
        {questions?.map((question,index) => {
          return <React.Fragment key={question.id}>
            <SheetTrigger onClick={() => setQuestionIndex(index)}>
              <div className="flex items-center gap-4 bg-slate-200 rounded-lg p-4 shadow border">
                <img className='rounded-full' height={30} width={30} src={question.user.imageUrl ?? ""}/>
                <div className='text-left flex flex-col'>
                  <div className='flex items-center gap-2'>
                    <p className='text-slate-700 line-clamp-1 text-lg font-medium'>
                      {question.question}
                    </p>
                    <span className='text-xs text-slate-500 whitespace-nowrap'>
                      {question.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-slate-500 line-clamp-1 text-sm'>
                    {question.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        })}
        {questions && questions.length==0 && (
          <div className='flex flex-col m-auto h-full'>
             <img src="/empty.svg" className='h-40 w-auto brightness-[85%]' />
          <p className='pt-4 text-lg text-slate-200'>No questions were saved</p>
          </div>)}
      </div>

      {question && (
        <SheetContent className='sm:max-w-[80vw] bg-slate-900'>
          <SheetHeader>
            <SheetTitle>
              {question.question}
            </SheetTitle>
            <MDEditor.Markdown source={question.answer} />
            <CodeReferences filesReferences={question.filesReferences ?? [] as any} />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default QAPage