import { db } from '@/server/db'
import { api } from '@/trpc/server'
import { MeetingStatus } from '@prisma/client'
import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server'
import axios from 'axios'
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! })

interface TranscriptionRequest {
    meetingUrl: string
  }
  
  // interface TranscriptionResponse {
  //   transcriptionId: string
  //   status: MeetingStatus
  // }
  
  interface ChapterSummary {
    start: string
    end: string
    gist: string
    headline: string
    summary: string
  }
  
  interface TranscriptionResult {
    transcriptionId: string
    status: 'completed'
    summaries: ChapterSummary[]
    fullTranscript: string
  }


const ASSEMBLY_API_URL = 'https://api.assemblyai.com/v2'

interface TranscriptResponse {
  transcriptionId: string
  status: MeetingStatus
  chapters?: Array<{
    start: number
    end: number
    gist: string
    headline: string
    summary: string
  }>
  text?: string
}
function msToTime(ms: number) {
    const seconds = ms / 1000
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const processMeeting = async (meetingUrl: string) => {
  try {
    console.log("Starting transcription process...")
    
    // Headers for all requests
    const headers = {
      'Authorization': process.env.ASSEMBLYAI_API_KEY!,
      'Content-Type': 'application/json'
    }

    // Step 1: Create the transcript
    console.log("Creating transcript...")
    const createResponse = await axios.post(
      `${ASSEMBLY_API_URL}/transcript`, 
      {
        audio_url: meetingUrl,
        auto_chapters: true,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/assembly`,
        webhook_auth_header_name: 'X-Webhook-Secret',
        webhook_auth_header_value: process.env.WEBHOOK_SECRET
      },
      { headers }
    )

    const transcriptId = createResponse.data.id
    console.log("Transcript created with ID:", transcriptId)

    // Step 2: Start polling for status (with a reasonable timeout)
    console.log("Checking initial status...")
    const startTime = Date.now()
    const TIMEOUT = 10000 // 10 second timeout for initial check

    while (Date.now() - startTime < TIMEOUT) {
      const pollingResponse = await axios.get<TranscriptResponse>(
        `${ASSEMBLY_API_URL}/transcript/${transcriptId}`,
        { headers }
      )
      
      const status = pollingResponse.data.status
      console.log("Current status:", status)
      
      

      // Wait a second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // If we reach here, we've hit the timeout but the process is still running
    console.log("Initial check complete - process continuing in background")
    return {
      transcriptionId: transcriptId,
      status: 'PROCESSING'
    }

  } catch (error) {
    console.error("Transcription error:", error)
    throw error
  }
}

export async function handleWebhook(req: Request) {
  try {
    const webhookSecret = req.headers.get("x-webhook-Secret"); 
    if (webhookSecret !== process.env.ASSEMBLYAI_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transcript_id, status } = await req.json();

    if (status === "completed") {
      const transcript = await client.transcripts.get(transcript_id);

      const summaries =
        transcript.chapters?.map((chapter) => ({
          start: msToTime(chapter.start),
          end: msToTime(chapter.end),
          gist: chapter.gist,
          headline: chapter.headline,
          summary: chapter.summary,
        })) || [];

      const meeting = await db.meeting.findFirst({
        where: {
          transcriptionId: transcript_id, 
        },
      })

      if (!meeting) {
        return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
      }

      await db.issue.createMany({
        data: summaries.map((summary) => ({
          start: summary.start,
          end: summary.end,
          gist: summary.gist,
          headline: summary.headline,
          summary: summary.summary,
          meetingId: meeting.id,
        })),
      });

      await db.meeting.update({
        where: { id: meeting?.id! },
        data: {
          status: "COMPLETED",
          name: summaries[0]?.headline || "Meeting Processed",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}