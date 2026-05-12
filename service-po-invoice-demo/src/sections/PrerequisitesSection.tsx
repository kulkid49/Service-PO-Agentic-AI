import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import data from '../data/presentationData.json'

type CardData = {
  title: string
  description: string
  keyFields: string[]
}

function PrereqCard({ card, index }: { card: CardData; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h3 className="text-lg font-bold text-blue-600">{card.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{card.description}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-100"
        aria-expanded={open}
      >
        Key Fields
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {card.keyFields.map((field) => (
              <li key={field} className="text-sm text-gray-600">
                <span className="mr-2 text-pink-500">•</span>
                {field}
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </motion.article>
  )
}

export default function PrerequisitesSection() {
  const [tab, setTab] = useState<'sap' | 'bc'>('sap')
  const cards = tab === 'sap' ? data.sapPrerequisites : data.bcPrerequisites

  return (
    <section
      id="prerequisites"
      className="min-h-screen scroll-mt-24 px-6 py-24 lg:px-12"
      aria-label="Master Data and Field-Level Prerequisites"
    >
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-800 lg:text-4xl"
        >
          Master Data & Field-Level Prerequisites
        </motion.h2>
        <p className="mt-3 max-w-3xl text-gray-600">
          Essential ERP master data needed before agentic Service PO invoice processing can run reliably.
        </p>

        <div className="mt-8 flex w-full max-w-lg gap-2 rounded-xl border border-gray-200 bg-white p-2">
          <button
            type="button"
            onClick={() => setTab('sap')}
            className={`relative flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              tab === 'sap' ? 'bg-blue-50 text-pink-500' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            SAP S/4HANA
            {tab === 'sap' ? <span className="absolute inset-x-6 -bottom-1 h-0.5 bg-pink-500" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setTab('bc')}
            className={`relative flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              tab === 'bc' ? 'bg-blue-50 text-pink-500' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Dynamics 365 BC
            {tab === 'bc' ? <span className="absolute inset-x-6 -bottom-1 h-0.5 bg-pink-500" /> : null}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.25 }}
            className="mt-8 grid gap-5 md:grid-cols-2"
          >
            {cards.map((card, idx) => (
              <PrereqCard key={`${tab}-${card.title}`} card={card} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl border border-pink-200 bg-pink-50 p-5"
        >
          <p className="text-sm font-semibold text-blue-600">Recommended Test Data</p>
          <p className="mt-2 text-sm text-gray-700">
            {tab === 'sap' ? data.recommendedTestData.sap : data.recommendedTestData.bc}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
