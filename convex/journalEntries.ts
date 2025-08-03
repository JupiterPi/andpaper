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
        text: v.string(),
        indentation: v.number(),
    },
    handler: async (ctx, args) => {
        const { id, text, indentation } = args
        validateText(text)
        validateIndentation(indentation)
        await ctx.db.patch(id, { text, indentation })
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