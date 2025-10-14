import React, { useState } from 'react'

const ImageHover = () => {
  const [showAliceImage, setShowAliceImage] = useState(false)

  return (
    <>
      <div className="hero-image">
        {/* Profile image will appear here on hover over "Alice" */}
      </div>
      <div className="japanese-image">
        {/* Japanese image will appear here on hover over "初めまして" */}
      </div>
    </>
  )
}

export default ImageHover
