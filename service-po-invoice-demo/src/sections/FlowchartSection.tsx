import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Bot, CheckCheck, Database, Mail, ScanSearch, ShieldCheck } from 'lucide-react'
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
        <p className="mt-3 max-w-3xl text-gray-600">Live process view of all agents and hand-offs from trigger to posted invoice completion.</p>

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

        </div>
      </div>
    </section>
  )
}
