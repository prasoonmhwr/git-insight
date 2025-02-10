import { db } from '@/server/db'
import { MeetingStatus } from '@prisma/client'
import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server'

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! })

interface TranscriptionRequest {
    meetingUrl: string
  }
  
  interface TranscriptionResponse {
    transcriptionId: string
    status: MeetingStatus
  }
  
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
  
function msToTime(ms: number) {
    const seconds = ms / 1000
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const processMeeting = async (meetingUrl: string) : Promise<TranscriptionResponse> => {
    try {
      console.log("Applying Transcription Started")
      console.log(client)
      console.log(meetingUrl)
      const transcript = await client.transcripts.transcribe({
        audio: meetingUrl,
        auto_chapters: true,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/assembly`,
        webhook_auth_header_name: 'X-Webhook-Secret',
        webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET,
      })
      console.log("Transcription Started", transcript)
      return {
        transcriptionId: transcript.id,
        status: 'PROCESSING'
      }
    } catch (error) {
      console.error('Error starting transcription:', error)
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