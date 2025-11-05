import React, { useEffect, useMemo } from 'react'
import { X } from 'lucide-react'

function Lightbox({ isOpen, onClose, image }) {
  // Get higher resolution image if available (e.g., *3x.png versions)
  const highResImageSrc = useMemo(() => {
    if (!image?.src) return null
    // Check if there's a 3x version available
    const basePath = image.src.replace(/\.(png|jpg|jpeg)$/i, '')
    const extension = image.src.match(/\.(png|jpg|jpeg)$/i)?.[1] || 'png'
    // Try 3x version first, then 2x, then original
    return `${basePath}3x.${extension}`
  }, [image?.src])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !image) return null

  // Use high-res version if available, otherwise fall back to original
  const displayImageSrc = highResImageSrc || image.src

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <X />
        </button>
        <div className="lightbox-image-container">
          <img 
            src={displayImageSrc} 
            alt={image.alt || ''} 
            className="lightbox-main-image"
            onError={(e) => {
              // Fallback to original if high-res version fails to load
              if (e.target.src !== image.src) {
                e.target.src = image.src
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Lightbox

