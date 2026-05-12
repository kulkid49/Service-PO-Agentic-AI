import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Bot, CheckCheck, Database, Mail, ScanSearch, ShieldCheck } from 'lucide-react'
import data from '../data/presentationData.json'

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  trigger: Mail,
  orchestrator: Bot,
  extractor: ScanSearch,
  translator: Bot,
  compliance: ShieldCheck,
  validation: CheckCheck,
  posting: Database,
  completion: CheckCheck,
}

export default function FlowchartSection() {
  const nodes = data.flowNodes

  return (
    <section id="flowchart" className="min-h-screen scroll-mt-24 bg-white px-6 py-24 lg:px-12" aria-label="Vertical process flowchart">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl">Vertical Linear Flowchart - Entire Process Background</h2>
        <p className="mt-3 max-w-3xl text-gray-600">Live process view of all agents, hand-offs, and exception routing from trigger to posted invoice completion.</p>

        <div className="relative mt-12">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-gray-300" />

          <motion.div
            className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-600"
            animate={{ y: [0, 130, 260, 390, 520, 650, 780, 910, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />

          <div className="space-y-8">
            {nodes.map((node, idx) => {
              const Icon = iconMap[node.id] ?? Bot
              const right = idx % 2 === 0

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.07 }}
                  className={`relative flex ${right ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`w-full max-w-md ${right ? 'pr-10 text-right' : 'pl-10 text-left'}`}>
                    <motion.article
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className={`mb-2 inline-flex rounded-lg p-2 ${right ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-500'}`}>
                        <Icon size={18} />
                      </div>
                      <h3 className="text-base font-bold text-blue-600">{node.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{node.description}</p>
                      <p className="mt-2 text-xs text-gray-500">{node.tools}</p>
                    </motion.article>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            className="absolute right-0 top-32 w-64 rounded-2xl border border-pink-200 bg-pink-50 p-4"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-pink-600">
              <AlertTriangle size={16} />
              <p className="text-sm font-semibold">Exception Agent</p>
            </div>
            <p className="mt-2 text-xs text-gray-600">Failure branches from extraction, compliance, and validation.</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {data.exceptionCodes.map((code) => (
                <span key={code} className="rounded-full bg-pink-100 px-2 py-1 text-[10px] text-pink-600">
                  {code}
                </span>
              ))}
            </div>
          </motion.div>

          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {[220, 350, 480].map((y, i) => (
              <motion.path
                key={y}
                d={`M 62% ${y} C 70% ${y} 75% ${y + 12} 82% ${y + 12}`}
                fill="transparent"
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ pathLength: 0.2, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.4, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
