import { AssemblyAI } from 'assemblyai'
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! })

function msToTime(ms: number) {
    const seconds = ms / 1000
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const processMeeting = async (meetingUrl: string) => {
    console.log("Reaching here")
    const transcript = await client.transcripts.transcribe({
        audio: meetingUrl,
        auto_chapters: true,
    })
    console.log("Transcript done")
    const summaries = transcript.chapters?.map(chapter => ({
        start: msToTime(chapter.start),
        end: msToTime(chapter.end),
        gist: chapter.gist,
        headline: chapter.headline,
        summary: chapter.summary
    })) || []
    console.log("Sumarries done")
    if (!transcript.text) throw new Error("no transcript found")

    return {
        summaries
    }
}