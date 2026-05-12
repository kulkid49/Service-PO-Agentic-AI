import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  FileJson,
  Mail,
  ScanSearch,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import data from '../data/presentationData.json'

type Step = (typeof data.stepDemo)[number]

function ConfidenceArc({ label, value }: { label: string; value: number }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const stroke = circumference - (value / 100) * circumference

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
      <svg width="54" height="54" viewBox="0 0 54 54" className="mx-auto">
        <circle cx="27" cy="27" r={radius} fill="none" stroke="#dbeafe" strokeWidth="6" />
        <motion.circle
          cx="27"
          cy="27"
          r={radius}
          fill="none"
          stroke="#2563EB"
          strokeWidth="6"
          strokeLinecap="round"
          transform="rotate(-90 27 27)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: stroke }}
          transition={{ duration: 0.8 }}
          strokeDasharray={circumference}
        />
        <text x="27" y="31" textAnchor="middle" className="fill-blue-600 text-[9px] font-semibold">
          {value}%
        </text>
      </svg>
      <p className="mt-2 text-[11px] text-gray-500">{label}</p>
    </div>
  )
}

export default function StepDemoSection() {
  const steps = data.stepDemo as Step[]
  const [active, setActive] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [mode, setMode] = useState<'sap' | 'bc'>('sap')

  useEffect(() => {
    if (!autoPlay) return undefined
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length)
    }, 3500)
    return () => window.clearInterval(id)
  }, [autoPlay, steps.length])

  const current = steps[active]
  const mock = data.mockInvoiceData

  const icons = [Mail, ScanSearch, ShieldCheck, SearchCheck, Database]
  const StepIcon = icons[active] ?? Mail

  const confidence = useMemo(
    () => [
      { label: 'Vendor', value: 96 },
      { label: 'Invoice', value: 94 },
      { label: 'PO Number', value: 91 },
      { label: 'Service Lines', value: 88 },
    ],
    [],
  )

  return (
    <section
      id="step-demo"
      className="min-h-screen scroll-mt-24 border-y border-gray-100 bg-blue-50/50 px-6 py-24 lg:px-12"
      aria-label="Step-by-step visual demo"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl">Step-by-Step Visual Demo - Agentic AI Operation</h2>
        <p className="mt-3 text-gray-600">Ideal success-path walkthrough from email receipt to posted invoice completion.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <motion.aside
            key={current.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-blue-100 bg-white p-6 lg:col-span-2"
          >
            <div className="inline-flex rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 p-5 text-pink-500">
              <StepIcon size={40} />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-blue-600">{current.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{current.agent}</p>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <p className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                <Mail size={14} className="text-blue-600" />
                From: vendor@company.com
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-2">
                <Sparkles size={14} className="text-pink-500" />
                Global Service Invoice ID: {mock.globalInvoiceId}
              </p>
            </div>
          </motion.aside>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {active === 0 ? (
                  <div className="space-y-4 text-sm text-gray-600">
                    <motion.div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2" animate={{ x: [50, 0] }}>
                      <Mail size={16} className="text-blue-600" />
                      Subject: Service Invoice #{mock.invoiceNumber}
                    </motion.div>
                    <p>Date: {mock.invoiceDate}</p>
                    <p>Attachment(s): invoice.pdf</p>
                    <motion.div animate={{ x: [0, 22, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="inline-flex items-center gap-2">
                      <Archive size={16} className="text-pink-500" />
                      Email archived and routed
                    </motion.div>
                  </div>
                ) : null}

                {active === 1 ? (
                  <div className="space-y-4">
                    <motion.div
                      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-sm"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-pink-200/40"
                        animate={{ x: ['0%', '1200%'] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      OCR + AI Document Intelligence scanning service invoice
                    </motion.div>
                    <div className="rounded-xl bg-gray-900 p-4 font-mono text-xs text-green-300">
                      <div>{'{'}</div>
                      <div>  "VendorName": "{mock.vendor}",</div>
                      <div>  "InvoiceNo": "{mock.invoiceNumber}",</div>
                      <div>  "PONumber": "{mock.poNumber}",</div>
                      <div>  "SESNumber": "{mock.sesNumber}"</div>
                      <div>{'}'}</div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {confidence.map((item) => (
                        <ConfidenceArc key={item.label} label={item.label} value={item.value} />
                      ))}
                    </div>
                    <p className="inline-flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-pink-600">
                      <CheckCircle2 size={15} /> Extraction successful
                    </p>
                  </div>
                ) : null}

                {active === 2 ? (
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="rounded-lg bg-blue-50 px-3 py-2">Tax Code normalized: VAT 12% → UZ_VAT12</p>
                    <p className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"><CheckCircle2 size={16} className="text-blue-600" /> Vendor Validation</p>
                    <p className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"><ShieldCheck size={16} className="text-blue-600" /> Tax ID Match</p>
                    <p className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"><FileJson size={16} className="text-blue-600" /> PO Valid</p>
                    <p className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"><CheckCircle2 size={16} className="text-blue-600" /> No Duplicate Found</p>
                  </div>
                ) : null}

                {active === 3 ? (
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-2">
                      <label className="inline-flex items-center gap-2 text-gray-600">
                        <input type="radio" checked={mode === 'sap'} onChange={() => setMode('sap')} /> SAP Mode
                      </label>
                      <label className="inline-flex items-center gap-2 text-gray-600">
                        <input type="radio" checked={mode === 'bc'} onChange={() => setMode('bc')} /> BC Mode
                      </label>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {['Invoice Data', mode === 'sap' ? 'SES (Accepted)' : 'Posted Receipt', 'Purchase Order'].map((h) => (
                        <div key={h} className="rounded-lg border border-gray-200 bg-white p-3 text-gray-600">{h}</div>
                      ))}
                    </div>
                    <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-blue-600">Tolerance within safe zone</p>
                    <p className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-pink-600">Auto-approval stamp applied</p>
                  </div>
                ) : null}

                {active === 4 ? (
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>Final enrichment: Cost Center/WBS resolved.</p>
                    <p>{mode === 'sap' ? 'MIRO Background Posting dialog executed.' : 'Create Purchase Invoice dialog executed.'}</p>
                    <motion.p initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex rounded-full bg-pink-100 px-3 py-1 font-semibold text-pink-600">
                      Posted Invoice 5100000123
                    </motion.p>
                    <p className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-600">
                      <Check size={15} /> Global Service Invoice ID Completed
                    </p>
                    <motion.p animate={{ x: [0, 12, 0] }} className="inline-flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-pink-600">
                      <Mail size={14} /> Confirmation email dispatched
                    </motion.p>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActive((v) => Math.max(0, v - 1))}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
            aria-label="Previous step"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            type="button"
            onClick={() => setActive((v) => Math.min(steps.length - 1, v + 1))}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
            aria-label="Next step"
          >
            Next
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => setAutoPlay((v) => !v)}
            className={`rounded-lg px-4 py-2 text-sm ${autoPlay ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600'}`}
          >
            {autoPlay ? 'Stop Auto-Play' : 'Auto-Play (3.5s)'}
          </button>
        </div>

        <div className="mt-8 grid gap-2 md:grid-cols-5">
          {steps.map((step, idx) => {
            const completed = idx < active
            const activeStep = idx === active
            return (
              <button
                type="button"
                key={step.id}
                onClick={() => setActive(idx)}
                className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                  activeStep
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-pink-200'
                    : completed
                      ? 'border-pink-200 bg-pink-50 text-pink-600'
                      : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${activeStep ? 'border-blue-600' : ''}`}>
                    {completed ? <Check size={12} /> : step.id}
                  </span>
                  {step.shortLabel}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
