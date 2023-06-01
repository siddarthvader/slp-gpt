"use client";

import MessageList from "../components/MessageList";
import { useLoadingStore, useMessageStore } from "@/store";
import { isLoading, isStreaming } from "@/helpers/util";
import MessageBox from "@/components/MessageBox";
import Loading from "@/components/Loading";
import Header from "@/components/Header";

export default function Home() {
  const loadingState = useLoadingStore((state) => state.loadingState);
  const messageList = useMessageStore((state) => state.messages);

  return (
    <div className="flex flex-col items-center justify-start h-full">
      <Header />
      <div className="flex-1 w-full h-full overflow-auto  mt-[1px] flex  justify-center">
        <div className="flex flex-col items-center h-full pt-3 mx-3 w-[80%]">
          <div
            className="flex flex-col flex-1 w-full mb-3 overflow-auto"
            id="messagelist"
          >
            <MessageList
              streaming={isStreaming(loadingState)}
              messageList={messageList}
            />
            <Loading
              isActive={isLoading(loadingState)}
              className="py-3 pl-12"
            />
          </div>
          <MessageBox className="w-full" />
          <div className="py-3 text-xs font-semibold text-center text-slate-400">
            GPT Powered Documentation for Startup Leadership Program.
          </div>
        </div>
      </div>
    </div>
  );
}
