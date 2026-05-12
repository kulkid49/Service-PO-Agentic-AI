import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Mail,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Inbox,
  Play,
} from 'lucide-react'
import data from '../data/presentationData.json'

type FullStep = (typeof data.stepDemoFull)[number]

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

function isHeaderLine(line: string) {
  return (
    line.endsWith(':') ||
    line === 'Matching Process:' ||
    line === 'Decision:' ||
    line === 'Quality Check:' ||
    line === 'Document Processing:' ||
    line === 'Key Data Extracted:' ||
    line === 'Service-Specific Extraction:' ||
    line === 'Final Enrichment:' ||
    line === 'System-Specific Posting:' ||
    line === 'Post-Posting Actions:' ||
    line === 'Success Confirmation:' ||
    line.startsWith('For ')
  )
}

function LeftVisual({
  step,
  stageIndex,
  stageCount,
  mode,
  globalInvoiceId,
}: {
  step: FullStep
  stageIndex: number
  stageCount: number
  mode: 'sap' | 'bc'
  globalInvoiceId: string
}) {
  if (step.leftVisual === 'trigger') {
    return (
      <div className="relative h-56 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-sm"
          initial={{ x: -90, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Mail className="text-blue-600" size={26} />
        </motion.div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-5">
          <Inbox className="text-pink-500" size={30} />
        </div>
        <motion.div
          className="absolute left-24 top-1/2 h-1 w-28 -translate-y-1/2 rounded-full bg-blue-200"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.3, repeat: Infinity }}
        />
        <motion.div
          className="absolute left-10 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-pink-500"
          animate={{ x: [0, 230] }}
          transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
        />
      </div>
    )
  }

  if (step.leftVisual === 'email') {
    const showId = stageIndex >= 1
    const archived = stageIndex >= 2
    return (
      <div className="relative h-56 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <div className="absolute left-8 top-8 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="relative">
            <Inbox className="text-blue-600" size={30} />
            <motion.span
              className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-pink-500 text-[10px] font-semibold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              1
            </motion.span>
          </div>
        </div>
        <motion.div
          className="absolute left-12 top-[104px] rounded-xl bg-white p-3 shadow-sm"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <Mail className="text-pink-500" size={22} />
        </motion.div>
        <div className="absolute right-10 bottom-10 rounded-2xl border border-gray-200 bg-white p-4">
          <Archive className="text-gray-500" size={26} />
        </div>
        <motion.div
          className="absolute left-16 top-[112px]"
          animate={archived ? { x: 310, y: 78, opacity: [1, 1, 0.7] } : { x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <Mail className="text-blue-600" size={18} />
        </motion.div>
        <motion.div
          className="absolute left-8 bottom-8 inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showId ? 1 : 0, y: showId ? 0 : 8 }}
        >
          <Sparkles size={14} />
          {globalInvoiceId}
        </motion.div>
      </div>
    )
  }

  if (step.leftVisual === 'extraction') {
    const done = stageIndex === stageCount - 1
    return (
      <div className="relative h-56 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <div className="absolute left-8 top-8 h-36 w-32 rounded-xl border border-gray-200 bg-white" />
        <motion.div
          className="absolute left-8 top-8 h-36 w-10 bg-pink-200/40"
          animate={{ x: [0, 88, 0] }}
          transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
        />
        <div className="absolute right-8 top-8 h-36 w-48 rounded-xl bg-gray-900 p-3 font-mono text-[10px] text-green-300">
          <div>{'{'}</div>
          <div>  "VendorName": "TechServ",</div>
          <div>  "InvoiceNo": "INV-20260511",</div>
          <div>  "PONumber": "4500012345"</div>
          <div>{'}'}</div>
        </div>
        <div className="absolute bottom-6 left-8 grid grid-cols-4 gap-2">
          {[
            { label: 'Vendor', value: 96 },
            { label: 'Invoice', value: 94 },
            { label: 'PO', value: 91 },
            { label: 'Lines', value: 88 },
          ].map((item) => (
            <div key={item.label} className="w-[78px]">
              <ConfidenceArc label={item.label} value={item.value} />
            </div>
          ))}
        </div>
        <motion.div
          className="absolute right-10 bottom-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
        >
          <CheckCircle2 size={14} />
          Extraction Successful
        </motion.div>
      </div>
    )
  }

  if (step.leftVisual === 'compliance') {
    const layers = [
      'Vendor Active',
      'Tax ID Match',
      'PO Valid',
      'No Duplicate',
    ]
    const count = stageIndex === 0 ? 0 : stageIndex === 1 ? 2 : 4
    return (
      <div className="relative h-56 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
          <ShieldCheck className="text-blue-600" size={28} />
          <span className="text-sm font-semibold text-gray-800">Checks</span>
        </div>
        <div className="absolute left-8 bottom-8 right-8 grid grid-cols-2 gap-3">
          {layers.map((l, idx) => (
            <motion.div
              key={l}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {l}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: idx < count ? 1 : 0 }}
                className="inline-flex rounded-full bg-emerald-50 p-1 text-emerald-600"
              >
                <Check size={14} />
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (step.leftVisual === 'validation') {
    const safe = stageIndex === stageCount - 1
    return (
      <div className="relative h-56 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <div className="absolute left-8 top-8 right-8 grid grid-cols-3 gap-3 text-[11px] text-gray-600">
          {['Invoice', mode === 'sap' ? 'SES / Receipt' : 'Receipt', 'PO'].map((h) => (
            <div key={h} className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="font-semibold text-gray-800">{h}</p>
              <p className="mt-1 text-gray-400">Qty / Amount</p>
            </div>
          ))}
        </div>
        <motion.div
          className="absolute left-10 top-[120px] h-1 w-[82%] rounded-full bg-blue-200"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />
        <div className="absolute left-8 bottom-10 right-8">
          <div className="h-3 rounded-full bg-gray-200" />
          <motion.div
            className="mt-[-12px] h-3 rounded-full bg-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: safe ? '72%' : '40%' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          <p className="mt-2 text-xs font-semibold text-emerald-600">Tolerance within auto-approve zone</p>
        </div>
        <motion.div
          className="absolute right-10 bottom-8 inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: safe ? 1 : 0, y: safe ? 0 : 8 }}
        >
          Auto-Approved
        </motion.div>
      </div>
    )
  }

  const complete = stageIndex === stageCount - 1
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
      <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <Database className="text-blue-600" size={28} />
        <span className="text-sm font-semibold text-gray-800">{mode === 'sap' ? 'SAP Posting' : 'BC Posting'}</span>
      </div>
      <motion.div
        className="absolute right-10 top-10 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-blue-600"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        5100000123
      </motion.div>
      <motion.div
        className="absolute left-8 bottom-10 inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: complete ? 1 : 0, y: complete ? 0 : 8 }}
      >
        <Check size={14} />
        Completed
      </motion.div>
      <motion.div
        className="absolute right-10 bottom-10 h-8 w-8 rounded-full bg-pink-200"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-20 bottom-14 h-4 w-4 rounded-full bg-blue-200"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.1 }}
      />
    </div>
  )
}

export default function StepDemoSection() {
  const steps = data.stepDemoFull as FullStep[]
  const [active, setActive] = useState(0)
  const [stageIndex, setStageIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [mode, setMode] = useState<'sap' | 'bc'>('sap')

  const current = steps[active]
  const stageBreaks = (current as any).stageBreaks as number[] | undefined
  const stageStops = stageBreaks && stageBreaks.length ? stageBreaks : [current.bullets.length]
  const stageCount = stageStops.length
  const visibleCount = stageStops[Math.min(stageIndex, stageCount - 1)] ?? current.bullets.length

  useEffect(() => {
    if (!autoPlay) return undefined
    const id = window.setInterval(() => {
      if (active === 0) {
        setActive(1)
        setStageIndex(0)
        return
      }

      if (stageIndex < stageCount - 1) {
        setStageIndex((v) => Math.min(v + 1, stageCount - 1))
        return
      }

      if (active < steps.length - 1) {
        setActive((v) => v + 1)
        setStageIndex(0)
        return
      }

      setAutoPlay(false)
    }, 3500)
    return () => window.clearInterval(id)
  }, [autoPlay, active, stageIndex, stageCount, steps.length])

  const mock = data.mockInvoiceData

  useEffect(() => {
    setStageIndex(0)
  }, [active])

  const visibleBullets = useMemo(() => current.bullets.slice(0, Math.min(visibleCount, current.bullets.length)), [current, visibleCount])

  const onNext = () => {
    if (active === 0) {
      setActive(1)
      return
    }
    if (stageIndex < stageCount - 1) {
      setStageIndex((v) => Math.min(v + 1, stageCount - 1))
      return
    }
    if (active < steps.length - 1) {
      setActive((v) => v + 1)
      return
    }
  }

  const onPrev = () => {
    if (active === 0) return
    if (stageIndex > 0) {
      setStageIndex((v) => Math.max(0, v - 1))
      return
    }
    if (active > 0) {
      const prevStep = steps[active - 1]
      const prevBreaks = (prevStep as any).stageBreaks as number[] | undefined
      const prevStops = prevBreaks && prevBreaks.length ? prevBreaks : [prevStep.bullets.length]
      setActive((v) => v - 1)
      setStageIndex(prevStops.length - 1)
      return
    }
  }

  return (
    <section
      id="step-demo"
      className="min-h-screen scroll-mt-24 border-y border-gray-100 bg-blue-50/50 px-6 py-24 lg:px-12"
      aria-label="Step-by-step visual demo"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl">Step-by-Step Visual Demo - Full Agentic AI Operation</h2>
        <p className="mt-3 text-gray-600">Success path only. All validations pass and posting completes automatically.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <motion.aside
            key={current.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-blue-100 bg-white p-6 lg:col-span-2"
          >
            <LeftVisual step={current} stageIndex={stageIndex} stageCount={stageCount} mode={mode} globalInvoiceId={mock.globalInvoiceId} />
            <h3 className="mt-5 text-xl font-bold text-blue-600">{current.title}</h3>
            <p className="mt-2 text-sm text-gray-600">Ideal success path demonstration</p>

            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <p className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                <Mail size={14} className="text-blue-600" />
                From: {mock.vendorEmail}
              </p>
              <p className="inline-flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-2">
                <Sparkles size={14} className="text-pink-500" />
                Global Service Invoice ID: {mock.globalInvoiceId}
              </p>
            </div>
          </motion.aside>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-pink-500">Step {active + 1} of {steps.length}</p>
                <h3 className="mt-1 text-2xl font-bold text-blue-600">{current.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                {active >= 4 ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" checked={mode === 'sap'} onChange={() => setMode('sap')} /> SAP
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" checked={mode === 'bc'} onChange={() => setMode('bc')} /> BC
                    </label>
                  </div>
                ) : null}
              </div>
            </div>

            <ul className="mt-6 space-y-2">
              <AnimatePresence initial={false}>
                {visibleBullets.map((line, idx) => (
                  <motion.li
                    key={`${active}-${idx}-${line}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className={`text-sm leading-relaxed ${isHeaderLine(line) ? 'font-semibold text-gray-800' : 'text-gray-600'}`}
                  >
                    {isHeaderLine(line) ? line : `• ${line}`}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {active === 0 ? (
              <button
                type="button"
                onClick={() => setActive(1)}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                <Play size={16} />
                Start Process
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
            aria-label="Previous step"
            disabled={active === 0}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
            aria-label="Next step"
            disabled={active === steps.length - 1 && stageIndex >= stageCount - 1}
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

        <div className="mt-8 grid gap-2 md:grid-cols-6">
          {steps.map((step, idx) => {
            const completed = idx < active
            const activeStep = idx === active
            return (
              <button
                type="button"
                key={step.id}
                onClick={() => {
                  setActive(idx)
                  const breaks = (step as any).stageBreaks as number[] | undefined
                  const stops = breaks && breaks.length ? breaks : [step.bullets.length]
                  setStageIndex(idx === 0 ? 0 : stops.length - 1)
                }}
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
                  {step.stepperLabel}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
