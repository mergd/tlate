import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    sourceLanguage: v.string(),
    targetLanguage: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .searchIndex("search_projects", {
      searchField: "name",
      filterFields: ["ownerId"]
    }),

  // Documents within projects
  documents: defineTable({
    title: v.string(),
    projectId: v.id("projects"),
    ownerId: v.id("users"),
    currentVersionId: v.optional(v.id("documentVersions")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_owner", ["ownerId"])
    .searchIndex("search_documents", {
      searchField: "title",
      filterFields: ["projectId", "ownerId"]
    }),

  // Document versions for version control
  documentVersions: defineTable({
    documentId: v.id("documents"),
    content: v.string(), // Markdown content
    translatedContent: v.optional(v.string()), // Translated markdown
    versionNumber: v.number(),
    comment: v.optional(v.string()),
    instructions: v.optional(v.string()), // Translation instructions
    aiModel: v.optional(v.string()), // Model used for translation
    createdAt: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_document", ["documentId"])
    .index("by_document_version", ["documentId", "versionNumber"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["documentId"]
    })
    .searchIndex("search_translated_content", {
      searchField: "translatedContent",
      filterFields: ["documentId"]
    }),

  // User-level dictionaries
  userDictionaries: defineTable({
    userId: v.id("users"),
    sourceLanguage: v.string(),
    targetLanguage: v.string(),
    entries: v.array(v.object({
      source: v.string(),
      target: v.string(),
      context: v.optional(v.string()),
      createdAt: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_languages", ["userId", "sourceLanguage", "targetLanguage"]),

  // Project-level dictionaries
  projectDictionaries: defineTable({
    projectId: v.id("projects"),
    entries: v.array(v.object({
      source: v.string(),
      target: v.string(),
      context: v.optional(v.string()),
      createdAt: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"]),

  // AI chat conversations
  chatConversations: defineTable({
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")), // Optional - can be global chat
    projectId: v.optional(v.id("projects")),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_document", ["documentId"])
    .index("by_project", ["projectId"]),

  // Chat messages
  chatMessages: defineTable({
    conversationId: v.id("chatConversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    toolCalls: v.optional(v.array(v.object({
      type: v.string(),
      function: v.string(),
      arguments: v.string(),
      result: v.optional(v.string()),
    }))),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"]),

  // User settings
  userSettings: defineTable({
    userId: v.id("users"),
    preferredAiModel: v.optional(v.string()),
    openRouterApiKey: v.optional(v.string()),
    defaultSourceLanguage: v.optional(v.string()),
    defaultTargetLanguage: v.optional(v.string()),
    uiLanguage: v.optional(v.string()),
    editorSettings: v.optional(v.object({
      theme: v.string(),
      fontSize: v.number(),
      showLineNumbers: v.boolean(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
