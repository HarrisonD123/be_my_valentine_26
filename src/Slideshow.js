import React, { useState, useEffect } from 'react';
import './Slideshow.css';
import heartsBg from './images/hearts_bg.jpg';
import img1 from './images/slideshow_images/1.jpg';
import img2 from './images/slideshow_images/2.jpg';
import img3 from './images/slideshow_images/3.jpg';
import img4 from './images/slideshow_images/4.jpg';
import img5 from './images/slideshow_images/5.jpg';
import img6 from './images/slideshow_images/6.PNG';
import img7 from './images/slideshow_images/7.jpg';
import img8 from './images/slideshow_images/8.jpg';
import img9 from './images/slideshow_images/9.jpg';
import img10 from './images/slideshow_images/10.jpg';
import img11 from './images/slideshow_images/11.jpg';
import img12 from './images/slideshow_images/12.jpg';
import img13 from './images/slideshow_images/13.jpg';
import img14 from './images/slideshow_images/14.jpg';
import img15 from './images/slideshow_images/15.JPG';

// Images in ascending order
const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
];

function Slideshow({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure currentIndex never exceeds the number of images
  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(images.length - 1);
    }
    if (currentIndex < 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prevIndex) => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prevIndex) => 
          prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div 
      className="slideshow-container"
        style={{
          backgroundImage: `url(${heartsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1>{"Lessgoooo, I love you so much!! 💕🫶💕🫶💕🫶"}</h1>
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
            {Math.min(currentIndex + 1, images.length)} / {images.length}
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

