import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    projectId: v.id("projects"),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify project ownership
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) {
      throw new Error("Project not found");
    }

    const now = Date.now();
    
    // Create document
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      projectId: args.projectId,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    });

    // Create initial version if content provided
    if (args.content) {
      const versionId = await ctx.db.insert("documentVersions", {
        documentId,
        content: args.content,
        versionNumber: 1,
        createdAt: now,
        createdBy: userId,
      });

      // Update document with current version
      await ctx.db.patch(documentId, { currentVersionId: versionId });
    }

    return documentId;
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify project ownership
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) {
      return [];
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document || document.ownerId !== userId) {
      throw new Error("Document not found");
    }

    // Get current version if exists
    let currentVersion = null;
    if (document.currentVersionId) {
      currentVersion = await ctx.db.get(document.currentVersionId);
    }

    return {
      ...document,
      currentVersion,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document || document.ownerId !== userId) {
      throw new Error("Document not found");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document || document.ownerId !== userId) {
      throw new Error("Document not found");
    }

    // Delete all versions first
    const versions = await ctx.db
      .query("documentVersions")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .collect();
    
    for (const version of versions) {
      await ctx.db.delete(version._id);
    }

    // Delete the document
    await ctx.db.delete(args.id);
  },
});

export const search = query({
  args: { 
    query: v.string(),
    projectId: v.optional(v.id("projects"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    let searchQuery = ctx.db
      .query("documents")
      .withSearchIndex("search_documents", (q) => {
        let search = q.search("title", args.query);
        if (args.projectId) {
          search = search.eq("projectId", args.projectId);
        }
        return search.eq("ownerId", userId);
      });

    return await searchQuery.collect();
  },
});