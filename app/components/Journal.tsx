import classNames from "classnames"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"

type Entry = Doc<"journalEntries">

export default function Journal() {
  const entries = useQuery(api.journalEntries.getEntries) || []
  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null

  return <div className="border-1 p-4 flex-col">
    {/* entries */}
    {entries.map((entry, index) => (
      <JournalEntry key={index} entry={entry} lastEntryIndentation={lastEntry?.indentation} />
    ))}

    {/* new entry */}
    <JournalEntry entry={null} lastEntryIndentation={lastEntry?.indentation} />
  </div>
}

function JournalEntry({ entry, lastEntryIndentation }: { entry: Entry | null, lastEntryIndentation: number | undefined }) {
  const [newEntryText, setNewEntryText] = useState("")
  const [newEntryIndentation, setNewEntryIndentation] = useState(lastEntryIndentation ?? 0)
  useEffect(() => {
    if (lastEntryIndentation !== undefined) {
      setNewEntryIndentation(lastEntryIndentation)
    }
  }, [lastEntryIndentation])

  const addEntry = useMutation(api.journalEntries.addEntry)
  const [deleted, setDeleted] = useState(false)
  const deleteEntry = useMutation(api.journalEntries.deleteEntry)

  return <div className="flex gap-1" style={{ paddingLeft: `${(entry?.indentation ?? newEntryIndentation) * 15}px` }}>
    <span className="text-gray-500 select-none relative">&bull;</span>
    <div className={classNames(
      "hover:bg-gray-200 rounded-md transition-[background]",
      "cursor-pointer px-1 py-0.5"
    )} onClick={async () => {
      if (entry !== null && !deleted) {
        setDeleted(true)
        await deleteEntry({ id: entry._id })
      }
    }}>
      {entry?.text}
      {entry === null && <input
        type="text" placeholder="New entry..." className="border-none outline-none"
        value={newEntryText}
        onChange={(e) => setNewEntryText(e.target.value)}
        onKeyDown={async (e) => { // change indentation
          if (e.key === "Tab") {
            e.preventDefault()
            setNewEntryIndentation((prev) => {
              const newIndentation = prev + (e.shiftKey ? -1 : +1)
              if (lastEntryIndentation && (newIndentation - lastEntryIndentation > 1)) return prev // prevent skipping indentations
              return Math.max(0, newIndentation) // prevent negative indentation
            })
          }
          if (e.key === "Enter") { // submit
            await addEntry({ text: newEntryText, indentation: newEntryIndentation })
            setNewEntryText("")
          }
        }}
      />}
    </div>
  </div>
}