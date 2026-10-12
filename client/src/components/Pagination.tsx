interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const buttonClasses =
  'cursor-pointer border-2 border-ink bg-white px-3 py-1 text-sm font-bold hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40'

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <nav className="mt-6 flex items-center justify-between">
      <button className={buttonClasses} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span className="text-sm">
        Page {page} of {totalPages}
      </span>
      <button className={buttonClasses} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  )
}