import { NextResponse } from "next/server";
import { openai } from "../../openaiClient";

export async function POST() {
  try {
    console.log("Creating thread...");

    const thread = await openai.beta.threads.create();

    console.log("Thread created successfully:", thread.id);

    return NextResponse.json({ threadId: thread.id, success: true });
  } catch (error: unknown) {
    console.error("Error creating thread:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to create thread";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
