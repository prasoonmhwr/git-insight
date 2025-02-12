import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { AssemblyAI } from "assemblyai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodyparser = z.object({
    meetingUrl: z.string(),
    projectId: z.string(),
    meetingId: z.string()
})

export const maxDuration = 60

export async function POST(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { meetingUrl, projectId, meetingId } = bodyparser.parse(body)

        processAndUpdateMeeting(meetingUrl, meetingId)

        return NextResponse.json({
            message: "Meeting processing started",
            status: "PROCESSING"
        }, { status: 200 })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

async function processAndUpdateMeeting(meetingUrl: string, meetingId: string) {
    try {
        const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! })
        console.log("Applying Transcription Started")
        console.log(meetingUrl)
        console.log(client.transcripts.transcribe({
            audio: meetingUrl,
            auto_chapters: true,
            webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/assembly`,
            webhook_auth_header_name: 'X-Webhook-Secret',
            webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET,
        }))
        const transcript = await client.transcripts.transcribe({
            audio: meetingUrl,
            auto_chapters: true,
            webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/assembly`,
            webhook_auth_header_name: 'X-Webhook-Secret',
            webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET,
        })
        console.log("Transcription Started", transcript)


        await db.meeting.update({
            where: {
                id: meetingId
            },
            data: {
                transcriptionId: transcript.id,
                status: 'PROCESSING'
            }
        })

    } catch (error) {
        console.error("Meeting processing failed:", error)

    }
}