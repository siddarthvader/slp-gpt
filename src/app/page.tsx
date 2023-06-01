"use client";

import MessageList from "../components/MessageList";
import { useLoadingStore, useMessageStore } from "@/store";
import { isStreaming } from "@/helpers/util";
import MessageBox from "@/components/MessageBox";

export default function Home() {
  const loadingState = useLoadingStore((state) => state.loadingState);
  const messageList = useMessageStore((state) => state.messages);

  return (
    <div className="w-[78%] h-full flex flex-col mx-3 pt-3 center">
      <MessageList
        streaming={isStreaming(loadingState)}
        messageList={messageList}
      />
      <MessageBox className="w-full" />
    </div>
  );
}
