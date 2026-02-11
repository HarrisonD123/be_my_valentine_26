import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import dogRose from './images/dog_rose.jpg';
import Slideshow from './Slideshow';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [headingText, setHeadingText] = useState('Will you be my Valentine?');
  const [displayedText, setDisplayedText] = useState('Will you be my Valentine?');
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [isSecondButtonSize, setIsSecondButtonSize] = useState(false);
  const [isNoButtonHovered, setIsNoButtonHovered] = useState(false);
  const [isNoButtonShrinking, setIsNoButtonShrinking] = useState(false);
  const [isNoButtonClicked, setIsNoButtonClicked] = useState(false);
  const [savedText, setSavedText] = useState('Will you be my Valentine?');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // top-left for centering
  const [shouldFollowMouse, setShouldFollowMouse] = useState(false);
  const typeIntervalRef = useRef(null);
  const noButtonHoverTimerRef = useRef(null);
  const yesButtonRef = useRef(null);

  const handleNoButtonHover = () => {
    setIsNoButtonHovered(true);
    setSavedText(displayedText); // Save current text
    setDisplayedText('...');
    
    // After 5 seconds, change text and start shrinking
    noButtonHoverTimerRef.current = setTimeout(() => {
      setDisplayedText('what are you doing? :(');
      setIsNoButtonShrinking(true);
    }, 5000);
  };

  const handleNoButtonLeave = () => {
    setIsNoButtonHovered(false);
    if (noButtonHoverTimerRef.current) {
      clearTimeout(noButtonHoverTimerRef.current);
      noButtonHoverTimerRef.current = null;
    }
    // Restore saved text if not shrinking and not clicked
    if (!isNoButtonShrinking && !isNoButtonClicked) {
      setDisplayedText(savedText);
    }
  };

  const handleNoButtonClick = () => {
    setIsNoButtonClicked(true);
    const newText = "uhhh, it looks like you're having some trouble...here let me help";
    
    // Clear any existing typewriter
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    
    // Typewriter effect
    setDisplayedText('');
    let currentIndex = 0;
    typeIntervalRef.current = setInterval(() => {
      if (currentIndex < newText.length) {
        setDisplayedText(newText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (typeIntervalRef.current) {
          clearInterval(typeIntervalRef.current);
          typeIntervalRef.current = null;
        }
        // Start mouse following 1 second after typewriter completes
        setTimeout(() => {
          // Get current mouse position before starting to follow, centering the button
          let positionSet = false;
          const getInitialPosition = (e) => {
            if (!positionSet) {
              const rect = yesButtonRef.current?.getBoundingClientRect();
              if (rect) {
                setMousePosition({
                  x: e.clientX - rect.width / 2,
                  y: e.clientY - rect.height / 2,
                });
              } else {
                setMousePosition({ x: e.clientX, y: e.clientY });
              }
              setShouldFollowMouse(true);
              positionSet = true;
              window.removeEventListener('mousemove', getInitialPosition);
            }
          };
          window.addEventListener('mousemove', getInitialPosition);
          // Fallback if mouse doesn't move
          setTimeout(() => {
            if (!positionSet) {
              const rect = yesButtonRef.current?.getBoundingClientRect();
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              if (rect) {
                setMousePosition({
                  x: centerX - rect.width / 2,
                  y: centerY - rect.height / 2,
                });
              } else {
                setMousePosition({ x: centerX, y: centerY });
              }
              setShouldFollowMouse(true);
              window.removeEventListener('mousemove', getInitialPosition);
            }
          }, 100);
        }, 1000);
      }
    }, 100); // 100ms delay between each character
  };


  useEffect(() => {
    let buttonTimer = null;
    let secondButtonTimer = null;
    let secondTypewriterTimer = null;
    
    const timer = setTimeout(() => {
      const newText = 'I hope you say yes! 💕';
      setHeadingText(newText);
      
      // Typewriter effect
      setDisplayedText('');
      let currentIndex = 0;
      typeIntervalRef.current = setInterval(() => {
        if (currentIndex < newText.length) {
          setDisplayedText(newText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current);
            typeIntervalRef.current = null;
          }
          // Start button size change 1 second after typewriter completes
          buttonTimer = setTimeout(() => {
            setIsTimerComplete(true);
            
            // After button size change completes (3s transition) + 5 seconds, start second typewriter
            secondTypewriterTimer = setTimeout(() => {
              const secondText = '......';
              setHeadingText(secondText);
              
              // Second typewriter effect
              setDisplayedText('');
              let secondIndex = 0;
              typeIntervalRef.current = setInterval(() => {
                if (secondIndex < secondText.length) {
                  setDisplayedText(secondText.substring(0, secondIndex + 1));
                  secondIndex++;
                } else {
                  if (typeIntervalRef.current) {
                    clearInterval(typeIntervalRef.current);
                    typeIntervalRef.current = null;
                  }
                  // Start second button size change 1 second after second typewriter completes
                  secondButtonTimer = setTimeout(() => {
                    setIsSecondButtonSize(true);
                  }, 1000); // 1 second delay after typewriter completes
                }
              }, 100); // 100ms delay between each character
            }, 3000 + 5000); // 3s (button transition) + 5s wait
          }, 1000); // 1 second delay after typewriter completes
        }
      }, 100); // 100ms delay between each character
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(timer);
      if (buttonTimer) {
        clearTimeout(buttonTimer);
      }
      if (secondButtonTimer) {
        clearTimeout(secondButtonTimer);
      }
      if (secondTypewriterTimer) {
        clearTimeout(secondTypewriterTimer);
      }
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
      }
      if (noButtonHoverTimerRef.current) {
        clearTimeout(noButtonHoverTimerRef.current);
      }
    };
  }, []);

  // Update saved text when displayedText changes (for the main timer effects)
  useEffect(() => {
    if (!isNoButtonHovered && !isNoButtonShrinking && !isNoButtonClicked) {
      setSavedText(displayedText);
    }
  }, [displayedText, isNoButtonHovered, isNoButtonShrinking, isNoButtonClicked]);

  // Mouse move listener for button following (keeps button centered on cursor for any size)
  useEffect(() => {
    if (shouldFollowMouse) {
      const handleMouseMove = (e) => {
        const rect = yesButtonRef.current?.getBoundingClientRect();
        if (rect) {
          setMousePosition({
            x: e.clientX - rect.width / 2,
            y: e.clientY - rect.height / 2,
          });
        } else {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [shouldFollowMouse]);

  if (currentPage === 'slideshow') {
    return <Slideshow onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{displayedText}</h1>
        <img src={dogRose} className="App-logo" alt="dog rose" />
        <div className="button-container">
          <button 
            ref={yesButtonRef}
            className={`valentine-button ${isTimerComplete ? 'valentine-button-large' : ''} ${isSecondButtonSize ? 'valentine-button-extra-large' : ''} ${shouldFollowMouse ? 'valentine-button-follow' : ''}`}
            onClick={() => setCurrentPage('slideshow')}
            style={shouldFollowMouse ? {
              position: 'fixed',
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            } : {}}
          >
            Yes
          </button>
          <button 
            className={`valentine-button ${isNoButtonShrinking ? 'valentine-button-shrink' : ''}`}
            onClick={handleNoButtonClick}
            onMouseEnter={handleNoButtonHover}
            onMouseLeave={handleNoButtonLeave}
          >
            No
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
