import classNames from "classnames"
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
  const [editedText, setEditedText] = useState<string | undefined>(undefined)
  const text = editedText ?? entry?.text ?? ""
  const [indentation, setIndentation] = useState(entry?.indentation ?? lastEntryIndentation ?? 0)

  const addEntry = useMutation(api.journalEntries.addEntry)
  const updateEntry = useMutation(api.journalEntries.updateEntry)

  const [debouncedText] = useDebounce(text, 500, { maxWait: 2000 })
  useEffect(() => {
    if (entry) {
      updateEntry({ id: entry._id, text: debouncedText, indentation: entry.indentation })
    }
  }, [debouncedText])

  return <div className="flex gap-1" style={{ paddingLeft: `${(indentation) * 15}px` }}>
    <span className="text-gray-500 select-none relative">&bull;</span>
    <div className="px-1 py-0.5">
      <input
        type="text" placeholder="New entry..." className="border-none outline-none"
        value={text}
        onChange={(e) => setEditedText(e.target.value)}
        onKeyDown={async (e) => { // change indentation
          if (e.key === "Tab") {
            e.preventDefault()
            setIndentation((prev) => {
              const newIndentation = prev + (e.shiftKey ? -1 : +1)
              if (lastEntryIndentation && (newIndentation - lastEntryIndentation > 1)) return prev // prevent skipping indentations
              return Math.max(0, newIndentation) // prevent negative indentation
            })
          }
          if (e.key === "Enter") { // submit
            await addEntry({ text, indentation })
            setEditedText(undefined)
          }
        }}
      />
    </div>
  </div>
}