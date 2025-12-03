import React, { useEffect, useMemo } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

function Lightbox({ isOpen, onClose, image, onNext, onPrevious, hasNext, hasPrevious }) {
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
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious()
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, hasNext, hasPrevious, onNext, onPrevious])

  if (!isOpen || !image) return null

  // Check if this is a video
  const isVideo = image.video || (image.src && /\.(mp4|webm|ogg)$/i.test(image.src))

  // Use high-res version if available, otherwise fall back to original
  const displayImageSrc = highResImageSrc || image.src

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {hasPrevious && (
        <button 
          className="lightbox-nav-button lightbox-nav-button-left" 
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          aria-label="Previous image"
        >
          <ChevronLeft />
        </button>
      )}
      {hasNext && (
        <button 
          className="lightbox-nav-button lightbox-nav-button-right" 
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next image"
        >
          <ChevronRight />
        </button>
      )}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <X />
        </button>
        <div className="lightbox-image-container">
          {isVideo ? (
            <video 
              src={image.video || image.src}
              autoPlay
              loop
              muted
              playsInline
              className="lightbox-main-image"
            />
          ) : (
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
          )}
        </div>
        {(image.defaultText || image.description || image.tags) && (
          <div className="lightbox-info">
            <div className="lightbox-title-row">
              {image.defaultText && (
                <h3 className="lightbox-title">{image.defaultText}</h3>
              )}
              {image.caseStudyLink && (
                <a href={image.caseStudyLink} target="_blank" rel="noopener noreferrer" className="lightbox-case-study-link">
                  View Case Study
                </a>
              )}
            </div>
            {image.tags && image.tags.length > 0 && (
              <div className="lightbox-tags">
                {image.tags.map((tag, idx) => (
                  <span key={idx} className="lightbox-tag">{tag}</span>
                ))}
              </div>
            )}
            {image.description && (
              <p className="lightbox-description">{image.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Lightbox

