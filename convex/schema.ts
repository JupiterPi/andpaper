import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    journalEntries: defineTable({
        text: v.string(),
        indentation: v.number(),
    })
})