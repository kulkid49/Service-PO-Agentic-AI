import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCheck,
  FileUp,
  Mail,
  Pause,
  Play,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  StepBack,
  StepForward,
} from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import agenticStepsRaw from '../data/agenticSteps.json'
import TypewriterText from '../components/TypewriterText'
import Card from '../components/ui/Card'

type Step = { id: number; title: string; icon: string; descriptionItems: string[] }

const allSteps = agenticStepsRaw as Step[]
const mainSteps = allSteps.filter((s) => s.id >= 1 && s.id <= 5)
const exceptionStep = allSteps.find((s) => s.id === 99)

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Mail,
  ScanSearch,
  ShieldCheck,
  CheckCheck,
  FileUp,
  AlertTriangle,
}

type Point = { x: number; y: number }

function FlowChart({
  steps,
  activeId,
  onSelect,
  exceptionRelevant,
}: {
  steps: Step[]
  activeId: number
  onSelect: (id: number) => void
  exceptionRelevant: boolean
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const exceptionRef = useRef<HTMLButtonElement | null>(null)
  const nodeRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const [centers, setCenters] = useState<Record<number, Point>>({})
  const [exceptionCenter, setExceptionCenter] = useState<Point | null>(null)
  const [packetY, setPacketY] = useState<number | null>(null)

  const activeIndex = useMemo(
    () => steps.findIndex((s) => s.id === activeId),
    [steps, activeId],
  )

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const bounds = el.getBoundingClientRect()
    const next: Record<number, Point> = {}
    for (const s of steps) {
      const node = nodeRefs.current[s.id]
      if (!node) continue
      const r = node.getBoundingClientRect()
      next[s.id] = { x: r.left - bounds.left + r.width / 2, y: r.top - bounds.top + r.height / 2 }
    }

    setCenters(next)

    if (exceptionRef.current) {
      const er = exceptionRef.current.getBoundingClientRect()
      setExceptionCenter({
        x: er.left - bounds.left + er.width / 2,
        y: er.top - bounds.top + er.height / 2,
      })
    }
  }, [steps.length, activeId])

  useEffect(() => {
    const center = centers[activeId]
    if (center) setPacketY(center.y)
  }, [activeId, centers])

  const packetLeft = 18

  return (
    <div ref={containerRef} className="relative">
      {packetY != null ? (
        <motion.div
          className="pointer-events-none absolute z-10 h-2.5 w-2.5 rounded-sm bg-primary shadow"
          style={{ left: packetLeft, top: packetY }}
          animate={{ top: packetY }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      ) : null}

      {exceptionCenter && (centers[2] || centers[3] || centers[4]) ? (
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {[2, 3, 4].map((id) => {
            const p = centers[id]
            if (!p) return null
            return (
              <motion.line
                key={id}
                x1={p.x + 34}
                y1={p.y}
                x2={exceptionCenter.x - 34}
                y2={exceptionCenter.y}
                stroke={exceptionRelevant ? '#b91c1c' : '#ef4444'}
                strokeWidth={2}
                strokeDasharray="6 6"
                initial={false}
                animate={{ opacity: exceptionRelevant ? 1 : 0.22 }}
                transition={{ duration: 0.25 }}
              />
            )
          })}
        </svg>
      ) : null}

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = iconMap[step.icon] ?? Mail
          const isActive = step.id === activeId
          const isPrevActive = idx === activeIndex - 1
          const connectorActive = isPrevActive

          return (
            <div key={step.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <motion.button
                    ref={(el) => {
                      nodeRefs.current[step.id] = el
                    }}
                    type="button"
                    onClick={() => onSelect(step.id)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className={[
                      'grid h-11 w-11 place-items-center rounded-full border transition',
                      'bg-white shadow-soft',
                      isActive
                        ? 'border-primary ring-2 ring-primary/25'
                        : 'border-slate-200 hover:border-slate-300',
                    ].join(' ')}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-slate-500'} />
                  </motion.button>

                  {idx < steps.length - 1 ? (
                    <div className="relative mt-2 h-10 w-[3px] overflow-hidden rounded-full bg-slate-200">
                      <AnimatePresence>
                        {connectorActive ? (
                          <motion.div
                            key="pulse"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: -14 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="absolute inset-x-0 h-10 bg-primary/70 blur-[0.3px]"
                            style={{ willChange: 'transform' }}
                          />
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0 pt-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Step {step.id}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {exceptionStep ? (
        <div className="pointer-events-none absolute right-0 top-[132px] w-[220px]">
          <motion.button
            ref={exceptionRef}
            type="button"
            tabIndex={-1}
            animate={
              exceptionRelevant
                ? { x: [0, -2, 2, -2, 2, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={[
              'pointer-events-auto flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left',
              exceptionRelevant
                ? 'border-[#b91c1c]/40 bg-[#b91c1c]/10'
                : 'border-[#ef4444]/25 bg-white',
            ].join(' ')}
          >
            <div
              className={[
                'grid h-9 w-9 place-items-center rounded-xl',
                exceptionRelevant ? 'bg-[#b91c1c]/20 text-[#b91c1c]' : 'bg-[#ef4444]/10 text-[#ef4444]',
              ].join(' ')}
            >
              <AlertTriangle size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">
                {exceptionStep.title}
              </div>
              <div className="text-xs text-slate-600">
                Branch path
              </div>
            </div>
          </motion.button>
        </div>
      ) : null}
    </div>
  )
}

function DetailPanel({
  step,
  autoPlay,
  onDone,
}: {
  step: Step
  autoPlay: boolean
  onDone: () => void
}) {
  const Icon = iconMap[step.icon] ?? Mail
  const [titleDone, setTitleDone] = useState(false)
  const [bodyKey, setBodyKey] = useState(0)

  useEffect(() => {
    setTitleDone(false)
    setBodyKey((v) => v + 1)
  }, [step.id])

  const bullets = useMemo(() => step.descriptionItems.map((t) => `• ${t}`), [step.descriptionItems])

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <TypewriterText
            texts={[step.title]}
            speed={50}
            className="text-lg font-semibold text-slate-900"
            onComplete={() => setTitleDone(true)}
          />
          <div className="mt-4 text-sm text-slate-700">
            <TypewriterText
              key={bodyKey}
              texts={bullets}
              speed={46}
              pauseBetweenMs={420}
              playing={titleDone}
              onComplete={onDone}
            />
          </div>
          {autoPlay ? (
            <div className="mt-4 text-xs text-slate-500">
              <TypewriterText
                texts={['Auto-Play enabled: advancing after narration completes.']}
                speed={40}
                playing={titleDone}
                startDelayMs={200}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

function ControlBar({
  autoPlay,
  canPrev,
  canNext,
  onToggleAutoPlay,
  onPrev,
  onNext,
  onReset,
}: {
  autoPlay: boolean
  canPrev: boolean
  canNext: boolean
  onToggleAutoPlay: () => void
  onPrev: () => void
  onNext: () => void
  onReset: () => void
}) {
  const btnBase =
    'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onToggleAutoPlay}
        className={[
          btnBase,
          autoPlay ? 'border-primary/30 bg-primary text-white' : 'border-slate-200 bg-white text-slate-800',
        ].join(' ')}
      >
        {autoPlay ? <Pause size={16} /> : <Play size={16} />}
        Auto-Play
      </button>

      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={[
          btnBase,
          'border-slate-200 bg-white text-slate-800 disabled:cursor-not-allowed disabled:opacity-50',
        ].join(' ')}
      >
        <StepBack size={16} />
        Previous Step
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={[
          btnBase,
          'border-slate-200 bg-white text-slate-800 disabled:cursor-not-allowed disabled:opacity-50',
        ].join(' ')}
      >
        Next Step
        <StepForward size={16} />
      </button>

      <button
        type="button"
        onClick={onReset}
        className={[btnBase, 'border-slate-200 bg-white text-slate-800'].join(' ')}
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  )
}

export default function AgenticFlowPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const autoTimerRef = useRef<number | null>(null)

  const step = mainSteps[Math.max(0, Math.min(mainSteps.length - 1, activeIndex))]

  const exceptionRelevant = useMemo(
    () => step.descriptionItems.some((t) => t.toLowerCase().includes('exception agent')),
    [step.descriptionItems],
  )

  const clearAutoTimer = () => {
    if (autoTimerRef.current != null) {
      window.clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }

  useEffect(() => clearAutoTimer, [])

  useEffect(() => {
    clearAutoTimer()
  }, [activeIndex, autoPlay])

  const goTo = (idx: number) => {
    setActiveIndex(Math.max(0, Math.min(mainSteps.length - 1, idx)))
  }

  const onDone = () => {
    if (!autoPlay) return
    if (activeIndex >= mainSteps.length - 1) return
    clearAutoTimer()
    autoTimerRef.current = window.setTimeout(() => {
      goTo(activeIndex + 1)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <TypewriterText
          texts={['End-to-End Agentic Process – Service PO Invoice Posting']}
          speed={50}
          className="text-2xl font-semibold tracking-tight text-slate-900"
        />
        <div className="mt-2 text-sm text-slate-600">
          <TypewriterText
            texts={[
              'A visual pipeline of orchestrated agents, validations, and posting actions across SAP S/4HANA and Microsoft Dynamics 365 Business Central.',
            ]}
            speed={44}
            startDelayMs={250}
          />
        </div>
      </div>

      <ControlBar
        autoPlay={autoPlay}
        canPrev={activeIndex > 0}
        canNext={activeIndex < mainSteps.length - 1}
        onToggleAutoPlay={() => setAutoPlay((v) => !v)}
        onPrev={() => {
          setAutoPlay(false)
          goTo(activeIndex - 1)
        }}
        onNext={() => {
          setAutoPlay(false)
          goTo(activeIndex + 1)
        }}
        onReset={() => {
          setAutoPlay(false)
          goTo(0)
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-6">
          <div className="mb-4 text-sm font-semibold text-slate-900">
            <TypewriterText texts={['Visual Flow']} speed={48} />
          </div>
          <FlowChart
            steps={mainSteps}
            activeId={step.id}
            onSelect={(id) => {
              setAutoPlay(false)
              const idx = mainSteps.findIndex((s) => s.id === id)
              if (idx >= 0) goTo(idx)
            }}
            exceptionRelevant={exceptionRelevant}
          />
        </Card>

        <DetailPanel step={step} autoPlay={autoPlay} onDone={onDone} />
      </div>
    </motion.div>
  )
}
