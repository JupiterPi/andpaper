import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"

type Entry = Doc<"journalEntries">

export default function Journal() {
  const entries = useQuery(api.journalEntries.getEntries) || []
  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null

  return <div className="p-4 flex-col">
    {/* entries */}
    {entries.map((entry, index) => (
      <JournalEntry key={index} entry={entry} lastEntryIndentation={lastEntry?.indentation} />
    ))}

    {/* new entry */}
    <JournalEntry entry={null} lastEntryIndentation={lastEntry?.indentation} />
  </div>
}

function JournalEntry({ entry, lastEntryIndentation }: { entry: Entry | null, lastEntryIndentation: number | undefined }) {
  const addEntry = useMutation(api.journalEntries.addEntry)
  const updateEntry = useMutation(api.journalEntries.updateEntry)
  const deleteEntry = useMutation(api.journalEntries.deleteEntry)

  const [editedText, setEditedText] = useState<string | undefined>(undefined)
  const text = editedText ?? entry?.text ?? ""
  const [debouncedText] = useDebounce(text, 500, { maxWait: 2000 })
  useEffect(() => {
    if (entry) {
      updateEntry({ id: entry._id, text: debouncedText })
    }
  }, [debouncedText])

  const [editedIndentation, setEditedIndentation] = useState<number | undefined>(undefined)
  const indentation = editedIndentation ?? entry?.indentation ?? 0
  useEffect(() => {
    let cancel = false
    if (editedIndentation !== undefined && entry !== null) {
      console.log("Updating indentation", indentation)
      updateEntry({ id: entry._id, indentation }).then(() => {
        console.log("Updated indentation", indentation)
        if (cancel) return
        setEditedIndentation(undefined)
      })
    }
    return () => { cancel = true }
  }, [editedIndentation])

  return <div className="flex gap-1 w-full" style={{ paddingLeft: `${(indentation) * 15}px` }}>
    <span className="text-gray-500 select-none relative" onClick={() => deleteEntry({ id: entry!._id })}>&bull;</span>
    <div className="px-1 py-0.5 w-full">
      <textarea
        placeholder="New entry..." className="border-none resize-none outline-none w-full field-sizing-content"
        value={text}
        onChange={(e) => setEditedText(e.target.value)}
        onKeyDown={async (e) => { // change indentation
          if (e.key === "Tab") {
            e.preventDefault()
            const newIndentation = indentation + (e.shiftKey ? -1 : +1)
            if (lastEntryIndentation && (newIndentation - lastEntryIndentation > 1)) return // prevent skipping indentations
            setEditedIndentation(Math.max(0, newIndentation)) // prevent negative indentation
          }
          if (e.key === "Enter") { // submit
            e.preventDefault()
            await addEntry({ text, indentation })
            setEditedText(undefined)
          }
        }}
      />
    </div>
  </div>
}