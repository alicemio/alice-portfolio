import React, { useState, useRef, useEffect } from 'react'

function SVGPieChart({ data, colors, size = 200, innerRadius = 40, outerRadius = 80 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const svgRef = useRef(null)
  const [textWidths, setTextWidths] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Calculate approximate text width based on character count and font size
  const getTextWidth = (text, fontSize) => {
    // Approximate: average character width is about 0.6 * fontSize for Inter font
    return text.length * fontSize * 0.6
  }
  
  // Measure actual text widths after render using SVG getBBox
  useEffect(() => {
    if (!svgRef.current) return
    
    // Use requestAnimationFrame to defer measurement until after render
    const rafId = requestAnimationFrame(() => {
      const widths = {}
      const textElements = svgRef.current?.querySelectorAll('text[data-measure]')
      textElements?.forEach(el => {
        try {
          const bbox = el.getBBox()
          const key = el.getAttribute('data-measure')
          widths[key] = bbox.width
        } catch (e) {
          // Fallback to approximate width if getBBox fails
          const key = el.getAttribute('data-measure')
          const text = el.textContent
          const fontSize = parseFloat(getComputedStyle(el).fontSize) || 9
          widths[key] = getTextWidth(text, fontSize)
        }
      })
      setTextWidths(widths)
    })
    
    return () => cancelAnimationFrame(rafId)
  }, [data])
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  // Adjust size for mobile
  const displaySize = isMobile ? size * 0.7 : size
  const displayInnerRadius = isMobile ? innerRadius * 0.7 : innerRadius
  const displayOuterRadius = isMobile ? outerRadius * 0.7 : outerRadius
  
  // Calculate angles for each segment using adjusted sizes
  let currentAngle = -90 // Start at top
  const segments = data.map((item, index) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle
    
    // Convert angles to radians for SVG path
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    
    // Calculate coordinates for arc using display sizes
    const x1 = displaySize / 2 + displayOuterRadius * Math.cos(startAngleRad)
    const y1 = displaySize / 2 + displayOuterRadius * Math.sin(startAngleRad)
    const x2 = displaySize / 2 + displayOuterRadius * Math.cos(endAngleRad)
    const y2 = displaySize / 2 + displayOuterRadius * Math.sin(endAngleRad)
    
    // Large arc flag (1 if angle > 180, 0 otherwise)
    const largeArcFlag = angle > 180 ? 1 : 0
    
    // Create path for donut segment
    const innerX1 = displaySize / 2 + displayInnerRadius * Math.cos(startAngleRad)
    const innerY1 = displaySize / 2 + displayInnerRadius * Math.sin(startAngleRad)
    const innerX2 = displaySize / 2 + displayInnerRadius * Math.cos(endAngleRad)
    const innerY2 = displaySize / 2 + displayInnerRadius * Math.sin(endAngleRad)
    
    const outerArc = `M ${innerX1} ${innerY1} 
                      L ${x1} ${y1} 
                      A ${displayOuterRadius} ${displayOuterRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
                      L ${innerX2} ${innerY2} 
                      A ${displayInnerRadius} ${displayInnerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1} Z`
    
    // Calculate label position (middle of segment)
    const midAngle = (startAngle + endAngle) / 2
    const midAngleRad = (midAngle * Math.PI) / 180
    const labelRadius = (displayInnerRadius + displayOuterRadius) / 2
    const labelX = displaySize / 2 + labelRadius * Math.cos(midAngleRad)
    const labelY = displaySize / 2 + labelRadius * Math.sin(midAngleRad)
    
    return {
      ...item,
      path: outerArc,
      labelX,
      labelY,
      percentage: (percentage * 100).toFixed(1),
      midAngle,
      index
    }
  })
  
  const isHovered = hoveredIndex !== null
  
  return (
    <div className="svg-pie-chart-container" style={{ 
      position: 'relative', 
      width: displaySize, 
      height: displaySize,
      margin: '0 auto',
      flexShrink: 0,
      zIndex: 1,
      isolation: 'isolate'
    }}>
      <svg ref={svgRef} width={displaySize} height={displaySize} style={{ display: 'block' }}>
        <g>
          {segments.map((segment, index) => {
            const isHoveredSegment = hoveredIndex === index && !isMobile
            const fillColor = colors[index % colors.length]
            
            return (
              <g key={index}>
                <path
                  d={segment.path}
                  fill={fillColor}
                  stroke={isHoveredSegment ? '#fff' : 'transparent'}
                  strokeWidth={isHoveredSegment ? 2 : 0}
                  opacity={isHovered && !isMobile ? (isHoveredSegment ? 1 : 0.3) : 1}
                  style={{
                    cursor: isMobile ? 'default' : 'pointer',
                    transition: 'opacity 0.2s ease, stroke-width 0.2s ease',
                    transform: isHoveredSegment ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${displaySize / 2}px ${displaySize / 2}px`,
                  }}
                  onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                  onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                />
                {/* Show label and percentage only on hover (desktop) - combined in one cohesive element */}
                {isHoveredSegment && !isMobile && (
                  <g>
                    {/* Single background rectangle for both label and percentage */}
                    {(() => {
                      const labelText = segment.name
                      const percentText = `${segment.percentage}%`
                      const combinedText = `${labelText} ${percentText}`
                      const maxWidth = Math.max(
                        getTextWidth(labelText, 9),
                        getTextWidth(percentText, 8)
                      )
                      const totalHeight = 28 // Height for both lines plus spacing
                      return (
                        <>
                          <rect
                            x={segment.labelX - (maxWidth / 2) - 6}
                            y={segment.labelY - 10}
                            width={maxWidth + 12}
                            height={totalHeight}
                            fill="rgba(0, 0, 0, 0.6)"
                            rx={4}
                            style={{ pointerEvents: 'none' }}
                          />
                          <text
                            data-measure={`label-${index}`}
                            x={segment.labelX}
                            y={segment.labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255, 255, 255, 0.95)"
                            style={{
                              fontSize: '9px',
                              fontWeight: '500',
                              fontFamily: 'Inter, sans-serif',
                              pointerEvents: 'none',
                            }}
                          >
                            {labelText}
                          </text>
                          <text
                            data-measure={`percent-${index}`}
                            x={segment.labelX}
                            y={segment.labelY + 12}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255, 255, 255, 0.95)"
                            style={{
                              fontSize: '8px',
                              fontWeight: '400',
                              fontFamily: 'Inter, sans-serif',
                              pointerEvents: 'none',
                            }}
                          >
                            {percentText}
                          </text>
                        </>
                      )
                    })()}
                  </g>
                )}
              </g>
            )
          })}
        </g>
      </svg>
      {/* Legend for mobile */}
      {isMobile && (
        <div className="pie-chart-legend" style={{
          marginTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '100%',
          padding: '0 0.5rem',
          boxSizing: 'border-box',
        }}>
          {data.map((item, index) => {
            const fillColor = colors[index % colors.length]
            const percentage = ((item.value / total) * 100).toFixed(1)
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  color: 'var(--text-primary)',
                  padding: '0.25rem 0',
                  lineHeight: '1.5',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: fillColor,
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, wordBreak: 'break-word', minWidth: 0 }}>{item.name}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                  {percentage}%
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SVGPieChart

