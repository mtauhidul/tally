// app/api/assistants/message/route.ts
import { NextResponse } from "next/server";
import { openai } from "../../openaiClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { threadId, assistantId, message, personality } = body;

    if (!threadId || !assistantId || !message) {
      return NextResponse.json(
        { error: "threadId, assistantId and message are required" },
        { status: 400 }
      );
    }

    // Format message with personality directive if provided
    const formattedMessage = personality
      ? `[Use ${personality} personality] ${message}`
      : message;

    // Add user message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: formattedMessage,
    });

    // Run the assistant on the thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Poll for the run completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    let attempts = 0;
    const maxAttempts = 60;
    let delay = 500;

    while (
      !["completed", "failed", "cancelled", "expired"].includes(
        runStatus.status
      ) &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      attempts++;
      delay = Math.min(delay * 2, 5000); // Exponential backoff, capped at 5 seconds
    }

    if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
      throw new Error(
        runStatus.last_error?.message || `Run ${runStatus.status}`
      );
    }
    if (attempts >= maxAttempts) {
      throw new Error("Assistant run timed out");
    }

    // Get the latest messages (including the assistant's response)
    const messages = await openai.beta.threads.messages.list(threadId);

    // Find the most recent assistant message
    const assistantMessages = messages.data.filter(
      (msg) => msg.role === "assistant"
    );
    if (assistantMessages.length === 0) {
      throw new Error("No assistant message found");
    }

    const latestAssistantMessage = assistantMessages[0];
    let messageContent = "";

    const textContent = latestAssistantMessage.content.find(
      (content) => content.type === "text"
    );

    if (textContent && textContent.type === "text") {
      messageContent = textContent.text.value;
    }

    return NextResponse.json({
      message: messageContent,
      messageId: latestAssistantMessage.id,
      threadId: threadId,
    });
  } catch (error: unknown) {
    console.error("Error processing message:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process message";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
