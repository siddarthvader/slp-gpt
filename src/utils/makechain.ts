import { ConversationalRetrievalQAChain } from "langchain/chains";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { supabase_client } from "../../config";
import { loadEnvConfig } from "@next/env";

loadEnvConfig("");

export const makeChain = async (
  question: string,
  history: string[] = []
): Promise<TransformStream<any, any>> => {
  const encoder: TextEncoder = new TextEncoder();
  const stream: TransformStream<any, any> = new TransformStream();
  const writable = stream.writable;
  const writer: WritableStreamDefaultWriter<any> = writable.getWriter();

  const embeddings: OpenAIEmbeddings = new OpenAIEmbeddings({
    // verbose: true,
  });

  const retriever: SupabaseHybridSearch = getReteiever(embeddings);

  const llm: ChatOpenAI = new ChatOpenAI({
    temperature: 0.42,
    streaming: true,
    modelName: "gpt-3.5-turbo",
    callbackManager: llmCallback(writer, encoder),
    verbose: true,
    cache: true,
  });

  const chain: ConversationalRetrievalQAChain =
    ConversationalRetrievalQAChain.fromLLM(llm, retriever, {
      qaTemplate: getQATemplate(),
      questionGeneratorTemplate: generateQuestion(),
      returnSourceDocuments: true,
      callbacks: chainCallBacks(writer, encoder),
    });

  chain.questionGeneratorChain.llm = new ChatOpenAI({
    temperature: 0.42,
    modelName: "gpt-3.5-turbo",
  });

  chain.call({
    question,
    chat_history:
      history.length > 3
        ? history.slice(history.length - 3, history.length) || []
        : history || [],
  });

  return stream;
};

const chainCallBacks = (
  writer: WritableStreamDefaultWriter<any>,
  encoder: TextEncoder
): CallbackManager => {
  return CallbackManager.fromHandlers({
    handleChainEnd: async (output) => {
      await writer.ready;
      const metadata: string[] = [];
      output.sourceDocuments?.forEach(async (doc) => {
        metadata.push(doc.metadata);
      });

      if (metadata.length) {
        await writer.write(encoder.encode(JSON.stringify({ metadata })));
      }

      await writer.close();
    },
    handleChainError: async (e) => {
      console.log("chain error happened");
      await writer.ready;
      await writer.abort(e);
      // throw e;
    },
  });
};

const llmCallback = (
  writer: WritableStreamDefaultWriter<any>,
  encoder: TextEncoder
): CallbackManager => {
  return CallbackManager.fromHandlers({
    handleLLMNewToken: async (token, runId, parentID) => {
      await writer.ready;
      await writer.write(encoder.encode(`${token}`));
    },
  });
};

const getReteiever = (embeddings: OpenAIEmbeddings): SupabaseHybridSearch => {
  return new SupabaseHybridSearch(embeddings, {
    client: supabase_client,
    similarityK: 4,
    keywordK: 4,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
  });
};

const generateQuestion = (): string => {
  return `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question. 
  If the follow up question is not closesly related to the chat history, the chat history must be ignored when generating the standalone question and your job is to repeat the follow up question exactly. 

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;
};

const getQATemplate = (): string => {
  const qa_template = `
  You are a helpful assistant and expert of StartUp Leadership Foundation. 

  You learn from the context provided below and answer the question at the end.
  

  Respond "I dont know" or "Not enough information in context" if not sure about the answer.
  
  Previous Conversation: {chat_history}
  context: {context}

  Generate an answer to the following question. Think steps by steps, take your time.
  Question: {question}


  Helpful Answer:`;

  return qa_template;
};
