import { LoadingState } from "@/types";

export const LoadingStateMap: Record<string, LoadingState> = {
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error",
  streaming: "streaming",
};
