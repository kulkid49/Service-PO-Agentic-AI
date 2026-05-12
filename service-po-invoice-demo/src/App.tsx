import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const PrerequisitesSection = lazy(() => import('./sections/PrerequisitesSection'))
const StepDemoSection = lazy(() => import('./sections/StepDemoSection'))
const FlowchartSection = lazy(() => import('./sections/FlowchartSection'))

function Loading() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
      <div className="h-6 w-72 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-[32rem] max-w-full animate-pulse rounded bg-slate-100" />
    </div>
  )
}

export default function App() {
  const sections = useMemo(() => ['prerequisites', 'step-demo', 'flowchart'], [])
  const [activeSection, setActiveSection] = useState('prerequisites')

  useEffect(() => {
    let rafId: number | null = null

    const onScroll = () => {
      if (rafId != null) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        const checkpoint = window.scrollY + window.innerHeight * 0.45
        for (const id of sections) {
          const el = document.getElementById(id)
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const top = rect.top + window.scrollY
          const bottom = rect.bottom + window.scrollY
          if (checkpoint >= top && checkpoint <= bottom) {
            setActiveSection(id)
            break
          }
        }
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId != null) window.cancelAnimationFrame(rafId)
    }
  }, [sections])

  const navLinks = [
    { id: 'prerequisites', label: 'Master Data' },
    { id: 'step-demo', label: 'Step Demo' },
    { id: 'flowchart', label: 'Interactive Flowchart' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-12">
          <a href="#top" className="text-lg font-bold text-blue-600">
            Agentic AI Invoice Ops
          </a>
          <div className="hidden items-center gap-5 text-sm text-gray-600 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.id}
                className={`relative pb-1 transition hover:text-blue-600 ${
                  activeSection === link.id ? 'text-blue-600' : ''
                }`}
                href={`#${link.id}`}
                onClick={() => setActiveSection(link.id)}
              >
                {link.label}
                {activeSection === link.id ? (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-pink-500" />
                ) : null}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="top" className="snap-y snap-mandatory pt-16">
        <Suspense fallback={<Loading />}>
          <PrerequisitesSection />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <StepDemoSection />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <FlowchartSection />
        </Suspense>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="border-t border-gray-200 bg-white px-6 py-6 text-xs text-gray-500 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          Demo simulation for corporate presentation purposes. Data shown is mock and intended for process visualization only.
        </div>
      </motion.footer>
    </div>
  )
}
