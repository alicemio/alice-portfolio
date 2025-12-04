import React, { useEffect, useState, useRef } from 'react'
import DarkModeToggle from './components/DarkModeToggle'
import Carousel from './components/Carousel'
import Lightbox from './components/Lightbox'
import GradientText from './components/GradientText'
import RadarChartComponent from './components/RadarChart'
import './App.css'

function App() {
  // Read dark mode preference from localStorage, default to true (dark mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(null)
  
  const carouselImages = [
    { src: '/imgs/CultivariumScroll.png', alt: 'Cultivarium Scroll', tags: ['AI Tools', 'Scientific Tools'], description: 'AI-powered research tool to improve scientific protocol reproducibility.', defaultText: 'Augmented Scientific Protocols', video: '/imgs/EditingScreen.mp4', caseStudyLink: 'https://www.figma.com/deck/q54aPMelNBjtognApVQemv/AliceCook_2025Fulldeck_Public?node-id=32-625&viewport=-1723%2C62%2C0.4&t=2MsOR9EEvAWoj7Bx-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1' },
    { src: '/imgs/ChasePayScroll.png', alt: 'ChasePay Scroll', tags: ['Fintech', 'Mobile App', 'E Commerce'], description: "Chase's first digital wallet enabling seamless transactions for millions of users.", defaultText: 'Pay with Points on Chase Pay', caseStudyLink: 'https://www.figma.com/deck/q54aPMelNBjtognApVQemv/AliceCook_2025Fulldeck_Public?node-id=118-934&viewport=-853%2C-470%2C0.4&t=aLy4TwMVv1SwTQ26-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1' },
    { src: '/imgs/PointToPictureScroll.png', alt: 'PointToPicture Scroll', tags: ['AAC App', 'Ed Tech'], description: 'A mobile app that empowers behavioral technicians to communicate more clearly and compassionately with autistic and nonverbal children.', defaultText: 'Customizable AAC App' },
    { src: '/imgs/WeChatScroll.png', alt: 'WeChat Scroll', tags: ['AI Tools', 'Political Tech', 'Chat Bot'], description: 'An intelligent training chatbot that equips new volunteers with the skills and confidence to canvass and engage voters effectively.', defaultText: 'Chat Bot for Canvassers' },
    { src: '/imgs/FastPayScroll.png', alt: 'FastPay Scroll', tags: ['Fintech', 'Accessibility'], description: 'Problem\nAn internal accessibility audit revealed that the credit card payment flow, used by 80 percent of Chase\'s digital customers and visited as part of more than 200 million monthly site sessions, did not meet WCAG standards. Screen-reader users lacked orientation, keyboard navigation was inconsistent, and key payment information and actions were difficult to access.\n\nOutcomes\n• Launched a WCAG-compliant payment experience used by 35 million digital customers\n• Improved clarity and navigation for screen-reader and keyboard-only users\n• Reduced interaction friction by restructuring page hierarchy and standardizing controls\n• Usability testing confirmed the updated flow felt faster and easier to complete', defaultText: 'Accessibile Payments on Chase.com', liveWebsiteLink: 'https://www.chase.com/' },
    { src: '/imgs/NulabScroll.png', alt: 'Nulab Scroll', tags: ['Design Systems', 'SEO Optimization'], description: 'Comprehensive design system and SEO improvements for better user experience.', defaultText: 'Design System and Domain Merge' },
    { src: '/imgs/MachineScroll.png', alt: 'Machine Scroll', tags: ['AI Tools', 'Digital Asset Management'], description: 'AI-driven platform for organizing and managing digital assets efficiently.', defaultText: 'Asset Finder for Content Creators' },
    { src: '/imgs/CacooScroll.png', alt: 'Cacoo Scroll', tags: ['Workflow Tools', 'Design Systems'], description: 'Collaborative workflow tools with a cohesive design system.', defaultText: 'Online Diagramming Tool' },
    { src: '/imgs/TekaloScroll.png', alt: 'Tekalo Scroll', tags: ['Branding', 'Social Impact'], description: 'Brand identity and digital presence for matching tech talent with social impact organizations.', defaultText: 'Matching Tech Workers with Impact Opportunities', liveWebsiteLink: 'https://www.tekalo.org/' }
  ]

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
  const tabRefs = useRef([])
  const indicatorRef = useRef(null)

  // Color palette matching hero gradient: #3b82f6 (blue), #a855f7 (purple), #ec4899 (pink)
  const COLORS = ['#3b82f6', '#a855f7', '#ec4899', '#3b82f6', '#a855f7', '#ec4899']


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
    // Alice hover control - show image on hover
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

      highlightText.addEventListener('mouseenter', handleMouseEnter);
      highlightText.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        highlightText.removeEventListener('mouseenter', handleMouseEnter);
        highlightText.removeEventListener('mouseleave', handleMouseLeave);
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
                     <ul className="nav-menu">
                       <li><a href="#about" className="nav-link">About</a></li>
                       <li><a href="#expertise" className="nav-link">Expertise</a></li>
                       <li><a href="#work" className="nav-link">Work</a></li>
                     </ul>
            <div className="nav-controls">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              <div className="hamburger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </div>
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
                    <a href="#work" className="hero-link">
                      <span className="hero-emoji hero-emoji-sparkle">✨</span> Recent Work
                    </a>
                    <a href="/AliceMCook_Resume_2025.pdf" target="_blank" rel="noopener noreferrer" className="hero-link">
                      <span className="hero-emoji hero-emoji-resume">📄</span> Resume
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
              Growing up between Japan and Queens, NY shaped my culture and community. When I'm not designing, I like to read, cook, practice yoga, <span className="about-highlight about-volunteer-hover"><a href="https://readingpartners.org/volunteer-online-with-reading-partners/?utm_source=google&utm_medium=cpc&gad_source=1&gad_campaignid=22658655503&gbraid=0AAAAADsbqKRX-hjcSR4Z-fYuyydYuDEk0&gclid=Cj0KCQjwgpzIBhCOARIsABZm7vHV0EzX2axFqrzRUwjk5T9qac2z09TGlU1JTiu6yhhNVDLPkEI9tVkaAss8EALw_wcB" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>volunteer</a></span>, and foster <span className="about-highlight about-rescue-hover">
                <a href="https://www.petfinder.com/cat/alley-76510671/ny/brooklyn/bookstore-cats-ny1708/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>rescue animals</a>
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
            <p className="expertise-description">Crafting human-focused products that are intuitive, effective, and efficient at scale.</p>
            
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

            <div className="expertise-chart-container">
              {activeExpertiseTab === 0 && (
                <div className="expertise-chart">
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
                <div className="expertise-chart">
                  <RadarChartComponent
                    data={[
                      { name: 'IA & Interaction Design', value: 20 },
                      { name: 'Usability Testing', value: 18 },
                      { name: 'Content Design', value: 16 },
                      { name: 'Design Systems', value: 16 },
                      { name: 'Accessibility', value: 14 },
                      { name: 'Branding', value: 10 },
                    ]}
                    colors={COLORS}
                    categoryIndex={1}
                  />
                </div>
              )}

              {activeExpertiseTab === 2 && (
                <div className="expertise-chart">
                  <RadarChartComponent
                    data={[
                      { name: 'Mobile & Web Design', value: 20 },
                      { name: 'Feature Scoping', value: 18 },
                      { name: 'Rapid & Low-Code Prototyping', value: 18 },
                      { name: 'Quality Assurance Testing', value: 16 },
                      { name: 'Data & Analytics', value: 12 },
                      { name: 'Growth Strategy', value: 12 },
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
            <p className="work-description">I navigate complexity, balance diverse stakeholder perspectives, and innovate within real-world constraints</p>
          </div>
          <div className="carousel-wrapper">
            {/* IMPORTANT: Each image should have a defaultText property for the label overlay.
                This is a critical feature - see IMPORTANT_FEATURES.md for details. */}
            <Carousel 
              height={332} 
              images={carouselImages}
              numPlaceholders={4}
              onImageClick={handleImageClick}
            />
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
              <p>&copy; 2025 <a href="#home" className="footer-name-link" onClick={scrollToTop}>Alice Mio Cook</a></p>
            </div>
            <div className="footer-links">
              <a href="/AliceMCook_Resume_2025.pdf" target="_blank" rel="noopener noreferrer" className="footer-link">Resume</a>
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
