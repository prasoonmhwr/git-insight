'use server'
import {streamText} from 'ai'
import {createStreamableValue} from 'ai/rsc'
import {createGoogleGenerativeAI} from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/gemini'
import { db } from '@/server/db'

const google =createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export async function askQuestion(question: string, projectId: string){
    const stream = createStreamableValue()

    const queryVector = await generateEmbedding(question)
    const vectorQuery = `[${queryVector.join(',')}]`

    const result = await db.$queryRaw`
    SELECT "fileName","sourceCode","aiSummary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.4
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10` as {fileName: string; sourceCode: string; aiSummary:string;}[]

    let context = ''
    console.log('Query results:', JSON.stringify(result, null, 2))
    for (const doc of result){
        context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.aiSummary}\n\n`
    }
    
    (async () => {
        const {textStream} = await streamText({
            model: google('gemini-1.5-flash'),
            prompt:`
            You are an ai code assistant who answers questiosn about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
            AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions, including code snippets.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            
            START QUESTION
            ${question}
            END QUESTION
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistnat will say, "I'm sorry, but I don't know the answer to that question.".
            AI assistant will not apologize for the previous reposnses, but instead will indicate new information was gained.
            AI assistant will no invent anthing that is not draw directly from the context.
            Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is no ambiguity and include`

        });
        for await(const delta of textStream){
            stream.update(delta)
        }
        stream.done()
    })()

    return {
        output: stream.value,
        filesReferences: result
    }
}