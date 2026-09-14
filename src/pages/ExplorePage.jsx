import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DarkModeToggle from '../components/DarkModeToggle'
import Lightbox from '../components/Lightbox'
import RadarChartComponent from '../components/RadarChart'
import { projects, featuredProjects, gridProjects } from '../data/projects'
import './ExplorePage.css'

const SECTIONS = [
  { id: 'work', label: 'Projects' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'resume', label: 'Resume' },
]

const EXPLORE_MOBILE_MAX = 900

const COLORS = ['#4f7fd4', '#9b6bc9', '#d9769a', '#4f7fd4', '#9b6bc9', '#d9769a']
const RESUME_URL = '/AliceMCook_Resume_2026.pdf'

function getWorkSummary(description) {
  if (!description) return ''
  const lines = description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const first = lines.find((line) => !/^(problem|outcomes)$/i.test(line))
  return first || lines[0] || ''
}

function ExplorePage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : true
  })
  const [activeSection, setActiveSection] = useState('work')
  const [activeExpertiseTab, setActiveExpertiseTab] = useState(0)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(null)
  const [offsetX, setOffsetX] = useState(0)
  const [panelWidth, setPanelWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= EXPLORE_MOBILE_MAX : false
  )

  const viewportRef = useRef(null)
  const railRef = useRef(null)
  const offsetRef = useRef(0)
  const panelWidthRef = useRef(0)
  const navIntentRef = useRef(null)
  const dragRef = useRef({
    active: false,
    mode: null,
    startX: 0,
    startY: 0,
    startOffset: 0,
    pointerId: null,
    overProjects: false,
  })

  useEffect(() => {
    offsetRef.current = offsetX
  }, [offsetX])

  useEffect(() => {
    panelWidthRef.current = panelWidth
  }, [panelWidth])

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${EXPLORE_MOBILE_MAX}px)`)
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const getMaxOffset = (width = panelWidthRef.current) => {
    if (!width) return 0
    // Two panels visible at once; don't use rail.scrollWidth here — the viewport
    // can expand with content and incorrectly report maxOffset as 0.
    return Math.max(0, width * Math.max(0, SECTIONS.length - 2))
  }

  const setOffset = (value) => {
    const maxOffset = getMaxOffset()
    const next = Math.min(Math.max(0, value), maxOffset)
    offsetRef.current = next
    setOffsetX(next)
  }

  const resetDrag = () => {
    dragRef.current = {
      active: false,
      mode: null,
      startX: 0,
      startY: 0,
      startOffset: 0,
      pointerId: null,
      overProjects: false,
    }
  }

  const toggleDarkMode = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    localStorage.setItem('darkMode', next.toString())
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  useEffect(() => {
    document.documentElement.classList.add('explore-active')
    document.body.classList.add('explore-active')
    return () => {
      document.documentElement.classList.remove('explore-active')
      document.body.classList.remove('explore-active')
    }
  }, [])

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current
      if (!viewport || window.innerWidth <= EXPLORE_MOBILE_MAX) return
      const width = Math.floor(viewport.clientWidth / 2)
      if (!width) return
      panelWidthRef.current = width
      setPanelWidth(width)
      // Re-clamp after width changes so we never leave a blank trailing panel.
      requestAnimationFrame(() => setOffset(offsetRef.current))
    }

    measure()
    const frame = window.requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    if (isMobile || !panelWidth) return
    const index = Math.round(offsetX / panelWidth)
    const maxOffset = panelWidth * Math.max(0, SECTIONS.length - 2)
    const atEnd = maxOffset > 0 && offsetX >= maxOffset - 1

    if (!atEnd) {
      navIntentRef.current = null
      const section = SECTIONS[Math.min(Math.max(index, 0), SECTIONS.length - 1)]
      setActiveSection(section.id)
      return
    }

    // Expertise and Resume share the final offset (two panels visible).
    // Prefer Resume after scroll; keep a nav click intent when present.
    const intent = navIntentRef.current
    if (intent === 'expertise' || intent === 'resume') {
      setActiveSection(intent)
      return
    }
    setActiveSection('resume')
  }, [offsetX, panelWidth, isMobile])

  useEffect(() => {
    if (!isMobile) return

    const syncActiveFromScroll = () => {
      const marker = 112
      let current = SECTIONS[0].id
      for (const { id } of SECTIONS) {
        const el = document.getElementById(`explore-${id}`)
        if (!el) continue
        if (el.getBoundingClientRect().top <= marker) {
          current = id
        }
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    syncActiveFromScroll()
    window.addEventListener('scroll', syncActiveFromScroll, { passive: true })
    window.addEventListener('resize', syncActiveFromScroll)
    return () => {
      window.removeEventListener('scroll', syncActiveFromScroll)
      window.removeEventListener('resize', syncActiveFromScroll)
    }
  }, [isMobile])

  useEffect(() => {
    const handleWheel = (event) => {
      if (window.innerWidth <= EXPLORE_MOBILE_MAX) return
      if (!document.body.classList.contains('explore-active')) return

      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      if (!absX && !absY) return

      const width = panelWidthRef.current
      if (!width) return

      // Prefer explicit horizontal trackpad/mouse intent.
      const delta = absX > absY ? event.deltaX : event.deltaY

      const target = event.target instanceof Element ? event.target : event.target?.parentElement
      const verticalScroller = target?.closest?.('.explore-panel-body.is-vert-scroll')

      if (verticalScroller && absY >= absX) {
        const canScrollDown =
          verticalScroller.scrollTop + verticalScroller.clientHeight <
          verticalScroller.scrollHeight - 2
        const canScrollUp = verticalScroller.scrollTop > 2
        if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) {
          return
        }
      }

      event.preventDefault()
      navIntentRef.current = null
      setOffset(offsetRef.current + delta)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const onPointerDown = (event) => {
      if (window.innerWidth <= EXPLORE_MOBILE_MAX) return
      if (event.button !== undefined && event.button !== 0) return
      const target = event.target instanceof Element ? event.target : null
      if (!target) return
      if (target.closest('a, button, input, textarea')) return

      const overVertScroll = Boolean(target.closest('.explore-panel-body.is-vert-scroll'))

      dragRef.current = {
        active: true,
        mode: null,
        startX: event.clientX,
        startY: event.clientY,
        startOffset: offsetRef.current,
        pointerId: event.pointerId,
        overProjects: overVertScroll,
      }
    }

    const onPointerMove = (event) => {
      const drag = dragRef.current
      if (!drag.active) return

      const dx = event.clientX - drag.startX
      const dy = event.clientY - drag.startY

      if (!drag.mode) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return

        if (drag.overProjects && Math.abs(dy) > Math.abs(dx)) {
          // Let Projects handle vertical scrolling.
          resetDrag()
          return
        }

        drag.mode = 'horizontal'
        viewport.setPointerCapture?.(event.pointerId)
      }

      if (drag.mode !== 'horizontal') return
      event.preventDefault()
      navIntentRef.current = null
      setOffset(drag.startOffset - dx)
    }

    const onPointerUp = (event) => {
      const drag = dragRef.current
      if (!drag.active && drag.mode !== 'horizontal') return

      const wasHorizontal = drag.mode === 'horizontal'
      if (wasHorizontal && drag.pointerId != null) {
        try {
          viewport.releasePointerCapture?.(drag.pointerId)
        } catch {
          // capture may already be released
        }
      }

      resetDrag()

      if (!wasHorizontal) return
      const width = panelWidthRef.current
      if (!width) return
      const snapped = Math.round(offsetRef.current / width) * width
      setOffset(snapped)
    }

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', onPointerUp)
    viewport.addEventListener('pointercancel', onPointerUp)
    viewport.addEventListener('lostpointercapture', onPointerUp)
    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', onPointerUp)
      viewport.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('lostpointercapture', onPointerUp)
    }
  }, [])

  const scrollToSection = (id) => {
    const index = SECTIONS.findIndex((section) => section.id === id)
    if (index < 0) return

    if (window.innerWidth <= EXPLORE_MOBILE_MAX) {
      setActiveSection(id)
      document.getElementById(`explore-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const width = panelWidthRef.current
    if (!width) return
    navIntentRef.current = id
    // Keep two panels in view; last section sits on the right, not past the rail.
    setOffset(Math.min(index * width, getMaxOffset(width)))
    setActiveSection(id)
  }

  const handleImageClick = (image) => {
    const index = projects.findIndex((img) => img.src === image.src)
    setLightboxImage(image)
    setLightboxImageIndex(index)
  }

  const handleNextImage = () => {
    if (lightboxImageIndex !== null && lightboxImageIndex < projects.length - 1) {
      const nextIndex = lightboxImageIndex + 1
      setLightboxImage(projects[nextIndex])
      setLightboxImageIndex(nextIndex)
    }
  }

  const handlePreviousImage = () => {
    if (lightboxImageIndex !== null && lightboxImageIndex > 0) {
      const prevIndex = lightboxImageIndex - 1
      setLightboxImage(projects[prevIndex])
      setLightboxImageIndex(prevIndex)
    }
  }

  return (
    <div className="explore-page">
      <aside className="explore-nav">
        <div className="explore-nav-top">
          <div className="explore-nav-brand-row">
            <div className="explore-nav-brand-text">
              <Link to="/" className="explore-brand">
                Alice M Cook
              </Link>
              <p className="explore-brand-sub">Product designer</p>
            </div>
            <div className="explore-nav-mobile-actions">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              <Link to="/" className="explore-back-link">
                Back to site
              </Link>
            </div>
          </div>

          <div className="explore-nav-about">
            <p className="explore-nav-about-lead">
              I work alongside engineers and product teams to turn concepts into effective products through research, designing and prototyping.
            </p>
            <ul className="explore-nav-about-bullets">
              <li>Designed and launched four 0 → 1 products in 2025 and 2026</li>
              <li>Built consumer financial products used by millions</li>
              <li>Specialized in accessibility, UX content, generative design, and product strategy</li>
            </ul>
            <p className="explore-nav-about-body">
              Growing up between Japan and Queens, NY shaped my culture and community.
            </p>
          </div>
        </div>

        <nav className="explore-nav-links" aria-label="Explore sections">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`explore-nav-link ${activeSection === id ? 'is-active' : ''}`}
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          ))}
          <a
            href="https://www.linkedin.com/in/alicemiocook/"
            target="_blank"
            rel="noopener noreferrer"
            className="explore-nav-linkedin"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </nav>

        <div className="explore-nav-bottom">
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Link to="/" className="explore-back-link">
            Back to site
          </Link>
        </div>
      </aside>

      <div className="explore-viewport" ref={viewportRef}>
        <div
          className="explore-rail"
          ref={railRef}
          style={{ transform: `translate3d(-${offsetX}px, 0, 0)` }}
        >
          <section
            id="explore-work"
            className="explore-panel"
            style={panelWidth ? { width: panelWidth } : undefined}
          >
            <div className="explore-panel-body is-vert-scroll">
              <p className="explore-kicker">Projects</p>
              <p className="explore-lead">Selected projects across fintech, research tools, and design systems.</p>

              <div className="explore-work-featured">
                {featuredProjects.map((image) => (
                  <article key={image.src} className="explore-work-feature">
                    <Link
                      to={`/work/${image.slug}`}
                      className="explore-work-media"
                      aria-label={`View ${image.defaultText} case study`}
                    >
                      <img src={image.src} alt={image.alt || image.defaultText} loading="lazy" />
                    </Link>
                    <div className="explore-work-copy">
                      <h3>
                        <Link to={`/work/${image.slug}`}>{image.defaultText}</Link>
                      </h3>
                      {image.tags?.length > 0 && (
                        <div className="explore-tags">
                          {image.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                      {getWorkSummary(image.description) && (
                        <p>{getWorkSummary(image.description)}</p>
                      )}
                      <Link to={`/work/${image.slug}`} className="explore-text-link">
                        View details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className="explore-work-grid">
                {gridProjects.map((image) => (
                  <article key={image.src} className="explore-work-card">
                    <button
                      type="button"
                      className="explore-work-media"
                      onClick={() => handleImageClick(image)}
                      aria-label={`View ${image.defaultText} details`}
                    >
                      <img src={image.src} alt={image.alt || image.defaultText} loading="lazy" />
                    </button>
                    <h4>
                      <button type="button" onClick={() => handleImageClick(image)}>
                        {image.defaultText}
                      </button>
                    </h4>
                    {image.tags?.length > 0 && (
                      <div className="explore-tags">
                        {image.tags.slice(0, 2).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="explore-expertise"
            className="explore-panel"
            style={panelWidth ? { width: panelWidth } : undefined}
          >
            <div className="explore-panel-body">
              <p className="explore-kicker">Expertise</p>
              <p className="explore-lead">
                I navigate complexity, balance diverse stakeholder perspectives, and innovate within real-world constraints.
              </p>

              <div className="explore-expertise-tabs">
                {['Strategy', 'Design', 'Build'].map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    className={`explore-expertise-tab ${activeExpertiseTab === index ? 'is-active' : ''}`}
                    onClick={() => setActiveExpertiseTab(index)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="explore-chart-wrap">
                {activeExpertiseTab === 0 && (
                  <RadarChartComponent
                    compactLabels
                    data={[
                      { name: 'User Research', value: 20 },
                      { name: 'Landscape Research', value: 18 },
                      { name: 'CX Strategy', value: 18 },
                      { name: 'User Journeys', value: 18 },
                      { name: 'Product Strategy', value: 16 },
                      { name: 'Technical Planning', value: 10 },
                    ]}
                    colors={COLORS}
                    categoryIndex={0}
                  />
                )}
                {activeExpertiseTab === 1 && (
                  <RadarChartComponent
                    compactLabels
                    data={[
                      { name: 'IA & Interaction Design', value: 20 },
                      { name: 'Usability Testing', value: 18 },
                      { name: 'Content Design', value: 16 },
                      { name: 'Design Systems', value: 18 },
                      { name: 'Accessibility', value: 18 },
                      { name: 'Branding', value: 14 },
                    ]}
                    colors={COLORS}
                    categoryIndex={1}
                  />
                )}
                {activeExpertiseTab === 2 && (
                  <RadarChartComponent
                    compactLabels
                    data={[
                      { name: 'Mobile & Web Design', value: 20 },
                      { name: 'Feature Scoping', value: 18 },
                      { name: 'Rapid & Low-Code Prototyping', value: 18 },
                      { name: 'Quality Assurance Testing', value: 16 },
                      { name: 'Data & Analytics', value: 16 },
                      { name: 'Lifecycle Strategy', value: 12 },
                    ]}
                    colors={COLORS}
                    categoryIndex={2}
                  />
                )}
              </div>
            </div>
          </section>

          <section
            id="explore-resume"
            className="explore-panel"
            style={panelWidth ? { width: panelWidth } : undefined}
          >
            <div className="explore-panel-body is-vert-scroll">
              <p className="explore-kicker">Resume</p>
              <p className="explore-lead">
                Product designer focused on accessible, intelligent tools across fintech, research, and workflow products.
              </p>

              <div className="explore-resume-block">
                <h3>Experience highlights</h3>
                <ul className="explore-bullets">
                  <li>Designed consumer financial products used by millions</li>
                  <li>Led design systems and multi-product brand consistency</li>
                  <li>Shipped 0 → 1 products with research-led discovery</li>
                </ul>
              </div>

              <div className="explore-org-logos">
                <img
                  src="/imgs/OrgLockup.svg"
                  alt="Organizations I've worked with"
                  className="org-lockup org-lockup-desktop"
                />
                <img
                  src="/imgs/orglockupmobile.svg"
                  alt="Organizations I've worked with"
                  className="org-lockup org-lockup-mobile"
                />
              </div>

              <div className="explore-domains">
                <h3 className="explore-domains-title">Domains</h3>
                <div className="explore-domains-list">
                  <span>Financial Services</span>
                  <span className="explore-domain-separator" aria-hidden="true">•</span>
                  <span>Philanthropy & Non-Profit</span>
                  <span className="explore-domain-separator" aria-hidden="true">•</span>
                  <span>Education & Research</span>
                  <span className="explore-domain-separator" aria-hidden="true">•</span>
                  <span>Workflow & Productivity</span>
                  <span className="explore-domain-separator" aria-hidden="true">•</span>
                  <span>Health Tech</span>
                  <span className="explore-domain-separator" aria-hidden="true">•</span>
                  <span>Founding Designer</span>
                </div>
              </div>

              <div className="explore-resume-actions">
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="explore-primary-button"
                >
                  View full resume
                </a>
                <a href="mailto:alicemioed@gmail.com" className="explore-text-link">
                  Contact
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Lightbox
        isOpen={lightboxImage !== null}
        onClose={() => {
          setLightboxImage(null)
          setLightboxImageIndex(null)
        }}
        image={lightboxImage}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
        hasNext={lightboxImageIndex !== null && lightboxImageIndex < projects.length - 1}
        hasPrevious={lightboxImageIndex !== null && lightboxImageIndex > 0}
      />
    </div>
  )
}

export default ExplorePage
