const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("langchain/embeddings");

const { SupabaseVectorStore } = require("langchain/vectorstores/supabase");

const {
  CheerioWebBaseLoader,
} = require("langchain/document_loaders/web/cheerio");


const { loadEnvConfig } = require("@next/env");
loadEnvConfig("");

const { dbConfig } = require("../config");

async function saveSitemapHtml() {
  try {
    const sitemapPath = path.join(__dirname, "sitemap.xml");
    const sitemapXml = fs.readFileSync(sitemapPath, "utf-8");

    // Load the XML content using cheerio
    const $ = cheerio.load(sitemapXml, { xmlMode: true });

    // Find all <loc> elements and extract URLs
    const urls = $("loc")
      .map((_, elem) => $(elem).text())
      .get();


    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-ada-002",
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 500,
    });

    for (const url of urls) {
      console.log({ url });

      const loader = new CheerioWebBaseLoader(url, {
        selector: "main",
      });

      loader.scrape



      const docs = await loader.loadAndSplit(textSplitter);


      await SupabaseVectorStore.fromDocuments(
        docs,
        embeddings,
        dbConfig
      );
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example usage:
saveSitemapHtml();
