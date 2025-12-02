import React, { useState, useEffect } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

// Custom tick component to handle text wrapping
const CustomTick = (props) => {
  const { payload, x, y, textAnchor, cx, cy, isMobile: isMobileProp } = props
  const text = payload?.value || ''
  
  // Use prop if provided, otherwise check viewport (memoized check)
  const isMobile = isMobileProp !== undefined ? isMobileProp : (typeof window !== 'undefined' && window.innerWidth < 768)
  const maxLength = isMobile ? 10 : 15 // Increased to accommodate longer labels like "Accessibility"
  const fontSize = isMobile ? 10 : 12 // Increased font size for better readability
  
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
  
  // If text is short, display on one line
  if (text.length <= maxLength) {
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
        {text}
      </text>
    )
  }
  
  // Split into two lines intelligently
  const words = text.split(' ')
  let line1 = ''
  let line2 = ''
  
  // Try to split by words first - find the best break point
  let currentLine = ''
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? currentLine + ' ' + words[i] : words[i]
    if (testLine.length <= maxLength) {
      currentLine = testLine
    } else {
      // We've hit the limit, assign currentLine to line1 and start line2
      if (!line1) {
        line1 = currentLine || words[i]
        currentLine = words[i]
      } else {
        // Build line2
        line2 = line2 ? line2 + ' ' + words[i] : words[i]
      }
    }
  }
  
  // Assign remaining to line2 if line1 exists, otherwise to line1
  if (!line1) {
    line1 = currentLine
  } else if (currentLine && !line2) {
    line2 = currentLine
  }
  
  // If still no line2 and text has hyphen, split at hyphen
  if (!line2 && text.includes('-')) {
    const hyphenIndex = text.indexOf('-')
    if (hyphenIndex > 0 && hyphenIndex < text.length - 1) {
      const beforeHyphen = text.substring(0, hyphenIndex + 1)
      const afterHyphen = text.substring(hyphenIndex + 1).trim()
      if (beforeHyphen.length <= maxLength + 2) {
        line1 = beforeHyphen
        line2 = afterHyphen
      }
    }
  }
  
  // Final fallback: split at maxLength if still no line2
  if (!line2 && line1.length > maxLength) {
    const splitPoint = Math.min(maxLength, Math.floor(text.length / 2))
    line1 = text.substring(0, splitPoint)
    line2 = text.substring(splitPoint).trim()
  } else if (!line2 && text.length > maxLength) {
    line1 = text.substring(0, maxLength)
    line2 = text.substring(maxLength).trim()
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
      <tspan x={offsetX} dy="0">{line1}</tspan>
      {line2 && <tspan x={offsetX} dy="14">{line2}</tspan>}
    </text>
  )
}

function RadarChartComponent({ data, colors, categoryIndex = 0 }) {
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

  // Responsive sizing
  const chartHeight = isMobile ? '350px' : isTablet ? '450px' : '400px'
  const chartPadding = isMobile ? '10px' : '20px'
  const chartMargins = isMobile 
    ? { top: 5, right: 20, bottom: 20, left: 20 }
    : isTablet
    ? { top: 0, right: 30, bottom: 30, left: 30 }
    : { top: 0, right: 40, bottom: 40, left: 40 }

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
              />
            )}
            outerRadius={isMobile ? 85 : isTablet ? 100 : 140}
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

