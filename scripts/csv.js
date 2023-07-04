const { CSVLoader } = require("langchain/document_loaders/fs/csv");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const fs = require("fs");
const path = require("path");

const { SupabaseVectorStore } = require("langchain/vectorstores/supabase");

const { dbConfig } = require("../config");

(async () => {

    const csvPath = path.join(__dirname, "docs/SLPDirectory.csv");

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-ada-002",
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const loader = new CSVLoader(csvPath);

    const docs = await loader.load();


    const chunkedDocs = await textSplitter.splitDocuments(docs);
    await SupabaseVectorStore.fromDocuments(
        chunkedDocs,
        embeddings,
        dbConfig
    );

})();

