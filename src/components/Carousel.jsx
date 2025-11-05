import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

function Carousel({ images = [], height = 140, numPlaceholders = 4, onImageClick }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps'
  })

  // Prepare items
  let baseItems
  if (images.length === 0) {
    baseItems = Array.from({ length: numPlaceholders }, (_, i) => ({ key: `ph-${i}` }))
  } else if (images.length < numPlaceholders) {
    const imageItems = images.map((img, i) => ({ ...img, key: `${img.src}-${i}`, isImage: true }))
    const placeholderItems = Array.from({ length: numPlaceholders - images.length }, (_, i) => ({ 
      key: `ph-${i}`,
      isPlaceholder: true 
    }))
    baseItems = [...imageItems, ...placeholderItems]
  } else {
    baseItems = images.map((img, i) => ({ ...img, key: `${img.src}-${i}`, isImage: true }))
  }

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  return (
    <div className="carousel" style={{ '--carousel-height': `${height}px` }} aria-label="image carousel">
      <button 
        className="carousel-nav-button carousel-nav-button-left"
        onClick={scrollPrev}
        aria-label="Scroll carousel left"
      >
        <ChevronLeft />
      </button>
      <button 
        className="carousel-nav-button carousel-nav-button-right"
        onClick={scrollNext}
        aria-label="Scroll carousel right"
      >
        <ChevronRight />
      </button>
      <div className="embla" ref={emblaRef}>
                 <div className="embla__container">
                   {baseItems.map((item, idx) => (
                     <div className="embla__slide" key={item.key || idx}>
                       {item.isPlaceholder || (!item.isImage && !item.src) ? (
                         <div className="carousel-placeholder" aria-hidden="true" />
                       ) : (
                         <div 
                           className="carousel-image-wrapper" 
                           onClick={() => onImageClick && onImageClick(item)}
                           style={{ cursor: onImageClick ? 'pointer' : 'default' }}
                         >
                           <img src={item.src} alt={item.alt || ''} loading="lazy" />
                           {item.tags && item.tags.length > 0 && (
                             <div className="carousel-image-overlay">
                               <div className="carousel-tags">
                                 {item.tags.map((tag, tagIdx) => (
                                   <span key={tagIdx} className="carousel-tag">{tag}</span>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
      </div>
    </div>
  )
}

export default Carousel


