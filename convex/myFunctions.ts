import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Demo functions for the translation app

export const getUserInfo = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { viewer: null };
    }
    
    const user = await ctx.db.get(userId);
    return {
      viewer: user?.email ?? null,
    };
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { projects: 0, documents: 0 };
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    return {
      projects: projects.length,
      documents: documents.length,
    };
  },
});
