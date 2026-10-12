import type { Priority, Status, Ticket } from '../types'
import Modal from './Modal'
import { PriorityButtons, StatusButtons } from './controls'

interface Props {
  ticket: Ticket
  onClose: () => void
  onPatch: (id: string, patch: { status?: Status; priority?: Priority }) => void
}

export default function TicketDetail({ ticket, onClose, onPatch }: Props) {
  return (
    <Modal title={ticket.title} onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm whitespace-pre-wrap">
          {ticket.description || <span className="opacity-60">No description.</span>}
        </p>

        <div>
          <span className="mb-1 block text-xs font-bold uppercase">Status</span>
          <StatusButtons value={ticket.status} onChange={(status: Status) => onPatch(ticket.id, { status })} />
        </div>

        <div>
          <span className="mb-1 block text-xs font-bold uppercase">Priority</span>
          <PriorityButtons
            value={ticket.priority}
            onChange={(priority: Priority) => onPatch(ticket.id, { priority })}
          />
        </div>

        <time className="block text-xs" dateTime={ticket.createdAt}>
          Created {new Date(ticket.createdAt).toLocaleString()}
        </time>
      </div>
    </Modal>
  )
}