import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  Flag,
  Languages,
  Mail,
  Pause,
  Play,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Scale,
} from 'lucide-react'
import data from '../data/presentationData.json'

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  trigger: Mail,
  orchestrator: Settings2,
  extractor: ScanSearch,
  translator: Languages,
  compliance: ShieldCheck,
  validation: Scale,
  posting: Database,
  completion: Flag,
}

export default function FlowchartSection() {
  const nodes = data.flowNodes
  const explanations = data.flowExplanations
  const [started, setStarted] = useState(false)
  const [running, setRunning] = useState(false)
  const [current, setCurrent] = useState(0)

  const nodePositions = useMemo(
    () =>
      nodes.map((_, idx) => ({
        x: idx % 2 === 0 ? 180 : 420,
        y: 80 + idx * 88,
      })),
    [nodes],
  )

  useEffect(() => {
    if (!started || !running) return undefined
    if (current >= nodes.length - 1) {
      setRunning(false)
      return undefined
    }
    const id = window.setTimeout(() => setCurrent((v) => Math.min(v + 1, nodes.length - 1)), 1700)
    return () => window.clearTimeout(id)
  }, [started, running, current, nodes.length])

  const activeNode = nodes[current]
  const activeText = explanations[activeNode.id as keyof typeof explanations]

  const pathFor = (idx: number) => {
    const p1 = nodePositions[idx]
    const p2 = nodePositions[idx + 1]
    const c1x = p1.x + (idx % 2 === 0 ? 65 : -65)
    const c2x = p2.x + (idx % 2 === 0 ? -65 : 65)
    return `M ${p1.x} ${p1.y} C ${c1x} ${(p1.y + p2.y) / 2} ${c2x} ${(p1.y + p2.y) / 2} ${p2.x} ${p2.y}`
  }

  return (
    <section id="flowchart" className="min-h-screen scroll-mt-24 bg-white px-6 py-24 lg:px-12" aria-label="Interactive vertical process flowchart">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl">Vertical Linear Flowchart - Entire Process Background</h2>
        <p className="mt-3 max-w-3xl text-gray-600">Interactive flow view showing how each agent executes in sequence from trigger to completion.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <button
              type="button"
              onClick={() => {
                setStarted(true)
                setRunning(true)
                setCurrent(0)
              }}
              disabled={started}
              className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {running ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Play size={15} />}
              Start Process
            </button>

            <div className="relative rounded-2xl border border-gray-200 bg-white p-4">
              <div className="relative h-[760px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-blue-50 to-white">
                <svg viewBox="0 0 600 760" className="absolute inset-0 h-full w-full">
                  <line x1="300" y1="40" x2="300" y2="720" stroke="#d1d5db" strokeDasharray="6 6" strokeWidth="2" />
                  {nodes.slice(0, -1).map((node, idx) => (
                    <motion.path
                      key={`${node.id}-path`}
                      className={current > idx ? 'flow-dash' : ''}
                      d={pathFor(idx)}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.2"
                      strokeDasharray="8 6"
                      initial={{ pathLength: 0, opacity: 0.25 }}
                      animate={{
                        pathLength: current > idx ? 1 : 0,
                        opacity: current > idx ? 1 : 0.3,
                        strokeDashoffset: current > idx ? [14, 0] : 14,
                      }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                    />
                  ))}
                </svg>

                {nodes.map((node, idx) => {
                  const Icon = iconMap[node.id] ?? Bot
                  const p = nodePositions[idx]
                  const isActive = idx === current
                  const isDone = idx < current
                  return (
                    <motion.div
                      key={node.id}
                      className="absolute"
                      style={{ left: p.x, top: p.y, transform: 'translate(-50%, -50%)' }}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div
                        className={`min-w-[188px] rounded-xl border bg-white px-3 py-2 shadow-sm ${
                          isActive ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 inline-flex rounded-md p-1 ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-pink-50 text-pink-500'}`}>
                            <Icon size={14} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold leading-tight text-gray-800">{node.title}</p>
                            <p className="mt-0.5 text-[10px] text-gray-400">{node.tools}</p>
                          </div>
                          {isDone ? <Check size={12} className="text-pink-500" /> : null}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                <motion.div
                  className="absolute h-4 w-4 rounded-full bg-blue-600 shadow-lg"
                  style={{
                    left: nodePositions[current]?.x ?? 300,
                    top: nodePositions[current]?.y ?? 80,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    left: nodePositions[current]?.x ?? 300,
                    top: nodePositions[current]?.y ?? 80,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRunning(false)
                  setCurrent((v) => Math.max(0, v - 1))
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                <ChevronLeft size={14} />
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunning(false)
                  setCurrent((v) => Math.min(nodes.length - 1, v + 1))
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                Next Step
                <ChevronRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => setRunning((v) => !v)}
                disabled={!started}
                className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {running ? <Pause size={14} /> : <Play size={14} />}
                {running ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.article
                key={activeNode.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-6"
              >
                <p className="text-sm font-semibold text-pink-500">Step {current + 1}</p>
                <h3 className="mt-1 text-2xl font-bold text-blue-600">{activeNode.title}</h3>
                <div className="mt-4 space-y-2">
                  {activeText.map((line, idx) => (
                    <motion.p
                      key={line}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm leading-relaxed text-gray-600"
                    >
                      • {line}
                    </motion.p>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
