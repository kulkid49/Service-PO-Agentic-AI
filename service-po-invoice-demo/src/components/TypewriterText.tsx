import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

type JoinMode = 'newline' | 'space'

export type TypewriterTextProps = {
  texts: string[]
  speed?: number
  playing?: boolean
  startDelayMs?: number
  pauseBetweenMs?: number
  join?: JoinMode
  className?: string
  onComplete?: () => void
}

export default function TypewriterText({
  texts,
  speed = 48,
  playing = true,
  startDelayMs = 0,
  pauseBetweenMs = 350,
  join = 'newline',
  className,
  onComplete,
}: TypewriterTextProps) {
  const normalizedTexts = useMemo(
    () => (Array.isArray(texts) ? texts.filter((t) => t != null) : []),
    [texts],
  )

  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [renderedLines, setRenderedLines] = useState<string[]>([])
  const completedRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)

  const reset = () => {
    completedRef.current = false
    setLineIndex(0)
    setCharIndex(0)
    setRenderedLines([])
  }

  useEffect(() => {
    reset()
  }, [normalizedTexts, playing, speed, startDelayMs, pauseBetweenMs, join])

  useEffect(() => {
    if (!playing) {
      setRenderedLines(normalizedTexts)
      setLineIndex(normalizedTexts.length)
      setCharIndex(0)
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
      return
    }

    if (!normalizedTexts.length) return

    const clearExisting = () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    clearExisting()

    const schedule = (fn: () => void, ms: number) => {
      timeoutRef.current = window.setTimeout(fn, ms)
    }

    const currentLine = normalizedTexts[lineIndex] ?? ''

    const tick = () => {
      if (lineIndex >= normalizedTexts.length) {
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
        return
      }

      const nextCharIndex = charIndex + 1
      const nextText = currentLine.slice(0, nextCharIndex)

      setRenderedLines((prev) => {
        const copy = prev.slice()
        copy[lineIndex] = nextText
        return copy
      })

      if (nextCharIndex >= currentLine.length) {
        schedule(() => {
          setLineIndex((v) => v + 1)
          setCharIndex(0)
        }, pauseBetweenMs)
      } else {
        setCharIndex(nextCharIndex)
      }
    }

    const initialDelay = renderedLines.length === 0 && lineIndex === 0 && charIndex === 0 ? startDelayMs : speed
    schedule(tick, Math.max(0, initialDelay))

    return clearExisting
  }, [
    playing,
    normalizedTexts,
    lineIndex,
    charIndex,
    speed,
    startDelayMs,
    pauseBetweenMs,
    onComplete,
    renderedLines.length,
  ])

  const isDone = lineIndex >= normalizedTexts.length && playing
  const showCursor = playing && !completedRef.current

  const parts: ReactNode[] = []
  for (let i = 0; i < renderedLines.length; i += 1) {
    const line = renderedLines[i] ?? ''
    if (!line && i >= normalizedTexts.length) continue
    if (join === 'newline') {
      parts.push(
        <div key={i} className="leading-relaxed">
          {line}
        </div>,
      )
    } else {
      parts.push(
        <span key={i} className="leading-relaxed">
          {i === 0 ? '' : ' '}
          {line}
        </span>,
      )
    }
  }

  return (
    <div className={className}>
      {parts}
      {!isDone && showCursor ? <span className="tw-cursor">|</span> : null}
    </div>
  )
}
