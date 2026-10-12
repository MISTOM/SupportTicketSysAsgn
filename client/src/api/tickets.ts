import type { Ticket, TicketPage, Stats, Status, Priority } from '../types'

// Shared fetch
async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...init,
    })

    if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed (${response.status})`)
    }

    return response.json()
}

// Fetch a paginated list of tickets, optionally filtered by status.
export const listTickets = (params: { status?: Status; page: number; limit: number }) => {
    const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
    })

    if (params.status) query.set('status', params.status)

    return request<TicketPage>(`/tickets?${query}`)
}

export const getStats = () => request<Stats>('/tickets/stats')

export const createTicket = (body: {
    title: string
    description?: string
    priority?: Priority
}) => request<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(body) })

export const updateTicket = (id: string, body: { status?: Status; priority?: Priority }) =>
    request<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(body) })