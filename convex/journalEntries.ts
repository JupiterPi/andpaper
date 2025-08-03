import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getEntries = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("journalEntries").collect()
    }
})

export const addEntry = mutation({
    args: {
        text: v.string(),
        indentation: v.number(),
    },
    handler: async (ctx, args) => {
        const { text, indentation } = args
        if (!text || text.trim() === "") {
            throw new Error("Text cannot be empty")
        }
        if (indentation < 0) {
            throw new Error("Indentation cannot be negative")
        }
        if (indentation % 1 !== 0) {
            throw new Error("Indentation must be an integer")
        }
        return await ctx.db.insert("journalEntries", { text, indentation })
    }
})

export const deleteEntry = mutation({
    args: {
        id: v.id("journalEntries"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id)
    }
})