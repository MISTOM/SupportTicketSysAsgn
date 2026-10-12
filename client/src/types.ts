export type Status = 'open' | 'in_progress' | 'closed'
export type Priority = 'low' | 'medium' | 'high'

export interface Ticket {
  id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  createdAt: string
}

export interface TicketPage {
  data: Ticket[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type Stats = Record<Status, number>