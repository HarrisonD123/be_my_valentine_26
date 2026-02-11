import React, { useState, useEffect } from 'react';
import './Slideshow.css';
import dogRose from './images/dog_rose.jpg';

// You can add more images here by importing them
const images = [
  dogRose,
  // Add more images here as you import them
  // image2,
  // image3,
];

function Slideshow({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="slideshow-container">
      <button className="slideshow-button back-button" onClick={goToPrevious}>
        ←
      </button>
      <div className="slideshow-image-container">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`}
          className="slideshow-image"
        />
        <div className="slideshow-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      <button className="slideshow-button next-button" onClick={goToNext}>
        →
      </button>
      <button className="back-to-home" onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
}

export default Slideshow;

