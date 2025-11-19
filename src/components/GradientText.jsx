import React from 'react'
import { motion } from 'framer-motion'

function GradientText({ 
  text, 
  className = '', 
  gradient = 'linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)',
  neon = false,
  transition = { duration: 3, repeat: Infinity, ease: 'linear' }
}) {
  const baseStyle = {
    backgroundImage: gradient,
  }

  return (
    <span 
      className={`relative inline-block ${className}`}
    >
      <motion.span
        className="m-0 text-transparent bg-clip-text"
        style={{
          ...baseStyle,
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        animate={{ backgroundPositionX: ['0%', '200%'] }}
        transition={transition}
      >
        {text}
      </motion.span>
      {neon && (
        <motion.span
          className="m-0 absolute top-0 left-0 text-transparent bg-clip-text blur-[8px] mix-blend-plus-lighter"
          style={{
            ...baseStyle,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={transition}
        >
          {text}
        </motion.span>
      )}
    </span>
  )
}

export default GradientText

