import React from 'react';

const Portfolio = ({ onBack }) => {
  return (
    <div className="portfolio-page">
      <div className="portfolio-container">
        <h2 className="portfolio-subtitle">Recent work</h2>
        
        <div className="portfolio-grid">
          <div className="portfolio-item">
            <div className="portfolio-image">
              <div className="placeholder-image">Project 1</div>
            </div>
            <div className="portfolio-content">
              <h3>E-commerce Platform</h3>
              <p>A comprehensive e-commerce solution designed for small businesses, featuring intuitive user experience and modern design principles.</p>
              <div className="portfolio-tags">
                <span className="tag">UI/UX</span>
                <span className="tag">Web Design</span>
              </div>
            </div>
          </div>
          
          <div className="portfolio-item">
            <div className="portfolio-image">
              <div className="placeholder-image">Project 2</div>
            </div>
            <div className="portfolio-content">
              <h3>Mobile Banking App</h3>
              <p>Redesigned mobile banking experience focusing on security, accessibility, and user-friendly interface for financial transactions.</p>
              <div className="portfolio-tags">
                <span className="tag">Mobile App</span>
                <span className="tag">Product Design</span>
              </div>
            </div>
          </div>
          
          <div className="portfolio-item">
            <div className="portfolio-image">
              <div className="placeholder-image">Project 3</div>
            </div>
            <div className="portfolio-content">
              <h3>Brand Identity System</h3>
              <p>Complete brand identity design including logo, color palette, typography, and brand guidelines for a tech startup.</p>
              <div className="portfolio-tags">
                <span className="tag">Branding</span>
                <span className="tag">Visual Design</span>
              </div>
            </div>
          </div>
          
          <div className="portfolio-item">
            <div className="portfolio-image">
              <div className="placeholder-image">Project 4</div>
            </div>
            <div className="portfolio-content">
              <h3>Dashboard Interface</h3>
              <p>Data visualization dashboard for analytics platform with interactive charts and real-time data updates.</p>
              <div className="portfolio-tags">
                <span className="tag">Data Viz</span>
                <span className="tag">Dashboard</span>
              </div>
            </div>
          </div>
          
          <div className="portfolio-item">
            <div className="portfolio-image">
              <div className="placeholder-image">Project 5</div>
            </div>
            <div className="portfolio-content">
              <h3>Healthcare App</h3>
              <p>Patient management system with appointment scheduling, medical records, and telemedicine features.</p>
              <div className="portfolio-tags">
                <span className="tag">Healthcare</span>
                <span className="tag">Mobile App</span>
              </div>
            </div>
          </div>
          
          <div className="portfolio-item">
            <div className="portfolio-image">
              <div className="placeholder-image">Project 6</div>
            </div>
            <div className="portfolio-content">
              <h3>Restaurant Website</h3>
              <p>Modern restaurant website with online ordering, menu display, and reservation system integration.</p>
              <div className="portfolio-tags">
                <span className="tag">Web Design</span>
                <span className="tag">E-commerce</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="portfolio-cta">
          <a href="#contact" className="btn btn-primary">Get In Touch</a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
