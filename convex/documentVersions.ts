import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    translatedContent: v.optional(v.string()),
    comment: v.optional(v.string()),
    instructions: v.optional(v.string()),
    aiModel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify document ownership
    const document = await ctx.db.get(args.documentId);
    if (!document || document.ownerId !== userId) {
      throw new Error("Document not found");
    }

    // Get next version number
    const existingVersions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    
    const nextVersion = existingVersions.length + 1;

    const now = Date.now();
    const versionId = await ctx.db.insert("documentVersions", {
      documentId: args.documentId,
      content: args.content,
      translatedContent: args.translatedContent,
      versionNumber: nextVersion,
      comment: args.comment,
      instructions: args.instructions,
      aiModel: args.aiModel,
      createdAt: now,
      createdBy: userId,
    });

    // Update document's current version
    await ctx.db.patch(args.documentId, {
      currentVersionId: versionId,
      updatedAt: now,
    });

    return versionId;
  },
});

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify document ownership
    const document = await ctx.db.get(args.documentId);
    if (!document || document.ownerId !== userId) {
      return [];
    }

    return await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("documentVersions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const version = await ctx.db.get(args.id);
    if (!version) {
      throw new Error("Version not found");
    }

    // Verify document ownership
    const document = await ctx.db.get(version.documentId);
    if (!document || document.ownerId !== userId) {
      throw new Error("Document not found");
    }

    return version;
  },
});

export const updateTranslation = mutation({
  args: {
    id: v.id("documentVersions"),
    translatedContent: v.string(),
    aiModel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const version = await ctx.db.get(args.id);
    if (!version) {
      throw new Error("Version not found");
    }

    // Verify document ownership
    const document = await ctx.db.get(version.documentId);
    if (!document || document.ownerId !== userId) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(args.id, {
      translatedContent: args.translatedContent,
      aiModel: args.aiModel,
    });
  },
});

export const searchContent = query({
  args: { 
    query: v.string(),
    documentId: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Search in original content
    let contentResults = await ctx.db
      .query("documentVersions")
      .withSearchIndex("search_content", (q) => {
        let search = q.search("content", args.query);
        if (args.documentId) {
          search = search.eq("documentId", args.documentId);
        }
        return search;
      })
      .collect();

    // Search in translated content
    let translatedResults = await ctx.db
      .query("documentVersions")
      .withSearchIndex("search_translated_content", (q) => {
        let search = q.search("translatedContent", args.query);
        if (args.documentId) {
          search = search.eq("documentId", args.documentId);
        }
        return search;
      })
      .collect();

    // Filter by user ownership and combine results
    const allResults = [...contentResults, ...translatedResults];
    const userResults = [];
    
    for (const version of allResults) {
      const document = await ctx.db.get(version.documentId);
      if (document && document.ownerId === userId) {
        userResults.push({
          ...version,
          document,
        });
      }
    }

    // Remove duplicates
    const uniqueResults = userResults.filter((result, index, self) =>
      index === self.findIndex((r) => r._id === result._id)
    );

    return uniqueResults;
  },
});