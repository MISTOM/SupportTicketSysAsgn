import type { Stats, Status } from '../types'

export type Filter = 'all' | Status

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'closed', label: 'Closed' },
]

interface Props {
  value: Filter
  onChange: (filter: Filter) => void
  stats: Stats | null
}

export default function FilterTabs({ value, onChange, stats }: Props) {
  const count = (filterKey: Filter) => {
    if (!stats) return ''
    return filterKey === 'all'
      ? Object.values(stats).reduce((totalCount, currentCount) => totalCount + currentCount, 0)
      : stats[filterKey]
  }

  return (
    <div role="tablist" className="flex border-2 border-ink">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={value === tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 cursor-pointer border-r-2 border-ink px-3 py-2 text-sm font-bold last:border-r-0 ${
            value === tab.key ? 'bg-bauhaus-yellow' : 'bg-white hover:bg-paper'
          }`}
        >
          {tab.label} <span className="font-normal">{count(tab.key)}</span>
        </button>
      ))}
    </div>
  )
}