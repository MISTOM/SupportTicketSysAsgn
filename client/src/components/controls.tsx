import type { Priority, Status } from '../types'

export const STATUSES: { key: Status; label: string; active: string }[] = [
  { key: 'open', label: 'Open', active: 'bg-bauhaus-blue text-white' },
  { key: 'in_progress', label: 'In progress', active: 'bg-bauhaus-yellow text-ink' },
  { key: 'closed', label: 'Closed', active: 'bg-ink text-white' },
]

export const PRIORITIES: { key: Priority; label: string }[] = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
]

const PRIORITY_COLOR_CLASSES: Record<Priority, string> = {
  low: 'bg-bauhaus-blue text-white',
  medium: 'bg-bauhaus-yellow text-ink',
  high: 'bg-bauhaus-red text-white',
}

// Priority as a shape: circle = low, square = medium, triangle = high
const SHAPE_CLASSES: Record<Priority, string> = {
  low: 'rounded-full',
  medium: '',
  high: '[clip-path:polygon(50%_0,0_100%,100%_100%)]',
}

export function PriorityMark({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-block size-3 ${PRIORITY_COLOR_CLASSES[priority].split(' ')[0]} ${SHAPE_CLASSES[priority]}`}
    />
  )
}

const buttonGroupClasses = 'flex w-fit border-2 border-ink'
const buttonSegmentClasses =
  'flex cursor-pointer items-center gap-2 border-r-2 border-ink px-2 py-1 text-xs font-bold last:border-r-0'

export function StatusButtons({ value, onChange }: { value: Status; onChange: (status: Status) => void }) {
  return (
    <div className={buttonGroupClasses}>
      {STATUSES.map((statusOption) => (
        <button
          key={statusOption.key}
          type="button"
          aria-pressed={value === statusOption.key}
          onClick={() => value !== statusOption.key && onChange(statusOption.key)}
          className={`${buttonSegmentClasses} ${value === statusOption.key ? statusOption.active : 'bg-white hover:bg-paper'}`}
        >
          {statusOption.label}
        </button>
      ))}
    </div>
  )
}

export function PriorityButtons({
  value,
  onChange,
}: {
  value: Priority
  onChange: (priority: Priority) => void
}) {
  return (
    <div className={buttonGroupClasses}>
      {PRIORITIES.map((priorityOption) => (
        <button
          key={priorityOption.key}
          type="button"
          aria-pressed={value === priorityOption.key}
          onClick={() => value !== priorityOption.key && onChange(priorityOption.key)}
          className={`${buttonSegmentClasses} ${
            value === priorityOption.key
              ? PRIORITY_COLOR_CLASSES[priorityOption.key]
              : 'bg-white hover:bg-paper'
          }`}
        >
          <PriorityMark priority={priorityOption.key} />
          {priorityOption.label}
        </button>
      ))}
    </div>
  )
}