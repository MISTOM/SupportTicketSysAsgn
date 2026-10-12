import { useEffect, useState } from 'react'
import { getStats, listTickets, updateTicket } from './api/tickets'
import type { Priority, Stats, Status, Ticket, TicketPage } from './types'
import FilterTabs, { type Filter } from './components/FilterTabs'
import TicketRow from './components/TicketRow'
import TicketForm from './components/TicketForm'
import TicketDetail from './components/TicketDetail'
import Pagination from './components/Pagination'

const LIMIT = 10

export default function App() {
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)
  const [tickets, setTickets] = useState<TicketPage | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0) // bump to refetch
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Ticket | null>(null)

  useEffect(() => {
    let stale = false
    Promise.all([
      listTickets({ status: filter === 'all' ? undefined : filter, page, limit: LIMIT }),
      getStats(),
    ])
      .then(([ticketsResponse, statsResponse]) => {
        if (stale) return
        setTickets(ticketsResponse)
        setStats(statsResponse)
        setError(null)
      })
      .catch((caughtError: Error) => {
        if (!stale) setError(caughtError.message)
      })
    return () => {
      stale = true
    }
  }, [filter, page, version])

  // If the last item on the last page moved away, step back a page.
  useEffect(() => {
    if (tickets && tickets.data.length === 0 && page > 1) {
      setPage(Math.max(1, tickets.totalPages))
    }
  }, [tickets, page])

  const refresh = () => setVersion((currentVersion) => currentVersion + 1)

  const changeFilter = (nextFilter: Filter) => {
    setFilter(nextFilter)
    setPage(1)
  }

  async function patchTicket(id: string, patch: { status?: Status; priority?: Priority }) {
    try {
      const updated = await updateTicket(id, patch)
      setSelected((currentSelectedTicket) =>
        currentSelectedTicket?.id === id ? updated : currentSelectedTicket,
      ) // keep the open modal in sync
      refresh()
    } catch (caughtError) {
      setError((caughtError as Error).message)
    }
  }

  function created() {
    setShowForm(false)
    setFilter('all')
    setPage(1)
    refresh()
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <span className="size-4 bg-bauhaus-red" />
          Tickets
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="cursor-pointer border-2 border-ink bg-bauhaus-yellow px-4 py-2 text-sm font-bold hover:brightness-95"
        >
          + New ticket
        </button>
      </header>

      <FilterTabs value={filter} onChange={changeFilter} stats={stats} />

      {error && (
        <p className="mt-4 border-2 border-bauhaus-red bg-white px-3 py-2 text-sm font-bold text-bauhaus-red">
          {error}
        </p>
      )}

      <div className="mt-4 space-y-3">
        {!tickets && !error && <p className="text-sm">Loading…</p>}
        {tickets?.data.length === 0 && <p className="text-sm">No tickets here yet.</p>}
        {tickets?.data.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} onOpen={setSelected} onPatch={patchTicket} />
        ))}
      </div>

      {tickets && <Pagination page={tickets.page} totalPages={tickets.totalPages} onChange={setPage} />}

      {showForm && <TicketForm onClose={() => setShowForm(false)} onCreated={created} />}
      {selected && (
        <TicketDetail ticket={selected} onClose={() => setSelected(null)} onPatch={patchTicket} />
      )}
    </main>
  )
}