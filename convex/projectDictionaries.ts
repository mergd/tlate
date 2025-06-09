import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user has access to project
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) {
      throw new Error("Project not found or unauthorized");
    }

    const dictionary = await ctx.db
      .query("projectDictionaries")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    return dictionary || { projectId: args.projectId, entries: [] };
  },
});

export const addEntry = mutation({
  args: {
    projectId: v.id("projects"),
    source: v.string(),
    target: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user has access to project
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) {
      throw new Error("Project not found or unauthorized");
    }

    const now = Date.now();
    const newEntry = {
      source: args.source.trim(),
      target: args.target.trim(),
      context: args.context?.trim(),
      createdAt: now,
    };

    // Get existing dictionary or create new one
    const existingDictionary = await ctx.db
      .query("projectDictionaries")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    if (existingDictionary) {
      // Update existing dictionary
      await ctx.db.patch(existingDictionary._id, {
        entries: [...existingDictionary.entries, newEntry],
        updatedAt: now,
      });
    } else {
      // Create new dictionary
      await ctx.db.insert("projectDictionaries", {
        projectId: args.projectId,
        entries: [newEntry],
        createdAt: now,
        updatedAt: now,
      });
    }

    return newEntry;
  },
});

export const updateEntry = mutation({
  args: {
    projectId: v.id("projects"),
    entryIndex: v.number(),
    source: v.string(),
    target: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user has access to project
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) {
      throw new Error("Project not found or unauthorized");
    }

    const dictionary = await ctx.db
      .query("projectDictionaries")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    if (!dictionary || args.entryIndex < 0 || args.entryIndex >= dictionary.entries.length) {
      throw new Error("Dictionary entry not found");
    }

    const updatedEntries = [...dictionary.entries];
    updatedEntries[args.entryIndex] = {
      ...updatedEntries[args.entryIndex],
      source: args.source.trim(),
      target: args.target.trim(),
      context: args.context?.trim(),
    };

    await ctx.db.patch(dictionary._id, {
      entries: updatedEntries,
      updatedAt: Date.now(),
    });

    return updatedEntries[args.entryIndex];
  },
});

export const removeEntry = mutation({
  args: {
    projectId: v.id("projects"),
    entryIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user has access to project
    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== userId) {
      throw new Error("Project not found or unauthorized");
    }

    const dictionary = await ctx.db
      .query("projectDictionaries")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    if (!dictionary || args.entryIndex < 0 || args.entryIndex >= dictionary.entries.length) {
      throw new Error("Dictionary entry not found");
    }

    const updatedEntries = dictionary.entries.filter((_, index) => index !== args.entryIndex);

    await ctx.db.patch(dictionary._id, {
      entries: updatedEntries,
      updatedAt: Date.now(),
    });

    return true;
  },
});