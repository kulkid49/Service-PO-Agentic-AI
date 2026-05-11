import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import sapPrerequisitesRaw from '../data/sapPrerequisites.json'
import bcPrerequisitesRaw from '../data/bcPrerequisites.json'
import TypewriterText from '../components/TypewriterText'
import Card from '../components/ui/Card'
import TabButton from '../components/ui/TabButton'
import Accordion from '../components/ui/Accordion'

type PrereqCategory = { title: string; items: string[] }

const sapPrerequisites = sapPrerequisitesRaw as PrereqCategory[]
const bcPrerequisites = bcPrerequisitesRaw as PrereqCategory[]

function splitForFieldTyping(line: string): { segments: string[]; join: 'space' | 'newline' } {
  const colonIdx = line.indexOf(':')
  if (colonIdx > 0 && colonIdx < line.length - 1) {
    const left = line.slice(0, colonIdx + 1).trim()
    const right = line.slice(colonIdx + 1).trim()
    return { segments: [left, right], join: 'space' }
  }
  return { segments: [line], join: 'newline' }
}

function CategoryCard({ category, index }: { category: PrereqCategory; index: number }) {
  const isRecommended = category.title.toLowerCase().includes('recommended test data')

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      className={[
        'overflow-hidden',
        isRecommended ? 'rounded-2xl border border-primary/25 bg-primary/5' : '',
      ].join(' ')}
    >
      <Card className={isRecommended ? 'border-0 bg-transparent shadow-none' : ''}>
        <Accordion
          defaultOpen={false}
          title={
            <TypewriterText
              texts={[category.title]}
              speed={52}
              className={[
                'text-sm font-semibold',
                isRecommended ? 'text-secondary' : 'text-slate-900',
              ].join(' ')}
            />
          }
          headerClassName={isRecommended ? 'bg-transparent' : ''}
          bodyClassName={isRecommended ? 'pt-1' : ''}
        >
          <div className="space-y-3">
            {category.items.map((item, i) => {
              const { segments, join } = splitForFieldTyping(item)
              return (
                <div key={`${index}-${i}`} className="text-sm text-slate-700">
                  <TypewriterText
                    texts={segments}
                    join={join}
                    speed={48}
                    startDelayMs={i * 220}
                    pauseBetweenMs={260}
                  />
                </div>
              )
            })}
          </div>
        </Accordion>
      </Card>
    </motion.div>
  )
}

export default function PrerequisitesPage() {
  const [active, setActive] = useState<'sap' | 'bc'>('sap')

  const categories = useMemo(
    () => (active === 'sap' ? sapPrerequisites : bcPrerequisites),
    [active],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <TypewriterText
          texts={['Master Data & Field-Level Prerequisites']}
          speed={50}
          className="text-2xl font-semibold tracking-tight text-slate-900"
        />
        <div className="mt-2 text-sm text-slate-600">
          <TypewriterText
            texts={[
              'Configure these ERP master data elements and posting controls to enable a clean, automated Service PO invoice posting flow.',
            ]}
            speed={44}
            startDelayMs={250}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <TabButton active={active === 'sap'} onClick={() => setActive('sap')}>
          SAP S/4HANA
        </TabButton>
        <TabButton active={active === 'bc'} onClick={() => setActive('bc')}>
          Microsoft Dynamics 365 BC
        </TabButton>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-4"
        >
          <motion.div
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
            }}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {categories.map((cat, idx) => (
              <CategoryCard key={cat.title} category={cat} index={idx} />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

