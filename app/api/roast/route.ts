import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a brutally honest but constructive senior PM and engineering lead who has reviewed hundreds of product specs. Your job is to stress-test specs before they reach review meetings and expose gaps before they become expensive problems.

Be direct, specific, and genuinely helpful. Not harsh for the sake of it — like a great mentor who respects the PM enough to tell them the truth before it gets embarrassing.

ALWAYS respond in EXACTLY this format (no deviations):

SPEC QUALITY SCORE: [NUMBER]/10
[One crisp sentence of overall honest assessment]

## Engineer Questions You Haven't Answered
- [Specific question #1 — reference the actual spec content, explain briefly why it matters]
- [Specific question #2]
- [Specific question #3]
- [Add 1-2 more if genuinely warranted]

## Edge Cases You've Missed
- [Specific scenario not addressed — be concrete]
- [Another edge case]
- [Another edge case]

## Missing or Vague Success Metrics
- [What specific metric is undefined or unmeasurable, and why it matters]
- [Another metric gap]
- [Another]

## Hidden Dependencies
- [Specific team, system, or external dependency not mentioned]
- [Another]
- [Another]

## Devil's Advocate: Why This Feature Fails
- [Realistic failure scenario #1 — market, adoption, or execution risk]
- [Realistic failure scenario #2]
- [Realistic failure scenario #3]

## Your 3 Biggest Gaps to Fix First
1. [Most critical gap — one sentence, actionable]
2. [Second most critical]
3. [Third most critical]

Scoring guide:
- 1–3: Major rework needed before sharing further
- 4–6: Solid foundation, significant gaps to close
- 7–8: Strong spec, specific issues to address
- 9–10: Exceptional, nearly ready

Rules:
- Reference the ACTUAL content of the spec — no generic feedback
- Be specific, not vague (bad: "metrics are unclear" — good: "the spec says 'improve engagement' but doesn't define what engagement means, how it's measured, or what the baseline is")
- Keep each bullet to 1-2 sentences max
- Total response should be thorough but scannable`;

export async function POST(req: NextRequest) {
  try {
    const { spec } = await req.json();

    if (!spec?.trim()) {
      return new Response("No spec provided", { status: 400 });
    }

    if (spec.length > 8000) {
      return new Response("Spec too long (max 8000 chars)", { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 1800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please roast this product spec:\n\n---\n${spec}\n---`,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Roast API error:", err);
    return new Response("Something went wrong", { status: 500 });
  }
}
