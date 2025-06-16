import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    console.log("Ingesting document with fileId:", args.fileId);
    console.log("Number of text chunks:", args.splitText.length);

    // Create metadata for each text chunk with page numbers
    const metadataArray = args.splitText.map(chunk => ({
      fileId: args.fileId,
      pageNumber: chunk.pageNumber
    }));

    // Extract content from the new format
    const textContent = args.splitText.map(chunk => chunk.content);

    await ConvexVectorStore.fromTexts(
      textContent, // Array of text chunks
      metadataArray, // Array of metadata objects with page numbers
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    console.log("Document ingestion completed for fileId:", args.fileId);
    return "Completed..."
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    console.log("Searching for query:", args.query);
    console.log("FileId:", args.fileId);

    // Get more results initially (10) to increase chances of finding relevant content for this file
    const allResults = await vectorStore.similaritySearch(args.query, 10);
    console.log("All search results:", allResults.length);

    // Filter by fileId
    const resultOne = allResults.filter(q => q.metadata.fileId == args.fileId);
    console.log("Filtered results for fileId:", resultOne.length);
    console.log("Final results:", resultOne);

    return JSON.stringify(resultOne);
  },
});