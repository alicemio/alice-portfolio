import React, { useEffect, useState } from 'react'
import DarkModeToggle from './components/DarkModeToggle'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    // Enhanced hover effects for interactive text
    const highlightText = document.querySelector('.highlight');
    const japaneseText = document.querySelector('.japanese-text');
    const heroImage = document.querySelector('.hero-image');
    const japaneseHoverImage = document.querySelector('.japanese-hover-image');
    
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

    // Japanese text hover control
    if (japaneseText && japaneseHoverImage) {
      japaneseText.addEventListener('mouseenter', () => {
        japaneseHoverImage.style.visibility = 'visible';
        japaneseHoverImage.style.opacity = '1';
      });
      
      japaneseText.addEventListener('mouseleave', () => {
        japaneseHoverImage.style.opacity = '0';
        setTimeout(() => {
          japaneseHoverImage.style.visibility = 'hidden';
        }, 300); // Wait for transition to complete
      });
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode]);
  return (
    <div className="App">
      {/* Site wrapper with border */}
      <div className="site-wrapper">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
          <div className="nav-logo">
            <a href="#home">
              <img src="/imgs/greylogo.png" alt="Alice" className="logo-image" />
            </a>
          </div>
            <ul className="nav-menu">
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

        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="japanese-text">初めまして</span>, I'm <span className="highlight">Alice</span>
              </h1>
              <div className="japanese-hover-image"></div>
              <h2 className="hero-subtitle">Digital product designer based in New York</h2>
              <p className="hero-description">
                I love designing and building products for people.
              </p>
              <div className="hero-buttons">
                <a href="#" className="btn btn-primary">View My Work</a>
                <a href="#" className="btn btn-secondary">Get In Touch</a>
              </div>
            </div>
            <div className="hero-image">
              {/* Profile image will appear here on hover over "Alice" */}
            </div>
            <div className="japanese-image">
              {/* Japanese image will appear here on hover over "初めまして" */}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 Alice. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
