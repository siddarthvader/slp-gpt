import { MessageStore } from "@/types";
import { create } from "zustand";

export const useMessageStore = create<MessageStore>((set) => ({
  currentQuery: "",
  setCurrentQuery: (currentQuery) =>
    set((state) => {
      return { currentQuery };
    }),
  messages: [],
  setMessage: (message, index) =>
    set((state) => {
      const messages = [...state.messages];
      messages[index] = message;
      return { messages };
    }),
  setMessages: (messages) =>
    set((state) => {
      return { messages };
    }),

  setSourceMetadata(metadata, index) {
    set((state) => {
      const messages = [...state.messages];
      messages[index].metadata = metadata;
      return { messages };
    });
  },
  pushMessage: (message) =>
    set((state) => {
      const messages = [...state.messages, message];
      return { messages };
    }),
}));

export const useLoadingStore = create<LoadingStateStore>((set) => ({
  loadingState: "idle",
  setLoadingState: (loadingState) =>
    set((state) => {
      return { loadingState };
    }),
}));
