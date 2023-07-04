import { Message } from "@/types";

const BASE_ADDR = "http://127.0.0.1:8000";
export async function chatStream(question: string, messageList: Message[]) {
  return fetch(BASE_ADDR + "/chat-stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      // history: messageList,
    }),
  });
}
