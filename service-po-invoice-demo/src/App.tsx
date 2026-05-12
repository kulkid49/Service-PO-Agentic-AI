import { lazy, Suspense } from 'react'
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
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-12">
          <a href="#top" className="text-lg font-bold text-blue-600">
            Agentic AI Invoice Ops
          </a>
          <div className="hidden items-center gap-5 text-sm text-gray-600 md:flex">
            <a className="transition hover:text-blue-600" href="#prerequisites">Prerequisites</a>
            <a className="transition hover:text-blue-600" href="#step-demo">Step Demo</a>
            <a className="transition hover:text-blue-600" href="#flowchart">Flowchart</a>
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
