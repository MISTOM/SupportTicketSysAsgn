import type { Stats, Status } from '../types'

export type Filter = 'all' | Status

const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'closed', label: 'Closed' },
]

interface Props {
  value: Filter
  onChange: (f: Filter) => void
  stats: Stats | null
}

export default function FilterTabs({ value, onChange, stats }: Props) {
  const count = (k: Filter) => {
    if (!stats) return ''
    return k === 'all' ? Object.values(stats).reduce((a, b) => a + b, 0) : stats[k]
  }

  return (
    <div role="tablist" className="flex border-2 border-ink">
      {TABS.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 cursor-pointer border-r-2 border-ink px-3 py-2 text-sm font-bold last:border-r-0 ${
            value === t.key ? 'bg-bauhaus-yellow' : 'bg-white hover:bg-paper'
          }`}
        >
          {t.label} <span className="font-normal">{count(t.key)}</span>
        </button>
      ))}
    </div>
  )
}