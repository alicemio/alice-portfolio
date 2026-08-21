import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import DarkModeToggle from './components/DarkModeToggle'
import Lightbox from './components/Lightbox'
import GradientText from './components/GradientText'
import RadarChartComponent from './components/RadarChart'
import { projects, featuredProjects, gridProjects } from './data/projects'
import './App.css'

function App() {
  // Read dark mode preference from localStorage, default to true (dark mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(null)

  const carouselImages = projects
  const featuredWork = featuredProjects
  const gridWork = gridProjects

  const getWorkSummary = (description) => {
    if (!description) return ''
    const lines = description
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
    const first = lines.find(line => !/^(problem|outcomes)$/i.test(line))
    return first || lines[0] || ''
  }

  const handleImageClick = (image) => {
    const index = carouselImages.findIndex(img => img.src === image.src)
    setLightboxImage(image)
    setLightboxImageIndex(index)
  }

  const handleNextImage = () => {
    if (lightboxImageIndex !== null && lightboxImageIndex < carouselImages.length - 1) {
      const nextIndex = lightboxImageIndex + 1
      setLightboxImage(carouselImages[nextIndex])
      setLightboxImageIndex(nextIndex)
    }
  }

  const handlePreviousImage = () => {
    if (lightboxImageIndex !== null && lightboxImageIndex > 0) {
      const prevIndex = lightboxImageIndex - 1
      setLightboxImage(carouselImages[prevIndex])
      setLightboxImageIndex(prevIndex)
    }
  }
  const [activeExpertiseTab, setActiveExpertiseTab] = useState(0)
  const [isExpertiseInView, setIsExpertiseInView] = useState(false)
  const tabRefs = useRef([])
  const indicatorRef = useRef(null)
  const expertiseChartRef = useRef(null)

  // Color palette matching hero gradient: #3b82f6 (blue), #a855f7 (purple), #ec4899 (pink)
  const COLORS = ['#3b82f6', '#a855f7', '#ec4899', '#3b82f6', '#a855f7', '#ec4899']

  const resumeUrl = '/AliceMCook_Resume_2026.pdf'

  const closeNav = () => setIsNavOpen(false)

  const toggleNav = () => setIsNavOpen((open) => !open)

  const handleNavLinkClick = () => {
    closeNav()
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  }

  const scrollToTop = (e) => {
    e.preventDefault();
    const siteWrapper = document.querySelector('.site-wrapper');
    if (siteWrapper) {
      siteWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }


  useEffect(() => {
    // Apply dark mode class to html and body
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Alice hover control - show image on hover (desktop) and click (mobile)
    const highlightText = document.querySelector('.highlight');
    const heroImage = document.querySelector('.hero-image');
    
    if (highlightText && heroImage) {
      const handleMouseEnter = () => {
        // Show Alice image
        heroImage.style.setProperty('--bg-image', "url('/imgs/alice-photo.png')");
        heroImage.classList.add('show-image');
      };
      
      const handleMouseLeave = () => {
        heroImage.classList.remove('show-image');
      };

      // Click handler for mobile devices
      const handleClick = (e) => {
        // Check if it's a touch device or mobile
        const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
        
        if (isMobile) {
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle image visibility
          if (heroImage.classList.contains('show-image')) {
            heroImage.classList.remove('show-image');
          } else {
            heroImage.style.setProperty('--bg-image', "url('/imgs/alice-photo.png')");
            heroImage.classList.add('show-image');
          }
        }
      };

      highlightText.addEventListener('mouseenter', handleMouseEnter);
      highlightText.addEventListener('mouseleave', handleMouseLeave);
      highlightText.addEventListener('click', handleClick);

      return () => {
        highlightText.removeEventListener('mouseenter', handleMouseEnter);
        highlightText.removeEventListener('mouseleave', handleMouseLeave);
        highlightText.removeEventListener('click', handleClick);
      }
    }
  }, []); // Run once on mount

  useEffect(() => {
    // Handle scroll effect for navbar
    const scrollTimeoutRef = { current: null };
    
    const handleScroll = () => {
      const siteWrapper = document.querySelector('.site-wrapper');
      if (siteWrapper) {
        const scrollTop = siteWrapper.scrollTop;
        // Show background while scrolling
        if (scrollTop > 50) {
          setIsScrolled(true);
          setHasScrolled(true);
        } else {
          setIsScrolled(false);
          setHasScrolled(false);
        }
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Set new timeout to change to stopped state when scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolled(false);
        }, 150); // Wait 150ms after scrolling stops
      }
    };

    const siteWrapper = document.querySelector('.site-wrapper');
    if (siteWrapper) {
      siteWrapper.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        siteWrapper.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    // Update indicator position when active tab changes
    const updateIndicator = () => {
      try {
        if (indicatorRef.current && tabRefs.current && tabRefs.current[activeExpertiseTab]) {
          const activeTab = tabRefs.current[activeExpertiseTab]
          if (activeTab && indicatorRef.current) {
            const tabLeft = activeTab.offsetLeft
            const tabWidth = activeTab.offsetWidth
            indicatorRef.current.style.width = `${tabWidth}px`
            indicatorRef.current.style.transform = `translateX(${tabLeft}px)`
          }
        }
      } catch (error) {
        console.error('Error updating tab indicator:', error)
      }
    }
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateIndicator, 10)
    
    // Also update on window resize
    window.addEventListener('resize', updateIndicator)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeExpertiseTab]);

  useEffect(() => {
    // Trigger expertise chart animation when section enters viewport
    const target = expertiseChartRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsExpertiseInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.6, rootMargin: '0px 0px -25% 0px' }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="App">
      {/* Site wrapper with border */}
      <div className="site-wrapper">
        {/* Navigation */}
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${hasScrolled && !isScrolled ? 'scrolled-stopped' : ''}`}>
          <div className="nav-container">
        <div className="nav-logo">
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'block' }}>
            <img src="/imgs/greylogo.png" alt="Alice" className="logo-image" />
          </a>
        </div>
                     <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
                       <li><a href="#about" className="nav-link" onClick={handleNavLinkClick}>About</a></li>
                       <li><a href="#expertise" className="nav-link" onClick={handleNavLinkClick}>Expertise</a></li>
                       <li><a href="#work" className="nav-link" onClick={handleNavLinkClick}>Work</a></li>
                       <li><a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="nav-link" onClick={handleNavLinkClick}>Resume</a></li>
                       <li>
                         <a
                           href="https://www.linkedin.com/in/alicemiocook/"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="nav-link nav-social-link"
                           aria-label="LinkedIn"
                           onClick={handleNavLinkClick}
                         >
                           <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                             <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                           </svg>
                         </a>
                       </li>
                     </ul>
            <div className="nav-controls">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              <button
                type="button"
                className={`hamburger ${isNavOpen ? 'active' : ''}`}
                onClick={toggleNav}
                aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isNavOpen}
              >
                {isNavOpen ? (
                  <X size={24} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Menu size={24} strokeWidth={1.75} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <section id="home" className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                <div className="hero-image">
                  {/* Profile image will appear here on hover over "Alice Cook" */}
                </div>
                <span className="highlight">Alice Cook</span>, product designer building <em><GradientText text="empowering, intelligent tools" className="italic" gradient="linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)" /></em>
              </h1>
                  <p className="hero-description">
                    Based in New York
                  </p>
                  <div className="hero-links">
                    <a href="#about" className="hero-link">
                      <span className="hero-emoji hero-emoji-wave">👋</span> About
                    </a>
                    <a href="#work" className="hero-link work-case-studies-button">
                      <span className="hero-emoji hero-emoji-sparkle">🗂️</span> Recent Work
                    </a>
                  </div>
                </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="about">
          <div className="about-container">
            <h2 className="about-title">About</h2>
            <p className="about-description">
              I work alongside engineers and product teams to turn concepts into effective products through research, designing and prototyping.
            </p>
            <ul className="about-bullets">
              <li>Designed and launched three 0 → 1 products in 2025</li>
              <li>Built consumer financial products used by millions</li>
              <li>Specialized in accessibility, UX content, generative design, and product strategy</li>
            </ul>
            <p className="about-description about-personal">
              Growing up between Japan and Queens, NY shaped my culture and community. When I'm not designing, I like to read, cook, practice yoga, <span className="about-highlight about-volunteer-hover"><a href="https://readingpartners.org/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>volunteer</a></span>, and foster <span className="about-highlight about-rescue-hover">
                <a href="https://www.petfinder.com/cat/alley-7cf488b1-3312-43cb-8ba1-9a3b012719c7/ct/hartford/bookstore-cats-ny1708/details/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>rescue animals</a>
                <span className="rescue-preview-card">
                  <img src="/imgs/Alley.png" alt="Alley the cat" className="rescue-preview-image" onError={(e) => { e.target.style.display = 'none'; }} />
                </span>
              </span>.
            </p>
            <div className="about-org-logos">
              <img src="/imgs/OrgLockup.svg" alt="Organizations I've worked with" className="org-lockup org-lockup-desktop" />
              <img src="/imgs/orglockupmobile.svg" alt="Organizations I've worked with" className="org-lockup org-lockup-mobile" />
            </div>
          </div>
        </section>
        
        {/* Expertise Section */}
        <section id="expertise" className="expertise-section">
          <div className="expertise-container">
            <h2 className="expertise-title">Expertise</h2>
            <p className="expertise-description">I navigate complexity, balance diverse stakeholder perspectives, and innovate within real-world constraints.</p>
            
            <div className="expertise-tabs">
              <button 
                ref={(el) => { tabRefs.current[0] = el }}
                className={`expertise-tab ${activeExpertiseTab === 0 ? 'active' : ''}`}
                onClick={() => setActiveExpertiseTab(0)}
              >
                Strategy
              </button>
              <button 
                ref={(el) => { tabRefs.current[1] = el }}
                className={`expertise-tab ${activeExpertiseTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveExpertiseTab(1)}
              >
                Design
              </button>
              <button 
                ref={(el) => { tabRefs.current[2] = el }}
                className={`expertise-tab ${activeExpertiseTab === 2 ? 'active' : ''}`}
                onClick={() => setActiveExpertiseTab(2)}
              >
                Build
              </button>
              <div ref={indicatorRef} className="expertise-tab-indicator"></div>
            </div>

            <div className="expertise-chart-container" ref={expertiseChartRef}>
              {activeExpertiseTab === 0 && (
                <div className={`expertise-chart ${isExpertiseInView ? 'is-visible' : ''}`}>
                  <RadarChartComponent
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
                </div>
              )}

              {activeExpertiseTab === 1 && (
                <div className={`expertise-chart ${isExpertiseInView ? 'is-visible' : ''}`}>
                  <RadarChartComponent
                    data={[
                      { name: 'IA & Interaction Design', value: 20 },
                      { name: 'Usability Testing', value: 18 },
                      { name: 'Content Design', value: 16 },
                      { name: 'Design Systems', value: 16 },
                      { name: 'Accessibility', value: 14 },
                      { name: 'Branding', value: 14 },
                    ]}
                    colors={COLORS}
                    categoryIndex={1}
                  />
                </div>
              )}

              {activeExpertiseTab === 2 && (
                <div className={`expertise-chart ${isExpertiseInView ? 'is-visible' : ''}`}>
                  <RadarChartComponent
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
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className="work-section">
          <div className="work-container">
            <h2 className="work-title">Recent Work</h2>
          </div>
          <div className="work-featured">
            {featuredWork.map((image) => (
              <div key={image.src} className="work-feature-card">
                <Link
                  to={`/work/${image.slug}`}
                  className="work-feature-media"
                  aria-label={`View ${image.defaultText} case study`}
                >
                  <img
                    src={image.src}
                    alt={image.alt || image.defaultText}
                    loading="lazy"
                  />
                </Link>
                <div className="work-feature-content">
                  <h3 className="work-feature-title">{image.defaultText}</h3>
                  {image.tags && image.tags.length > 0 && (
                    <div className="work-feature-tags">
                      {image.tags.map((tag) => (
                        <span key={tag} className="work-feature-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {getWorkSummary(image.description) && (
                    <p className="work-feature-description">{getWorkSummary(image.description)}</p>
                  )}
                  <Link
                    to={`/work/${image.slug}`}
                    className="work-feature-cta nav-link"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="work-grid">
            {gridWork.map((image) => (
              <div key={image.src} className="work-grid-card">
                <button
                  type="button"
                  className="work-grid-media"
                  onClick={() => handleImageClick(image)}
                  aria-label={`View ${image.defaultText} details`}
                >
                  <img
                    src={image.src}
                    alt={image.alt || image.defaultText}
                    loading="lazy"
                  />
                </button>
                <div className="work-grid-content">
                  <h4 className="work-grid-title">{image.defaultText}</h4>
                  {image.tags && image.tags.length > 0 && (
                    <div className="work-grid-tags">
                      {image.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="work-grid-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="work-button-container">
            <a href="https://www.figma.com/deck/q54aPMelNBjtognApVQemv/AliceCook_2025Fulldeck_Public?node-id=28-272&viewport=-853%2C62%2C0.4&t=s2IPUPPYmeGp0Hxs-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1" target="_blank" rel="noopener noreferrer" className="work-case-studies-button">
              <span>📁</span>
              Full Case Studies
            </a>
          </div>
        </section>

        {/* Industries Section */}
        <section className="expertise-section">
          <div className="expertise-container">
            <div className="expertise-industries">
              <h3 className="expertise-industries-title">Domains</h3>
              <div className="industries-list">
                <span className="industry-item">Financial Services</span>
                <span className="industry-separator">•</span>
                <span className="industry-item">Philanthropy & Non-Profit</span>
                <span className="industry-separator">•</span>
                <span className="industry-item">Education & Research</span>
                <span className="industry-separator">•</span>
                <span className="industry-item">Workflow & Productivity</span>
                <span className="industry-separator">•</span>
                <span className="industry-item">Health Tech</span>
                <span className="industry-separator">•</span>
                <span className="industry-item">Founding Designer</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-copyright">
              <p>&copy; 2026 <a href="#home" className="footer-name-link" onClick={scrollToTop}>Alice Mio Cook</a></p>
            </div>
            <div className="footer-links">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="footer-link">Resume</a>
              <a href="https://www.linkedin.com/in/alicemiocook/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
              <a href="mailto:alicemioed@gmail.com" className="footer-link">Contact</a>
            </div>
          </div>
        </footer>
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
        hasNext={lightboxImageIndex !== null && lightboxImageIndex < carouselImages.length - 1}
        hasPrevious={lightboxImageIndex !== null && lightboxImageIndex > 0}
      />
    </div>
  )
}

export default App
