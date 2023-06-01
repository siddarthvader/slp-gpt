import { Message } from "@/types";

export async function chatStream(question: string, messageList: Message[]) {
  return fetch("/api/chat-stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      history: messageList.map((item) => item.message),
    }),
  });
}
