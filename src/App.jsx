import React, { useEffect, useState, useRef } from 'react'
import DarkModeToggle from './components/DarkModeToggle'
import Carousel from './components/Carousel'
import { Folder, Linkedin } from 'lucide-react'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    // Enhanced hover effects for interactive text
    const highlightText = document.querySelector('.highlight');
    const heroImage = document.querySelector('.hero-image');
    const japaneseText = document.querySelector('.japanese-text');
    const siteWrapper = document.querySelector('.site-wrapper');
    
    // Alice hover control - show image on hover
    if (highlightText && heroImage) {
      highlightText.addEventListener('mouseenter', () => {
        // Show Alice image
        heroImage.style.setProperty('--bg-image', "url('/imgs/alice-photo.png')");
        heroImage.classList.add('show-image');
      });
      
      highlightText.addEventListener('mouseleave', () => {
        heroImage.classList.remove('show-image');
      });
    }

    // Japanese text hover control - show text above on hover
    const japaneseHoverText = document.querySelector('.japanese-hover-text');
    if (japaneseText && japaneseHoverText) {
      const onEnter = () => {
        japaneseHoverText.style.visibility = 'visible'
        requestAnimationFrame(() => {
          japaneseHoverText.style.opacity = '1'
        })
      }
      const onLeave = () => {
        japaneseHoverText.style.opacity = '0'
      }

      japaneseText.addEventListener('mouseenter', onEnter)
      japaneseText.addEventListener('mouseleave', onLeave)

      const onTransitionEnd = (e) => {
        if (e.propertyName === 'opacity' && japaneseHoverText.style.opacity === '0') {
          japaneseHoverText.style.visibility = 'hidden'
        }
      }

      japaneseHoverText.addEventListener('transitionend', onTransitionEnd)

      return () => {
        japaneseText.removeEventListener('mouseenter', onEnter)
        japaneseText.removeEventListener('mouseleave', onLeave)
        japaneseHoverText.removeEventListener('transitionend', onTransitionEnd)
      }
    }
  }, []); // Run once on mount

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Handle scroll effect for navbar
    let scrollTimeout;
    
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
        clearTimeout(scrollTimeout);
        
        // Set new timeout to change to stopped state when scrolling stops
        scrollTimeout = setTimeout(() => {
          setIsScrolled(false);
        }, 150); // Wait 150ms after scrolling stops
      }
    };

    const siteWrapper = document.querySelector('.site-wrapper');
    if (siteWrapper) {
      siteWrapper.addEventListener('scroll', handleScroll);
      return () => {
        siteWrapper.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);
  return (
    <div className="App">
      {/* Site wrapper with border */}
      <div className="site-wrapper">
        {/* Navigation */}
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${hasScrolled && !isScrolled ? 'scrolled-stopped' : ''}`}>
          <div className="nav-container">
        <div className="nav-logo">
          <a href="#home" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'block' }}>
            <img src="/imgs/greylogo.png" alt="Alice" className="logo-image" />
          </a>
        </div>
                     <ul className="nav-menu">
                       <li><a href="#about" className="nav-link">About</a></li>
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
                  {/* Profile image will appear here on hover over "Alice" */}
                </div>
                <span className="japanese-text-wrapper">
                  <div className="japanese-hover-text">👋 <em>Hajimemashite</em> is nice to meet you in Japanese</div>
                  <span className="japanese-text">初めまして</span>
                </span>, I'm <span className="highlight">Alice</span>
              </h1>
                  <p className="hero-description">
                    Product Designer based in New York
                  </p>
                  <div className="hero-links">
                    <a href="#about" className="hero-link">
                      👋 About
                    </a>
                    <a href="#work" className="hero-link">
                      🎨 Recent Work
                    </a>
                    <a href="/AliceMCook_Resume_2025.pdf" target="_blank" rel="noopener noreferrer" className="hero-link">
                      💼 Resume
                    </a>
                    <a href="https://www.linkedin.com/in/alicemiocook/" target="_blank" rel="noopener noreferrer" className="hero-link">
                      <Linkedin className="hero-link-icon" />
                      LinkedIn
                    </a>
                  </div>
                </div>
            <div className="japanese-image">
              {/* Japanese image will appear here on hover over "初めまして" */}
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
              Growing up between Japan and Queens, NY shaped my culture and community. When I'm not designing, I like to read, cook, practice yoga, <span className="about-highlight about-volunteer-hover"><a href="https://readingpartners.org/volunteer-online-with-reading-partners/?utm_source=google&utm_medium=cpc&gad_source=1&gad_campaignid=22658655503&gbraid=0AAAAADsbqKRX-hjcSR4Z-fYuyydYuDEk0&gclid=Cj0KCQjwgpzIBhCOARIsABZm7vHV0EzX2axFqrzRUwjk5T9qac2z09TGlU1JTiu6yhhNVDLPkEI9tVkaAss8EALw_wcB" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>volunteer</a></span>, and foster               <span className="about-highlight about-rescue-hover">
                <a href="https://www.petfinder.com/cat/alley-76510671/ny/brooklyn/bookstore-cats-ny1708/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>rescue animals</a>
                <div className="rescue-preview-card">
                  <img src="/imgs/Alley.png" alt="Alley the cat" className="rescue-preview-image" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </span>.
            </p>
            <div className="about-org-logos">
              <img src="/imgs/OrgLockup.svg" alt="Organizations I've worked with" className="org-lockup org-lockup-desktop" />
              <img src="/imgs/orglockupmobile.svg" alt="Organizations I've worked with" className="org-lockup org-lockup-mobile" />
            </div>
          </div>
        </section>
        
        {/* Work Section */}
        <section id="work" className="work-section">
          <div className="work-container">
            <h2 className="work-title">Recent Work</h2>
          </div>
          <div className="carousel-wrapper">
            <Carousel 
              height={332} 
              images={[
                { src: '/imgs/ChasePayScroll.png', alt: 'ChasePay Scroll', tags: ['Fintech', 'Mobile app', 'eCommerce'] },
                { src: '/imgs/CultivariumScroll.png', alt: 'Cultivarium Scroll', tags: ['AI Tools', 'Scientific Tools'] },
                { src: '/imgs/WeChatScroll.png', alt: 'WeChat Scroll', tags: ['AI Tools', 'Civic Tech', 'Chat Bot'] },
                { src: '/imgs/FastPayScroll.png', alt: 'FastPay Scroll', tags: ['Fintech', 'Accessibility'] },
                { src: '/imgs/NulabScroll.png', alt: 'Nulab Scroll', tags: ['Design Systems', 'SEO Optimization'] },
                { src: '/imgs/MachineScroll.png', alt: 'Machine Scroll', tags: ['AI Tools', 'Digital Asset Management'] },
                { src: '/imgs/CacooScroll.png', alt: 'Cacoo Scroll', tags: ['Workflow Tools', 'Design Systems'] },
                { src: '/imgs/TekaloScroll.png', alt: 'Tekalo Scroll', tags: ['Branding', 'Social Impact'] }
              ]}
              numPlaceholders={4}
            />
          </div>
          <div className="work-button-container">
            <a href="https://www.figma.com/deck/q54aPMelNBjtognApVQemv/AliceCook_2025Fulldeck_Public?node-id=2-119&viewport=-105%2C-69%2C0.5&t=huCYJbxPM4LIjzxe-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&hide-ui=1" target="_blank" rel="noopener noreferrer" className="work-case-studies-button">
              <Folder className="folder-icon" />
              Full Case Studies
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
                    <p>&copy; 2025</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
