import React, { useEffect, useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

const CustomTick = (props) => {
  const { payload, x, y, textAnchor, cy, isMobile: isMobileProp, compactLabels = false } = props
  const text = payload?.value || ''
  const isMobile =
    isMobileProp !== undefined
      ? isMobileProp
      : typeof window !== 'undefined' && window.innerWidth < 768
  const maxLength = compactLabels ? (isMobile ? 11 : 12) : isMobile ? 14 : 25
  const fontSize = isMobile ? 10 : 12

  let offsetX = x
  let offsetY = y
  const chartCenterY = cy !== undefined ? cy : 200
  const isTopLabel = y < chartCenterY - 80
  const isBottomLabel = y > chartCenterY + 80

  if (isTopLabel) {
    offsetY = y - 12
  } else if (isBottomLabel) {
    offsetY = y + 12
  }

  const splitIntoLines = (value) => {
    const words = value.split(' ').filter(Boolean)
    if (compactLabels && words.length >= 2 && value.length > maxLength) {
      let bestSplit = 1
      let bestScore = Infinity
      for (let i = 1; i < words.length; i += 1) {
        const first = words.slice(0, i).join(' ')
        const second = words.slice(i).join(' ')
        const score =
          Math.abs(first.length - second.length) + (first.length > maxLength + 4 ? 20 : 0)
        if (score < bestScore) {
          bestScore = score
          bestSplit = i
        }
      }
      return {
        line1: words.slice(0, bestSplit).join(' '),
        line2: words.slice(bestSplit).join(' '),
      }
    }

    if (value.length <= maxLength) {
      return { line1: value, line2: '' }
    }

    if (words.length === 1) {
      if (compactLabels) {
        return { line1: value, line2: '' }
      }
      return {
        line1: value.substring(0, maxLength),
        line2: value.substring(maxLength).trim(),
      }
    }

    let line1 = ''
    let line2 = ''
    let currentLine = ''
    for (let i = 0; i < words.length; i += 1) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i]
      if (testLine.length <= maxLength) {
        currentLine = testLine
      } else if (!line1) {
        line1 = currentLine || words[i]
        currentLine = words[i]
      } else {
        line2 = line2 ? `${line2} ${words[i]}` : words[i]
      }
    }
    if (!line1) {
      line1 = currentLine
    } else if (currentLine && !line2) {
      line2 = currentLine
    }

    if (!line2 && value.includes('-')) {
      const hyphenIndex = value.indexOf('-')
      if (hyphenIndex > 0 && hyphenIndex < value.length - 1) {
        return {
          line1: value.substring(0, hyphenIndex + 1),
          line2: value.substring(hyphenIndex + 1).trim(),
        }
      }
    }

    if (!line2 && line1.length > maxLength) {
      const splitPoint = Math.min(maxLength, Math.floor(value.length / 2))
      return {
        line1: value.substring(0, splitPoint),
        line2: value.substring(splitPoint).trim(),
      }
    }

    if (!line2 && value.length > maxLength) {
      return {
        line1: value.substring(0, maxLength),
        line2: value.substring(maxLength).trim(),
      }
    }

    return { line1, line2 }
  }

  const { line1, line2 } = splitIntoLines(text)

  if (!line2) {
    return (
      <text
        x={offsetX}
        y={offsetY}
        textAnchor={textAnchor}
        fill="var(--text-primary)"
        fontSize={fontSize}
        fontFamily="Inter, sans-serif"
        style={{ overflow: 'visible' }}
      >
        {line1}
      </text>
    )
  }

  return (
    <text
      x={offsetX}
      y={offsetY}
      textAnchor={textAnchor}
      fill="var(--text-primary)"
      fontSize={fontSize}
      fontFamily="Inter, sans-serif"
      style={{ overflow: 'visible' }}
    >
      <tspan x={offsetX} dy={compactLabels ? '-0.35em' : '0'}>
        {line1}
      </tspan>
      <tspan x={offsetX} dy={compactLabels ? '1.2em' : '14'}>
        {line2}
      </tspan>
    </text>
  )
}

function getBreakpoint(width) {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function RadarChartComponent({ data, colors, categoryIndex = 0, compactLabels = false }) {
  const [breakpoint, setBreakpoint] = useState(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'desktop'
  )
  const [enableAnimation, setEnableAnimation] = useState(true)
  const [isResizing, setIsResizing] = useState(false)

  const isMobile = breakpoint === 'mobile'
  const isTablet = breakpoint === 'tablet'
  const shouldAnimate = enableAnimation && !isResizing

  useEffect(() => {
    let frame = 0
    let breakpointTimeout = 0
    let resizeEndTimeout = 0

    const syncBreakpoint = () => {
      const next = getBreakpoint(window.innerWidth)
      setBreakpoint((prev) => (prev === next ? prev : next))
    }

    const onResize = () => {
      setIsResizing(true)
      setEnableAnimation(false)
      window.cancelAnimationFrame(frame)
      window.clearTimeout(breakpointTimeout)
      window.clearTimeout(resizeEndTimeout)

      breakpointTimeout = window.setTimeout(() => {
        frame = window.requestAnimationFrame(syncBreakpoint)
      }, 120)

      // Keep animation off until resizing has fully stopped.
      resizeEndTimeout = window.setTimeout(() => {
        setIsResizing(false)
      }, 180)
    }

    syncBreakpoint()
    window.addEventListener('resize', onResize)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(breakpointTimeout)
      window.clearTimeout(resizeEndTimeout)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Animate only when switching expertise tabs — not when parent re-renders
  // with a new inline `data` array during resize.
  useEffect(() => {
    if (isResizing) return undefined
    setEnableAnimation(true)
    const timeoutId = window.setTimeout(() => setEnableAnimation(false), 850)
    return () => window.clearTimeout(timeoutId)
  }, [categoryIndex])

  const radarData = data.map((item) => ({
    subject: item.name,
    A: item.value,
  }))

  const mainColor = colors[categoryIndex % colors.length] || '#5B8DEF'
  const fillColor = colors[categoryIndex % colors.length] || mainColor

  const chartHeight = compactLabels
    ? isMobile
      ? 320
      : 360
    : isMobile
      ? 350
      : isTablet
        ? 420
        : 400

  const chartMargins = compactLabels
    ? isMobile
      ? { top: 12, right: 24, bottom: 24, left: 24 }
      : { top: 16, right: 32, bottom: 32, left: 32 }
    : isMobile
      ? { top: 8, right: 28, bottom: 28, left: 28 }
      : isTablet
        ? { top: 12, right: 40, bottom: 40, left: 40 }
        : { top: 12, right: 48, bottom: 48, left: 48 }

  // Percentage radius scales smoothly with the container instead of jumping in px.
  const outerRadius = compactLabels ? (isMobile ? '62%' : '68%') : isMobile ? '64%' : '70%'

  return (
    <div
      className={`radar-chart-root${compactLabels ? ' is-compact' : ''}`}
      style={{
        width: '100%',
        height: chartHeight,
        minHeight: chartHeight,
        margin: '0 auto',
        overflow: 'visible',
        boxSizing: 'border-box',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={chartMargins} outerRadius={outerRadius}>
          <PolarGrid stroke="var(--border-color)" strokeOpacity={0.85} />
          <PolarAngleAxis
            dataKey="subject"
            tick={(props) => (
              <CustomTick {...props} isMobile={isMobile} compactLabels={compactLabels} />
            )}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 20]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Value"
            dataKey="A"
            stroke={mainColor}
            fill={fillColor}
            fillOpacity={0.45}
            strokeWidth={2.25}
            isAnimationActive={shouldAnimate}
            animationBegin={0}
            animationDuration={shouldAnimate ? 780 : 0}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RadarChartComponent
