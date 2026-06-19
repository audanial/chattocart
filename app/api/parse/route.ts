import { NextRequest, NextResponse } from "next/server";
import { aiClient } from "@/lib/aiClient";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompt";
import type { ParseResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  let chatText: string;
  try {
    const body = await req.json();
    chatText = body.chatText;
    if (typeof chatText !== "string" || !chatText.trim()) {
      return NextResponse.json({ error: "chatText is required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let rawText: string;
  try {
    const response = await aiClient.chat.completions.create({
      model: "claude-sonnet-4-6",
      temperature: 0,
      max_tokens: 4000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(chatText) },
      ],
    });
    rawText = response.choices[0]?.message?.content ?? "";
  } catch (err) {
    const message = err instanceof Error ? err.message : "Model call failed";
    return NextResponse.json({ error: `Model error: ${message}` }, { status: 502 });
  }

  // Strip markdown fences as fallback
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  let result: ParseResult;
  try {
    result = JSON.parse(cleaned) as ParseResult;
  } catch {
    return NextResponse.json(
      { error: "Model returned invalid JSON", raw: cleaned.slice(0, 500) },
      { status: 502 }
    );
  }

  return NextResponse.json(result);
}
