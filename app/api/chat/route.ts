import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { getModelById, DEFAULT_MODEL } from "@/lib/ai-models";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create OpenRouter provider instance
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const tools = {
  editDocument: tool({
    description: "Edit the current document content or translation",
    parameters: z.object({
      type: z.enum(["source", "translation"]).describe("Which part to edit"),
      content: z.string().describe("The new content"),
      reason: z.string().describe("Explanation of the changes made"),
    }),
    execute: async ({ type, content, reason }) => {
      // In a real implementation, this would update the document in the database
      return {
        success: true,
        message: `${type === "source" ? "Source" : "Translation"} updated: ${reason}`,
        content,
      };
    },
  }),

  searchWeb: tool({
    description: "Search the web for current information using Perplexity API",
    parameters: z.object({
      query: z.string().describe("The search query"),
      focus: z
        .enum(["academic", "writing", "math", "programming", "finance"])
        .optional()
        .describe("Search focus area"),
    }),
    execute: async ({ query, focus }) => {
      try {
        const response = await fetch(
          "https://api.perplexity.ai/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.1-sonar-small-128k-online",
              messages: [
                {
                  role: "system",
                  content: focus
                    ? `You are a helpful research assistant. Focus on ${focus} topics.`
                    : "You are a helpful research assistant.",
                },
                {
                  role: "user",
                  content: query,
                },
              ],
              max_tokens: 1000,
              temperature: 0.2,
              return_citations: true,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          result: data.choices[0]?.message?.content || "No results found",
          citations: data.citations || [],
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Search failed",
        };
      }
    },
  }),

  addDictionaryEntry: tool({
    description: "Add a new entry to the project dictionary",
    parameters: z.object({
      source: z.string().describe("Source language term"),
      target: z.string().describe("Target language translation"),
      context: z.string().optional().describe("Usage context or notes"),
    }),
    execute: async ({ source, target, context }) => {
      // In a real implementation, this would add to the database via Convex
      return {
        success: true,
        message: `Added dictionary entry: ${source} → ${target}`,
        entry: { source, target, context },
      };
    },
  }),

  translateText: tool({
    description: "Translate text using the project context and dictionary",
    parameters: z.object({
      text: z.string().describe("Text to translate"),
      sourceLanguage: z.string().optional().describe("Source language"),
      targetLanguage: z.string().optional().describe("Target language"),
      style: z
        .enum(["formal", "informal", "technical", "creative"])
        .optional()
        .describe("Translation style"),
    }),
    execute: async ({ text, style }) => {
      // In a real implementation, this would use a proper translation service
      return {
        success: true,
        translation: `[Translated: ${text}]`, // Mock translation
        confidence: 0.95,
        style: style || "neutral",
      };
    },
  }),
};

function getModelProvider(modelId: string) {
  const model = getModelById(modelId);
  const finalModelId = model?.id || DEFAULT_MODEL;

  // All models are now routed through OpenRouter
  return openrouter(finalModelId);
}

export async function POST(req: Request) {
  const {
    messages,
    context,
    model: selectedModel = DEFAULT_MODEL,
  } = await req.json();

  // Add system context about the current document and dictionary
  const systemMessage = {
    role: "system" as const,
    content: `You are a helpful translation and writing assistant with access to powerful tools. You can:

1. Edit documents directly using the editDocument tool
2. Search the web for current information using searchWeb tool  
3. Add entries to the project dictionary using addDictionaryEntry tool
4. Translate text using translateText tool

Current Context:
${
  context?.document
    ? `Current Document:
Title: ${context.document.title}
Content: ${context.document.content || "No content yet"}
${context.document.translatedContent ? `Translation: ${context.document.translatedContent}` : ""}`
    : ""
}

${
  context?.dictionary?.length > 0
    ? `Project Dictionary:
${context.dictionary.map((entry: { source: string; target: string; context?: string }) => `${entry.source} → ${entry.target}${entry.context ? ` (${entry.context})` : ""}`).join("\n")}`
    : ""
}

${
  context?.project
    ? `Project Info:
Name: ${context.project.name}
Languages: ${context.project.sourceLanguage} → ${context.project.targetLanguage}`
    : ""
}

Use tools when appropriate to help with translation work, research, and document editing. Always explain what you're doing when using tools.`,
  };

  const modelConfig = getModelById(selectedModel);
  const shouldIncludeTools = modelConfig?.supportsTools ?? true;

  const result = streamText({
    model: getModelProvider(selectedModel),
    messages: [systemMessage, ...messages],
    tools: shouldIncludeTools ? tools : undefined,
    temperature: 0.7,
    maxTokens: 2000,
  });

  return result.toDataStreamResponse();
}
