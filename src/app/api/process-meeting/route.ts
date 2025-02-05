import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodyparser = z.object({
    meetingUrl: z.string(),
    projectId: z.string(),
    meetingId: z.string()
})

export const maxDuration = 60 

export async function POST(req: NextRequest){
    const {userId} = await auth()
    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    
    try {
        const body = await req.json()
        const { meetingUrl, projectId, meetingId} = bodyparser.parse(body)
        
        processAndUpdateMeeting(meetingUrl, meetingId)
        
        return NextResponse.json({
            message: "Meeting processing started", 
            status: "PROCESSING"
        }, {status: 200})
    }
    catch (error){
        console.error(error)
        return NextResponse.json({error: "Internal Server Error"},{status: 500})
    }
}

async function processAndUpdateMeeting(meetingUrl: string, meetingId: string) {
    try {
        const {summaries} = await processMeeting(meetingUrl)
        
        await db.issue.createMany({
            data: summaries.map(summary => ({
                start: summary.start,
                end: summary.end,
                gist: summary.gist,
                headline: summary.headline,
                summary: summary.summary,
                meetingId
            }))
        })

        await db.meeting.update({
            where: {id: meetingId},
            data: {
                status: "COMPLETED",
                name: summaries[0]?.headline || "Meeting Processed"
            }
        })
    } catch (error) {
        console.error("Meeting processing failed:", error)
        
    }
}