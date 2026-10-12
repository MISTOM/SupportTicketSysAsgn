import type { Priority, Status, Ticket } from '../types'

const STATUSES: { key: Status; label: string; active: string }[] = [
  { key: 'open', label: 'Open', active: 'bg-bauhaus-blue text-white' },
  { key: 'in_progress', label: 'In progress', active: 'bg-bauhaus-yellow text-ink' },
  { key: 'closed', label: 'Closed', active: 'bg-ink text-white' },
]

// Priority as a shape: circle = low, square = medium, triangle = high
const SHAPE: Record<Priority, string> = {
  low: 'rounded-full',
  medium: '',
  high: '[clip-path:polygon(50%_0,0_100%,100%_100%)]',
}

interface Props {
  ticket: Ticket
  onStatus: (id: string, status: Status) => void
}

export default function TicketRow({ ticket, onStatus }: Props) {
  return (
    <article className="border-2 border-ink bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-bold">{ticket.title}</h2>
        <span className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase">
          <span className={`inline-block size-3 bg-bauhaus-red ${SHAPE[ticket.priority]}`} />
          {ticket.priority}
        </span>
      </div>

      {ticket.description && <p className="mt-1 text-sm">{ticket.description}</p>}

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex border-2 border-ink">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => ticket.status !== s.key && onStatus(ticket.id, s.key)}
              aria-pressed={ticket.status === s.key}
              className={`cursor-pointer border-r-2 border-ink px-2 py-1 text-xs font-bold last:border-r-0 ${
                ticket.status === s.key ? s.active : 'bg-white hover:bg-paper'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <time className="text-xs" dateTime={ticket.createdAt}>
          {new Date(ticket.createdAt).toLocaleDateString()}
        </time>
      </div>
    </article>
  )
}