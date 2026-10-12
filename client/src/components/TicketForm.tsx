import { useState, type FormEvent } from 'react'
import { createTicket } from '../api/tickets'
import type { Priority } from '../types'
import Modal from './Modal'
import { PriorityButtons } from './controls'

interface Props {
  onClose: () => void
  onCreated: () => void
}

const fieldClasses =
  'w-full border-2 border-ink bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-bauhaus-blue'

export default function TicketForm({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return setError('Title is required')
    setSaving(true)
    try {
      await createTicket({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      })
      onCreated()
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  return (
    <Modal title="New ticket" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase">Title</span>
          <input
            data-autofocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase">Description</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={fieldClasses}
          />
        </label>

        <div>
          <span className="mb-1 block text-xs font-bold uppercase">Priority</span>
          <PriorityButtons value={priority} onChange={setPriority} />
        </div>

        {error && <p className="text-sm font-bold text-bauhaus-red">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-2 border-ink bg-white px-4 py-2 text-sm font-bold hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer border-2 border-ink bg-bauhaus-red px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}