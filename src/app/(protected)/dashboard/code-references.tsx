'use client'
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import {Prism as SyntaxHighlighter} from  'react-syntax-highlighter'
import {lucario} from 'react-syntax-highlighter/dist/esm/styles/prism'
type Props = {
    filesReferences:{filename:string; sourceCode: string; summary: string}[]
}

const CodeReferences = ({filesReferences}: Props) => {
    const [tab,setTab] = useState(filesReferences[0]?.filename)
    if(filesReferences.length === 0) return null
  return (
    <div className='max-w-[70vw]'>
        <Tabs value={tab} onValueChange={setTab}>
            <div className='overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md'>
                {filesReferences.map(file => (
                    <button onClick={() => setTab(file.filename)} key={file.filename} className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted',
                        {
                            'bg-primary text-primary-foreground': tab === file.filename,
                        }
                    )}>
                        {file.filename}
                    </button>
                ))}
            </div>
            {filesReferences.map(file => (
                <TabsContent key={file.filename} value={file.filename} className='max-h-[40vh] overflow-scroll max-w-7xl rounded-md'>
                    <SyntaxHighlighter style={lucario}>
                        {file.sourceCode}
                    </SyntaxHighlighter>
                </TabsContent>
            ))}
        </Tabs>
    </div>
  )
}

export default CodeReferences