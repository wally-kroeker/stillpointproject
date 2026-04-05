import { useEffect, useRef, useState, useCallback } from 'react'
import {
  prepareWithSegments,
  layoutNextLine,
  type PreparedTextWithSegments,
  type LayoutCursor,
} from '@chenglou/pretext'

// --- Constants ---
const SOFT_HYPHEN = '\u00AD'
const RIVER_THRESHOLD = 1.5
const SHORT_LINE_RATIO = 0.6
const FONT = '18px "Crimson Text"'

// CSS variable references for design token consistency
const colors = {
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  heading: 'var(--color-heading)',
  accent1: 'var(--color-accent-1)',
  accent2: 'var(--color-accent-2)',
  bgGlass: 'var(--color-bg-glass)',
  border: 'var(--color-border)',
  good: 'var(--color-accent-2)',
  bad: '#c44',
} as const

const fonts = {
  serif: 'var(--font-serif)',
  mono: 'var(--font-mono)',
  sans: 'var(--font-sans)',
} as const

// Shared styles
const sectionLabelStyle = (color: string): React.CSSProperties => ({
  fontFamily: fonts.mono, fontSize: '0.7rem',
  color, textTransform: 'uppercase', letterSpacing: '0.08em',
  marginBottom: 8, fontWeight: 600,
})

const toggleButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 16px',
  background: active ? 'rgba(196, 163, 90, 0.2)' : 'transparent',
  border: `1px solid ${active ? colors.accent1 : colors.border}`,
  borderRadius: 4,
  color: active ? colors.accent1 : colors.textMuted,
  fontFamily: fonts.mono,
  fontSize: '0.75rem',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

// --- Hyphenation (simplified from Pretext demo) ---
const PREFIXES = ['anti', 'auto', 'counter', 'hyper', 'inter', 'micro', 'multi', 'over', 'post', 'pre', 'proto', 'pseudo', 'semi', 'super', 'trans', 'ultra', 'under']
const SUFFIXES = ['able', 'ible', 'tion', 'sion', 'ment', 'ness', 'ence', 'ance', 'ious', 'eous', 'ling', 'ful', 'less', 'ing', 'ment', 'ture', 'ous']

function hyphenateWord(word: string): string[] {
  const lower = word.toLowerCase().replace(/[.,;:!?"'—–\-]/g, '')
  if (lower.length < 5) return [word]
  for (const prefix of PREFIXES) {
    if (lower.startsWith(prefix) && lower.length - prefix.length >= 3) {
      return [word.slice(0, prefix.length), word.slice(prefix.length)]
    }
  }
  for (const suffix of SUFFIXES) {
    if (lower.endsWith(suffix) && lower.length - suffix.length >= 3) {
      const cut = word.length - suffix.length
      return [word.slice(0, cut), word.slice(cut)]
    }
  }
  return [word]
}

function hyphenateText(text: string): string {
  return text.split(/(\s+)/).map(token => {
    if (/^\s+$/.test(token)) return token
    const parts = hyphenateWord(token)
    return parts.length <= 1 ? token : parts.join(SOFT_HYPHEN)
  }).join('')
}

// --- Types ---
type LineSegment = { kind: 'text'; text: string; width: number } | { kind: 'space'; width: number }

type MeasuredLine = {
  segments: LineSegment[]
  wordWidth: number
  spaceCount: number
  naturalWidth: number
  maxWidth: number
  ending: 'paragraph-end' | 'wrap'
  trailingMarker: 'none' | 'soft-hyphen'
}

type QualityMetrics = {
  avgDeviation: number
  maxDeviation: number
  riverCount: number
  lineCount: number
}

// --- Layout helpers ---
function isSpaceText(text: string): boolean {
  return text.trim().length === 0
}

function buildSegmentsFromRange(
  segments: readonly string[],
  widths: readonly number[],
  fromSeg: number,
  toSeg: number,
  hyphenWidth: number,
): { segments: LineSegment[]; trailingMarker: 'none' | 'soft-hyphen'; ending: 'paragraph-end' | 'wrap' } {
  const ending = toSeg >= segments.length ? 'paragraph-end' as const : 'wrap' as const
  let trailingMarker: 'none' | 'soft-hyphen' = 'none'
  const lineSegs: LineSegment[] = []

  for (let i = fromSeg; i < toSeg; i++) {
    const text = segments[i]!
    if (text === SOFT_HYPHEN) {
      if (i === toSeg - 1) trailingMarker = 'soft-hyphen'
      continue
    }
    if (isSpaceText(text)) {
      lineSegs.push({ kind: 'space', width: widths[i]! })
    } else {
      lineSegs.push({ kind: 'text', text, width: widths[i]! })
    }
  }

  if (trailingMarker === 'none' && toSeg < segments.length) {
    if (segments[toSeg] === SOFT_HYPHEN) trailingMarker = 'soft-hyphen'
  }

  if (trailingMarker === 'soft-hyphen' && ending === 'wrap') {
    lineSegs.push({ kind: 'text', text: '-', width: hyphenWidth })
  }

  while (lineSegs.length > 0 && lineSegs[lineSegs.length - 1]!.kind === 'space') {
    lineSegs.pop()
  }

  return { segments: lineSegs, trailingMarker, ending }
}

function finalizeLine(segs: LineSegment[], maxWidth: number, ending: 'paragraph-end' | 'wrap', trailingMarker: 'none' | 'soft-hyphen'): MeasuredLine {
  let wordWidth = 0, spaceCount = 0, naturalWidth = 0
  for (const seg of segs) {
    naturalWidth += seg.width
    if (seg.kind === 'space') spaceCount++
    else wordWidth += seg.width
  }
  return { segments: segs, wordWidth, spaceCount, naturalWidth, maxWidth, ending, trailingMarker }
}

// --- Greedy layout ---
function layoutGreedy(prepared: PreparedTextWithSegments, maxWidth: number, hyphenWidth: number): MeasuredLine[] {
  const lines: MeasuredLine[] = []
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  while (true) {
    const line = layoutNextLine(prepared, cursor, maxWidth)
    if (line === null) break
    const { segments: segs, trailingMarker, ending } = buildSegmentsFromRange(
      prepared.segments, prepared.widths, line.start.segmentIndex, line.end.segmentIndex, hyphenWidth
    )
    lines.push(finalizeLine(segs, maxWidth, ending, trailingMarker))
    cursor = line.end
  }
  return lines
}

// --- Knuth-Plass optimal layout ---
type BreakCandidate = { segIndex: number; kind: 'start' | 'space' | 'soft-hyphen' | 'end' }

function layoutOptimal(prepared: PreparedTextWithSegments, maxWidth: number, normalSpaceWidth: number, hyphenWidth: number): MeasuredLine[] {
  const { segments, widths } = prepared
  const segCount = segments.length
  if (segCount === 0) return []

  const candidates: BreakCandidate[] = [{ segIndex: 0, kind: 'start' }]
  for (let i = 0; i < segCount; i++) {
    const text = segments[i]!
    if (text === SOFT_HYPHEN) {
      if (i + 1 < segCount) candidates.push({ segIndex: i + 1, kind: 'soft-hyphen' })
      continue
    }
    if (isSpaceText(text) && i + 1 < segCount) {
      candidates.push({ segIndex: i + 1, kind: 'space' })
    }
  }
  candidates.push({ segIndex: segCount, kind: 'end' })

  const n = candidates.length
  const dp = new Array(n).fill(Infinity)
  const prev = new Array(n).fill(-1)
  dp[0] = 0

  for (let to = 1; to < n; to++) {
    const isLast = candidates[to]!.kind === 'end'
    for (let from = to - 1; from >= 0; from--) {
      if (dp[from] === Infinity) continue
      const fromSeg = candidates[from]!.segIndex
      const toSeg = candidates[to]!.segIndex
      const hasHyphen = candidates[to]!.kind === 'soft-hyphen'

      let wordW = 0, spaces = 0
      for (let i = fromSeg; i < toSeg; i++) {
        if (segments[i] === SOFT_HYPHEN) continue
        if (isSpaceText(segments[i]!)) { spaces++; continue }
        wordW += widths[i]!
      }
      if (toSeg > fromSeg && isSpaceText(segments[toSeg - 1]!)) spaces--
      if (hasHyphen) wordW += hyphenWidth

      const natW = wordW + spaces * normalSpaceWidth
      if (natW > maxWidth * 2) break

      let badness = 0
      if (isLast) {
        badness = wordW > maxWidth ? 1e8 : 0
      } else if (spaces <= 0) {
        const slack = maxWidth - wordW
        badness = slack < 0 ? 1e8 : slack * slack * 10
      } else {
        const justSpace = (maxWidth - wordW) / spaces
        if (justSpace < 0 || justSpace < normalSpaceWidth * 0.4) { badness = 1e8 }
        else {
          const ratio = (justSpace - normalSpaceWidth) / normalSpaceWidth
          const abs = Math.abs(ratio)
          badness = abs * abs * abs * 1000
          const riverExcess = justSpace / normalSpaceWidth - RIVER_THRESHOLD
          if (riverExcess > 0) badness += 5000 + riverExcess * riverExcess * 10000
          if (justSpace < normalSpaceWidth * 0.65) {
            const d = normalSpaceWidth * 0.65 - justSpace
            badness += 3000 + d * d * 10000
          }
          if (hasHyphen) badness += 50
        }
      }

      const total = dp[from]! + badness
      if (total < dp[to]!) { dp[to] = total; prev[to] = from }
    }
  }

  const breaks: number[] = []
  let cur = n - 1
  while (cur > 0) {
    if (prev[cur] === -1) { cur--; continue }
    breaks.push(cur)
    cur = prev[cur]!
  }
  breaks.reverse()

  const lines: MeasuredLine[] = []
  let fromIdx = 0
  for (const toIdx of breaks) {
    const fromSeg = candidates[fromIdx]!.segIndex
    const toSeg = candidates[toIdx]!.segIndex
    const { segments: segs, trailingMarker, ending } = buildSegmentsFromRange(
      segments, widths, fromSeg, toSeg, hyphenWidth
    )
    // Override ending/marker based on candidate kind
    const actualEnding = candidates[toIdx]!.kind === 'end' ? 'paragraph-end' as const : 'wrap' as const
    const actualMarker = candidates[toIdx]!.kind === 'soft-hyphen' ? 'soft-hyphen' as const : 'none' as const
    lines.push(finalizeLine(segs, maxWidth, actualEnding, actualMarker))
    fromIdx = toIdx
  }
  return lines
}

// --- Metrics ---
function computeMetrics(lines: MeasuredLine[], normalSpaceWidth: number): QualityMetrics {
  let totalDev = 0, maxDev = 0, devCount = 0, riverCount = 0
  for (const line of lines) {
    if (line.ending === 'paragraph-end' || line.spaceCount <= 0) continue
    const justSpace = (line.maxWidth - line.wordWidth) / line.spaceCount
    const dev = Math.abs(justSpace - normalSpaceWidth) / normalSpaceWidth
    totalDev += dev
    if (dev > maxDev) maxDev = dev
    devCount++
    if (justSpace > normalSpaceWidth * RIVER_THRESHOLD) riverCount++
  }
  return { avgDeviation: devCount > 0 ? totalDev / devCount : 0, maxDeviation: maxDev, riverCount, lineCount: lines.length }
}

// --- Cached font measurements ---
let cachedCanvas: HTMLCanvasElement | null = null
let cachedCtx: CanvasRenderingContext2D | null = null

function getFontMeasurements() {
  if (!cachedCanvas) {
    cachedCanvas = document.createElement('canvas')
    cachedCtx = cachedCanvas.getContext('2d')!
    cachedCtx.font = FONT
  }
  return {
    normalSpaceWidth: cachedCtx!.measureText(' ').width,
    hyphenWidth: cachedCtx!.measureText('-').width,
  }
}

// --- DOM Rendering ---
function JustifiedLine({ line, normalSpaceWidth, showRivers }: { line: MeasuredLine; normalSpaceWidth: number; showRivers: boolean }) {
  if (line.ending === 'paragraph-end' || line.spaceCount <= 0 || line.naturalWidth < line.maxWidth * SHORT_LINE_RATIO) {
    return (
      <div style={{ whiteSpace: 'nowrap' }}>
        {line.segments.map((seg, i) =>
          seg.kind === 'text'
            ? <span key={i}>{seg.text}</span>
            : <span key={i} style={{ display: 'inline-block', width: seg.width }}> </span>
        )}
      </div>
    )
  }

  const justifiedSpace = (line.maxWidth - line.wordWidth) / line.spaceCount
  const isRiver = justifiedSpace > normalSpaceWidth * RIVER_THRESHOLD

  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      {line.segments.map((seg, i) =>
        seg.kind === 'text'
          ? <span key={i}>{seg.text}</span>
          : <span key={i} style={{
              display: 'inline-block',
              width: justifiedSpace,
              backgroundColor: showRivers && isRiver ? 'rgba(220, 80, 80, 0.3)' : undefined,
            }}> </span>
      )}
    </div>
  )
}

// --- Sample text ---
const SAMPLE_TEXT = `Every other kid chose fast. Brin walked the quarry gallery wall for maybe two minutes, pointed at a chunk of halite near the entrance, and said, "That one." Maha didn't even walk. She grabbed the first crystal that came loose in her hand and laughed and asked if she could start carving right now.

Kaia has been walking for twenty minutes. Her fingertips trail the rough salt face. The bioluminescent moss overhead swings between blue-green and amber in its slow, living rhythm, and the wall changes color under her hand, and none of these crystals are right. She can feel her mother and Elder Tannis waiting near the workbench, their voices low and patient, and the patience is worse than if they'd just told her to hurry up.

Then she passes a seam where the crystal structure juts outward, a rough knuckle of halite the size of her fist. The moss-light swings to amber. And something happens — the light passes through the crystal instead of bouncing off it. A vein of iron impurity catches the glow and holds it, amber fire suspended inside clear salt, warm and deep as honey held up to a candle.`

// --- Main Component ---
export default function PretextDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [showRivers, setShowRivers] = useState(true)
  const [mode, setMode] = useState<'comparison' | 'optimal'>('comparison')
  const [results, setResults] = useState<{
    greedy: { lines: MeasuredLine[][]; metrics: QualityMetrics } | null
    optimal: { lines: MeasuredLine[][]; metrics: QualityMetrics } | null
    normalSpaceWidth: number
  }>({ greedy: null, optimal: null, normalSpaceWidth: 0 })

  const computeLayout = useCallback((width: number) => {
    if (width <= 0) return

    const { normalSpaceWidth, hyphenWidth } = getFontMeasurements()
    const paragraphs = SAMPLE_TEXT.split('\n\n').filter(p => p.trim())

    const greedyParas: MeasuredLine[][] = []
    const optimalParas: MeasuredLine[][] = []
    const allGreedy: MeasuredLine[] = []
    const allOptimal: MeasuredLine[] = []

    for (const para of paragraphs) {
      const hyphenated = hyphenateText(para)
      const prepared = prepareWithSegments(hyphenated, FONT)

      const greedy = layoutGreedy(prepared, width, hyphenWidth)
      const optimal = layoutOptimal(prepared, width, normalSpaceWidth, hyphenWidth)

      greedyParas.push(greedy)
      optimalParas.push(optimal)
      allGreedy.push(...greedy)
      allOptimal.push(...optimal)
    }

    setResults({
      greedy: { lines: greedyParas, metrics: computeMetrics(allGreedy, normalSpaceWidth) },
      optimal: { lines: optimalParas, metrics: computeMetrics(allOptimal, normalSpaceWidth) },
      normalSpaceWidth,
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    let prevWidth = 0
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width ?? 0
      if (width !== prevWidth) {
        prevWidth = width
        setContainerWidth(width)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (containerWidth <= 0) return
    document.fonts.ready.then(() => {
      computeLayout(mode === 'comparison' ? Math.floor((containerWidth - 32) / 2) : containerWidth)
    })
  }, [containerWidth, computeLayout, mode])

  const metricColor = (value: number, goodThreshold: number, okThreshold: number) =>
    value < goodThreshold ? colors.good : value < okThreshold ? colors.accent1 : colors.bad

  const renderMetrics = (metrics: QualityMetrics, label: string) => (
    <div style={{
      marginTop: 8, padding: '8px 12px',
      background: colors.bgGlass, borderRadius: 4,
      fontFamily: fonts.mono, fontSize: '0.7rem',
      color: colors.textMuted, lineHeight: 1.6,
    }}>
      <div style={{ fontWeight: 600, color: colors.accent1, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {[
        { label: 'Avg spacing deviation', value: `${(metrics.avgDeviation * 100).toFixed(1)}%`, color: metricColor(metrics.avgDeviation, 0.15, 0.3) },
        { label: 'Max spacing deviation', value: `${(metrics.maxDeviation * 100).toFixed(1)}%` },
        { label: 'Typography rivers', value: String(metrics.riverCount), color: metricColor(metrics.riverCount, 1, 3) },
        { label: 'Lines', value: String(metrics.lineCount) },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{row.label}</span>
          <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
        </div>
      ))}
    </div>
  )

  const renderLines = (paras: MeasuredLine[][], normalSpaceWidth: number) => (
    <div style={{ fontFamily: fonts.serif, fontSize: 18, lineHeight: '28.8px', color: colors.text }}>
      {paras.map((lines, pi) => (
        <div key={pi} style={{ marginBottom: pi < paras.length - 1 ? 16 : 0 }}>
          {lines.map((line, li) => (
            <JustifiedLine key={li} line={line} normalSpaceWidth={normalSpaceWidth} showRivers={showRivers} />
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: 16, marginBottom: 24 }}>
        <h2 style={{
          fontFamily: fonts.serif,
          fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
          fontWeight: 400, color: colors.heading,
          margin: '0 0 8px', letterSpacing: '-0.02em',
        }}>
          Pretext Typography Lab
        </h2>
        <p style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.textMuted, margin: 0 }}>
          Comparing CSS justification with Pretext's Knuth-Plass optimal line-breaking algorithm — the same algorithm TeX uses for book-quality typesetting.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setMode('comparison')} style={toggleButtonStyle(mode === 'comparison')}>
          Side by Side
        </button>
        <button onClick={() => setMode('optimal')} style={toggleButtonStyle(mode === 'optimal')}>
          Full Width Optimal
        </button>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          fontFamily: fonts.mono, fontSize: '0.75rem',
          color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <input
            type="checkbox"
            checked={showRivers}
            onChange={e => setShowRivers(e.target.checked)}
            style={{ accentColor: colors.accent1 }}
          />
          Show Rivers
        </label>
      </div>

      {mode === 'comparison' && results.greedy && results.optimal ? (
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={sectionLabelStyle(colors.accent1)}>CSS Greedy Justification</div>
            <div style={{
              fontFamily: fonts.serif, fontSize: 18, lineHeight: '28.8px', color: colors.text,
              textAlign: 'justify', textAlignLast: 'left', hyphens: 'auto', WebkitHyphens: 'auto',
            }}>
              {SAMPLE_TEXT.split('\n\n').map((p, i) => <p key={i} style={{ margin: i > 0 ? '16px 0 0' : 0 }}>{p}</p>)}
            </div>
            {renderMetrics(results.greedy.metrics, 'CSS Greedy Metrics')}
          </div>
          <div style={{ width: 1, background: colors.border, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={sectionLabelStyle(colors.accent2)}>Pretext Knuth-Plass Optimal</div>
            {renderLines(results.optimal.lines, results.normalSpaceWidth)}
            {renderMetrics(results.optimal.metrics, 'Knuth-Plass Metrics')}
          </div>
        </div>
      ) : mode === 'optimal' && results.optimal ? (
        <div>
          <div style={sectionLabelStyle(colors.accent2)}>Pretext Knuth-Plass Optimal — Full Width</div>
          {renderLines(results.optimal.lines, results.normalSpaceWidth)}
          {renderMetrics(results.optimal.metrics, 'Knuth-Plass Metrics')}
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.textMuted }}>
          Loading Pretext layout engine...
        </div>
      )}

      <div style={{
        marginTop: 32, padding: '16px 0',
        borderTop: `1px solid ${colors.border}`,
        fontFamily: fonts.sans, fontSize: '0.8rem',
        color: colors.textMuted, opacity: 0.6, lineHeight: 1.6,
      }}>
        <strong style={{ color: colors.accent1 }}>How it works:</strong> Pretext measures text via an off-screen Canvas using the browser's own font metrics, then performs pure-arithmetic line breaking using the Knuth-Plass algorithm (the same algorithm TeX uses). This produces globally optimal justification — minimizing spacing variance across all lines simultaneously, rather than greedily line-by-line. The result is fewer "rivers" (distracting white-space channels) and more even word spacing throughout.
      </div>
    </div>
  )
}
