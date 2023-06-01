"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { scrollToBottom } from "@/helpers/util";
import { Message } from "postcss";

type MessageListProps = {
  streaming: boolean;
  messageList: Message[];
};

function MessageList(props: MessageListProps) {
  const { streaming, messageList } = props;

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      scrollToBottom(messageListRef.current);
    }
  }, [messageList]);

  return (
    <div ref={messageListRef}>
      {messageList?.map((message, index) => (
        <div key={`message_container_ ${index}`}>
          <div
            key={"message_" + index}
            className={`flex flex-col p-4 text-sm   ${
              message.type === "apiMessage" ? "bg-secondary" : "bg-white"
            }  border-b-2   ${
              message.type === "apiMessage" &&
              index === messageList.length - 1 &&
              streaming
                ? "border-emerald-400 blinking"
                : "border-transparent"
            }`}
          >
            <div className={`flex items-start w-full `}>
              {message.type === "apiMessage" ? (
                <Image
                  src="/logo-mini.png"
                  alt="AI"
                  width={24}
                  height={24}
                  priority
                />
              ) : (
                <Image
                  key={"usermessage_" + index}
                  src="/usericon.png"
                  alt="AI"
                  width={24}
                  height={24}
                  priority
                />
              )}
              <div className={`flex flex-col w-full`}>
                <div
                  className={` writer-text w-full message_markdown ml-4  text-sm whitespace-break-spaces leading-[200%] 
                  ${
                    message.type !== "apiMessage"
                      ? " text-black font-bold"
                      : " text-primary"
                  }
                  `}
                >
                  {message.message}
                </div>
                {message?.metadata?.length ? (
                  <div className="flex flex-col ml-4">
                    <div className="py-1 mt-3 text-sm font-bold tracking-tight transition-colors border-t text-neutral-400 ">
                      Verified Sources
                    </div>
                    <div className="flex space-x-2">
                      {[
                        ...new Set(
                          message?.metadata?.map((meta) => meta.source)
                        ),
                      ]
                        .slice(0, 4)
                        .map((doc, dindex) => (
                          <a
                            target="_blank"
                            key={"sourcedacs_" + dindex}
                            className="text-primary hover:text-emerald-600 hover:underline no-underline max-w-[200px] py-1  overflow-hidden truncate"
                            href={doc}
                          >
                            {dindex + 1}. {doc}
                          </a>
                        ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
