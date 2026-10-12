import type { Priority, Status, Ticket } from '../types'
import { PriorityMark, StatusButtons } from './controls'

interface Props {
  ticket: Ticket
  onOpen: (ticket: Ticket) => void
  onPatch: (id: string, patch: { status?: Status; priority?: Priority }) => void
}

export default function TicketRow({ ticket, onOpen, onPatch }: Props) {
  return (
    <article
      onClick={() => onOpen(ticket)}
      className="cursor-pointer border-2 border-ink bg-white p-4 hover:bg-paper"
    >
      <div className="flex items-start justify-between gap-4">
        <h2>
          <button type="button" className="cursor-pointer text-left font-bold">
            {ticket.title}
          </button>
        </h2>
        <span className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase">
          <PriorityMark priority={ticket.priority} />
          {ticket.priority}
        </span>
      </div>

      {ticket.description && <p className="mt-1 line-clamp-1 text-sm">{ticket.description}</p>}

      <div className="mt-3 flex items-center justify-between gap-4">
        {/* stop the click so changing status doesn't also open the modal */}
        <div onClick={(e) => e.stopPropagation()}>
          <StatusButtons value={ticket.status} onChange={(status) => onPatch(ticket.id, { status })} />
        </div>
        <time className="text-xs" dateTime={ticket.createdAt}>
          {new Date(ticket.createdAt).toLocaleDateString()}
        </time>
      </div>
    </article>
  )
}