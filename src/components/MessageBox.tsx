"use client";
import React, { useCallback, useEffect, useRef } from "react";

import { useToast } from "@/components/ui/use-toast";

import { useLoadingStore, useMessageStore } from "@/store";

import { isLoading, isStreaming, isValidJSON } from "@/helpers/util";

import { Send, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

import { chatStream } from "@/helpers/api";
import { LoadingStateMap } from "@/helpers/constants";
import { DecodedChatStream } from "@/types";

type ChatBoxProps = {
  className: string;
};
function MessageBox(props: ChatBoxProps) {
  const { id: chatId } = useParams();

  const router = useRouter();
  const { className } = props;
  const textAreaRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const currentQuery = useMessageStore((state) => state.currentQuery);
  const setCurrentQuery = useMessageStore((state) => state.setCurrentQuery);
  const pushMessage = useMessageStore((state) => state.pushMessage);

  const loadingState = useLoadingStore((state) => state.loadingState);
  const setLoadingState = useLoadingStore((state) => state.setLoadingState);
  const messageList = useMessageStore((state) => state.messages);
  const setMessage = useMessageStore((state) => state.setMessage);
  const setSourceMetadata = useMessageStore((state) => state.setSourceMetadata);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, [loadingState, currentQuery]);

  const handleAnswer = useCallback(async () => {
    const question = currentQuery.trim();

    setCurrentQuery("");
    setLoadingState(LoadingStateMap.loading);

    pushMessage({
      type: "userMessage",
      message: question,
    });

    try {
      const streamIndex = messageList.length + 1;

      const response = await chatStream(currentQuery, messageList);

      if (response.status !== 200) {
        throw new Error(`Response status: ${response.statusText}`);
      }
      if (!response?.body) {
        throw new Error("Response has no body.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setLoadingState(LoadingStateMap.streaming);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value);

        const isJSON = isValidJSON(chunk);

        if (isJSON) {
          const parsedValue = JSON.parse(chunk) as DecodedChatStream;

          setSourceMetadata(parsedValue.metadata, streamIndex);
        } else {
          setMessage(
            {
              type: "apiMessage",
              message:
                (useMessageStore.getState().messages[streamIndex]?.message ??
                  "") + chunk,
            },
            streamIndex
          );
        }
      }
    } catch (error) {
      setLoadingState(LoadingStateMap.idle);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
    }

    setLoadingState(LoadingStateMap.idle);
  }, [currentQuery, messageList]);

  const handleEnter = (e: any) => {
    if (e.key === "Enter" && currentQuery) {
      handleAnswer();
    } else if (e.key == "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`flex items-center space-x-0 border-2 border-secondary w-[80%]  divide-x-2 p-2 relative 
 ${className}`}
    >
      <input
        ref={textAreaRef}
        className="p-2 outline-none w-[90%] flex h-full "
        type="text"
        placeholder={"Ask a question..."}
        value={currentQuery}
        onChange={(e) => setCurrentQuery(e.target.value)}
        onKeyDown={handleEnter}
      />
      {isLoading(loadingState) || isStreaming(loadingState) ? (
        <Button disabled type="button" className="bg-orange-600 ">
          <LoaderIcon className="inline mr-2 text-white animate-spin" />
        </Button>
      ) : (
        <Button className="bg-orange-600" onClick={handleAnswer}>
          <Send className="inline w-4 h-4 mr-2 text-white" />
        </Button>
      )}
    </div>
  );
}

export default MessageBox;
