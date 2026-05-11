import type { ReactNode } from 'react'

export type TabButtonProps = {
  active: boolean
  onClick: () => void
  children: ReactNode
}

export default function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative flex-1 rounded-xl px-4 py-3 text-left font-medium transition',
        'focus:outline-none focus:ring-2 focus:ring-primary/40',
        active
          ? 'bg-primary text-white shadow'
          : 'bg-white text-slate-700 hover:bg-slate-50',
      ].join(' ')}
    >
      {children}
      {active ? (
        <span className="pointer-events-none absolute inset-x-3 -bottom-2 h-1 rounded-full bg-primary" />
      ) : null}
    </button>
  )
}
