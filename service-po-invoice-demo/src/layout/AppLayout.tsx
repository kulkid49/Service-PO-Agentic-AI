import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Network, Workflow } from 'lucide-react'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'relative px-3 py-2 text-sm font-medium transition',
          'text-slate-200 hover:text-white',
          isActive ? 'text-white' : '',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive ? (
            <motion.span
              layoutId="nav-underline"
              className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-primary"
            />
          ) : null}
        </>
      )}
    </NavLink>
  )
}

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <Workflow size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">
                Agentic AI Ops
              </div>
              <div className="text-xs text-slate-300">
                Service PO-based Invoice Posting
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <NavItem to="/prerequisites" label="Master Data Prerequisites" />
            <NavItem to="/agentic-flow" label="Agentic AI Operation" />
          </nav>

          <div className="hidden items-center gap-2 text-xs text-slate-300 lg:flex">
            <Network size={16} className="text-primary" />
            Enterprise Demo Dashboard
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
