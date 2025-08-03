import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getEntries = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("journalEntries").collect()
    }
})

const validateText = (text: string) => {
    if (!text || text.trim() === "") {
        throw new Error("Text cannot be empty")
    }
}

const validateIndentation = (indentation: number) => {
    if (indentation < 0) {
        throw new Error("Indentation cannot be negative")
    }
    if (indentation % 1 !== 0) {
        throw new Error("Indentation must be an integer")
    }
}

export const addEntry = mutation({
    args: {
        text: v.string(),
        indentation: v.number(),
    },
    handler: async (ctx, args) => {
        const { text, indentation } = args
        validateText(text)
        validateIndentation(indentation)
        return await ctx.db.insert("journalEntries", { text, indentation })
    }
})

export const updateEntry = mutation({
    args: {
        id: v.id("journalEntries"),
        text: v.optional(v.string()),
        indentation: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, text, indentation } = args
        const entry = await ctx.db.get(id)
        if (text !== undefined) validateText(text)
        if (indentation !== undefined) validateIndentation(indentation)
        if (text !== undefined || indentation !== undefined) await ctx.db.patch(id, { text: text ?? entry!.text, indentation: indentation !== undefined ? indentation : entry!.indentation })
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