import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export type AccordionProps = {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  bodyClassName,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className={[
          'flex w-full items-center justify-between gap-3 px-5 py-4 text-left',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          headerClassName ?? '',
        ].join(' ')}
      >
        <div className="min-w-0">{title}</div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-slate-500"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className={['px-5 pb-5', bodyClassName ?? ''].join(' ')}>
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
