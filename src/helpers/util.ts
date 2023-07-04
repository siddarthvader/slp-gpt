import { LoadingState } from "@/types";
import { LoadingStateMap } from "./constants";

export const copyFunction = (copyText: string) => {
  navigator.clipboard.writeText(copyText).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

export function isValidJSON(str: string) {
  try {
    const parsedJSON = JSON.parse(str);
    return (
      typeof parsedJSON === "object" &&
      parsedJSON !== null &&
      !Array.isArray(parsedJSON)
    );
  } catch (error) {
    return false;
  }
}

export const isLoading = (loadingState: LoadingState): boolean => {
  return loadingState === LoadingStateMap.loading;
};

export const isStreaming = (loadingState: LoadingState): boolean => {
  return loadingState === LoadingStateMap.streaming;
};

export const isIdle = (loadingState: LoadingState): boolean => {
  return loadingState === LoadingStateMap.idle;
};

export const scrollToBottom = (element: HTMLElement) => {
  element.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};
