export type ChatStreamRequest = {
  question: string;
  history: [];
};

export type MessageType = "apiMessage" | "userMessage";

export type Message = {
  type: MessageType;
  message: string;
  metadata?: DocumentMetadata[];
};

export type DocumentMetadata = {
  loc: {
    lines: {
      to: number;
      from: number;
    };
  };
  source: string;
};

export type MessageStore = {
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  messages: Message[];
  setMessage: (message: Message, index: number) => void;
  setMessages: (messages: Message[]) => void;
  setSourceMetadata: (metadata: DocumentMetadata[], index: number) => void;
  pushMessage: (message: Message) => void;
};

export type LoadingState =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "streaming";

export type LoadingStateStore = {
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
};

export type DecodedChatStream = string & {
  metadata: DocumentMetadata[];
};
