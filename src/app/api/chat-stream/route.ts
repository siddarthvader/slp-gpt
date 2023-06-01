import { loadEnvConfig } from "@next/env";

import { makeChain } from "@/utils/makechain";
import { ChatStreamRequest } from "@/types";

loadEnvConfig("");

export async function POST(req: Request, res: Response) {
  const { question, history } = (await req.json()) as ChatStreamRequest;

  if (!question || !history) {
    return new Response("Query not found", { status: 500 });
  }

  try {
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");

    const stream = makeChain(sanitizedQuestion, history);
    return new Response((await stream).readable, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    console.log("er1221r ", err);
    return new Response("Query not found", { status: 500 });
  }
}
