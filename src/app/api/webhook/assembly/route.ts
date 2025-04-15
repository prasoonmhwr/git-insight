import { NextResponse } from "next/server";
import { handleWebhook } from "@/lib/assembly"; // Ensure this function is App Router-compatible
export const runtime = 'edge';
export async function POST(req: Request) {
  console.log("🚀 Assembly Webhook Hit");
  try {
    const response = await handleWebhook(req); // Ensure `handleWebhook` accepts body as an argument
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
