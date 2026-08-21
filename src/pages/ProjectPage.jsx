import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DarkModeToggle from '../components/DarkModeToggle'
import { getProjectBySlug } from '../data/projects'
import '../App.css'

function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = getProjectBySlug(slug)

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? saved === 'true' : true
  })

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
  }

  const handleBack = (e) => {
    e.preventDefault()
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
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
    document.title = project
      ? `${project.defaultText} — Alice Cook`
      : 'Project not found — Alice Cook'

    const siteWrapper = document.querySelector('.site-wrapper')
    if (siteWrapper) {
      siteWrapper.scrollTo({ top: 0 })
    } else {
      window.scrollTo({ top: 0 })
    }

    return () => {
      document.title = 'Alice - Portfolio'
    }
  }, [project])

  const mediaIsVideo = Boolean(
    project?.video || (project?.src && /\.(mp4|webm|ogg|gif)$/i.test(project.src))
  )
  const mediaIsGif = Boolean(project?.src && /\.gif$/i.test(project.src))

  if (!project) {
    return (
      <div className="App">
        <div className="site-wrapper project-page">
          <nav className="navbar">
            <div className="nav-container">
              <div className="nav-logo">
                <Link to="/" className="project-page-logo-link">
                  <img src="/imgs/greylogo.png" alt="Alice" className="logo-image" />
                </Link>
              </div>
              <div className="nav-controls">
                <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </div>
            </div>
          </nav>
          <main className="project-page-main">
            <h1 className="project-page-title">Project not found</h1>
            <p className="project-page-description">This case study doesn’t exist yet.</p>
            <a href="/" className="project-page-back" onClick={handleBack}>← Back to portfolio</a>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <div className="site-wrapper project-page">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <Link to="/" className="project-page-logo-link">
                <img src="/imgs/greylogo.png" alt="Alice" className="logo-image" />
              </Link>
            </div>
            <div className="nav-controls">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </div>
          </div>
        </nav>

        <main className="project-page-main">
          <div className="project-page-media">
            {mediaIsVideo && !mediaIsGif ? (
              <video
                src={project.video || project.src}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="project-page-media-asset"
              />
            ) : (
              <img
                src={project.src}
                alt={project.alt || project.defaultText}
                className="project-page-media-asset"
              />
            )}
          </div>

          <div className="project-page-content">
            <div className="project-page-header">
              <h1 className="project-page-title">{project.defaultText}</h1>
              <div className="project-page-links">
                {project.liveWebsiteLink && (
                  <a
                    href={project.liveWebsiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lightbox-live-website-link"
                  >
                    Live Website
                  </a>
                )}
                {project.caseStudyLink && (
                  <a
                    href={project.caseStudyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lightbox-case-study-link"
                  >
                    {project.caseStudyLabel || 'View Case Study'}
                  </a>
                )}
              </div>
            </div>

            {project.tags?.length > 0 && (
              <div className="project-page-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="work-feature-tag">{tag}</span>
                ))}
              </div>
            )}

            {project.description && (
              <p className="project-page-description">{project.description}</p>
            )}

            <a href="/" className="project-page-back" onClick={handleBack}>← Back to portfolio</a>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProjectPage
