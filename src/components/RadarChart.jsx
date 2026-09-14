import React, { useState, useEffect } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

// Custom tick component to handle text wrapping
const CustomTick = (props) => {
  const { payload, x, y, textAnchor, cx, cy, isMobile: isMobileProp, compactLabels = false } = props
  const text = payload?.value || ''
  
  // Use prop if provided, otherwise check viewport (memoized check)
  const isMobile = isMobileProp !== undefined ? isMobileProp : (typeof window !== 'undefined' && window.innerWidth < 768)
  // Explore half-width panels need earlier wraps; main site keeps longer single-line labels.
  const maxLength = compactLabels
    ? (isMobile ? 11 : 12)
    : (isMobile ? 14 : 25)
  const fontSize = isMobile ? 10 : 12
  
  // Use original x, y positions - outerRadius on PolarAngleAxis handles spacing
  // Add extra vertical offset for top and bottom labels to prevent sticking to chart
  let offsetX = x
  let offsetY = y
  
  // Get chart center from props or estimate (chart is typically centered)
  // For a 400px height chart with margins, center is roughly at y=200
  const chartCenterY = cy !== undefined ? cy : 200
  
  // Check if label is at the top (y is near the top)
  const isTopLabel = y < chartCenterY - 80 // Labels at the top
  // Check if label is at the bottom (y is near the bottom)
  const isBottomLabel = y > chartCenterY + 80 // Labels at the bottom
  
  if (isTopLabel) {
    offsetY = y - 12 // Move up by 12 pixels
  } else if (isBottomLabel) {
    offsetY = y + 12 // Move down by 12 pixels for consistent spacing
  }

  const splitIntoLines = (value) => {
    const words = value.split(' ').filter(Boolean)
    if (compactLabels && words.length >= 2 && value.length > maxLength) {
      // Balance word wrap across two lines (e.g. "Landscape" / "Research")
      let bestSplit = 1
      let bestScore = Infinity
      for (let i = 1; i < words.length; i += 1) {
        const first = words.slice(0, i).join(' ')
        const second = words.slice(i).join(' ')
        const score = Math.abs(first.length - second.length) + (first.length > maxLength + 4 ? 20 : 0)
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

    // Never mid-split a single word in compact mode (avoids "Accessibilit" / "y")
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
      <tspan x={offsetX} dy={compactLabels ? '-0.35em' : '0'}>{line1}</tspan>
      <tspan x={offsetX} dy={compactLabels ? '1.2em' : '14'}>{line2}</tspan>
    </text>
  )
}

function RadarChartComponent({ data, colors, categoryIndex = 0, compactLabels = false }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Transform pie chart data format to radar chart format
  // Pie chart: [{ name: 'Research', value: 18 }, ...]
  // Radar chart: [{ subject: 'Research', A: 18 }, ...]
  const radarData = data.map(item => ({
    subject: item.name,
    A: item.value
  }))

  // Get the color for this category (use categoryIndex to cycle through colors)
  const mainColor = colors[categoryIndex % colors.length] || '#3b82f6'

  // Responsive sizing — explore panels are narrower, so use a tighter chart there
  const chartHeight = compactLabels
    ? (isMobile ? '320px' : '360px')
    : (isMobile ? '350px' : isTablet ? '450px' : '400px')
  const chartPadding = isMobile ? '10px' : compactLabels ? '12px' : '20px'
  const chartMargins = compactLabels
    ? (isMobile
      ? { top: 8, right: 28, bottom: 28, left: 28 }
      : { top: 10, right: 36, bottom: 36, left: 36 })
    : (isMobile 
      ? { top: 5, right: 30, bottom: 30, left: 30 }
      : isTablet
      ? { top: 0, right: 50, bottom: 50, left: 50 }
      : { top: 0, right: 60, bottom: 60, left: 60 })
  const angleOuterRadius = compactLabels
    ? (isMobile ? 78 : 105)
    : (isMobile ? 85 : isTablet ? 100 : 140)

  return (
    <div style={{ 
      width: '100%', 
      height: chartHeight, 
      minHeight: chartHeight, 
      margin: '0 auto', 
      padding: isMobile ? `${chartPadding} ${chartPadding} ${chartPadding} ${chartPadding}` : `0 ${chartPadding} ${chartPadding} ${chartPadding}`, 
      paddingTop: '0', 
      marginTop: '0',
      marginBottom: '0', 
      overflow: 'visible', 
      boxSizing: 'border-box', 
      outline: 'none', 
      border: 'none' 
    }}>
      <ResponsiveContainer width="100%" height="100%" style={{ marginTop: '0', paddingTop: '0' }}>
        <RadarChart 
          data={radarData}
          margin={chartMargins}
        >
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={(props) => (
              <CustomTick
                {...props}
                fontSize={12}
                fill="var(--text-primary)"
                isMobile={isMobile}
                compactLabels={compactLabels}
              />
            )}
            outerRadius={angleOuterRadius}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 'dataMax']} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Value"
            dataKey="A"
            stroke={mainColor}
            fill={mainColor}
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RadarChartComponent
