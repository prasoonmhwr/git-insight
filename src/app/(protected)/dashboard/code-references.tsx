'use client'
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import {Prism as SyntaxHighlighter} from  'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
type Props = {
    filesReferences:{fileName:string; sourceCode: string; aiSummary: string}[]
}

const CodeReferences = ({filesReferences}: Props) => {
    const [tab,setTab] = useState(filesReferences[0]?.fileName)
    if(filesReferences.length === 0) return null
  return (
    <div className='max-w-[70vw]'>
        <Tabs value={tab} onValueChange={setTab}>
            <div className="h-4"></div>
            <div className='overflow-auto flex gap-2 bg-slate-700 p-1 rounded-md'>
                {filesReferences.map(file => (
                    <button onClick={() => setTab(file.fileName)} key={file.fileName} className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted',
                        {
                            'bg-slate-900 text-slate-400': tab === file.fileName,
                        }
                    )}>
                        {file.fileName}
                    </button>
                ))}
            </div>
            {filesReferences.map(file => (
                <TabsContent key={file.fileName} value={file.fileName} className='max-h-[40vh] overflow-auto max-w-8xl rounded-md'>
                    <SyntaxHighlighter style={dracula}>
                        {file.sourceCode}
                    </SyntaxHighlighter>
                </TabsContent>
            ))}
        </Tabs>
    </div>
  )
}

export default CodeReferences