import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

// Mount it to open, unmount it (via onClose) to close.
export default function Modal({ title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    dialog?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()} // backdrop click
      className="m-auto w-[calc(100%-2rem)] max-w-md border-2 border-ink bg-paper p-0 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-5">
        <header className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold wrap-break-word">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => ref.current?.close()}
            className="size-7 shrink-0 cursor-pointer border-2 border-ink bg-white leading-none font-bold hover:bg-bauhaus-red hover:text-white"
          >
            ×
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}   