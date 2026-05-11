import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'

const PrerequisitesPage = lazy(() => import('./pages/PrerequisitesPage'))
const AgenticFlowPage = lazy(() => import('./pages/AgenticFlowPage'))

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
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/prerequisites" replace />} />
          <Route
            path="/prerequisites"
            element={
              <Suspense fallback={<Loading />}>
                <PrerequisitesPage />
              </Suspense>
            }
          />
          <Route
            path="/agentic-flow"
            element={
              <Suspense fallback={<Loading />}>
                <AgenticFlowPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/prerequisites" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
