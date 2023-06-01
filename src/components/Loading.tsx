"use client";

import { useLoadingStore } from "@/store";
import React, { useEffect, useRef } from "react";

type LoadingProps = {
  isActive: boolean;
  className: string;
};

function Loading(props: LoadingProps) {
  const { isActive, className } = props;

  const loadingRef = useRef<HTMLDivElement>(null);

  const loadingState = useLoadingStore((state) => state.loadingState);

  useEffect(() => {
    loadingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [loadingState]);

  return isActive ? (
    <div
      className={`flex space-x-4 animate-pulse ${className}`}
      ref={loadingRef}
    >
      <div className="flex-1 py-1 space-y-6">
        <div className="h-2 bg-emerald-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 col-span-1 bg-emerald-200 rounded"></div>
            <div className="h-2 col-span-2 bg-emerald-200 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 col-span-2 bg-emerald-200 rounded"></div>
            <div className="h-2 col-span-1 bg-emerald-200 rounded"></div>
          </div>
          <div className="h-2 bg-emerald-200 rounded"></div>
        </div>
      </div>
    </div>
  ) : null;
}

export default Loading;
