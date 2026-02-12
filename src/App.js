import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import dogRose from './images/dog_rose.jpg';
import heartsBg from './images/hearts_bg.jpg';
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
  const [shouldFollowMouse, setShouldFollowMouse] = useState(false);
  const lastMousePositionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const typeIntervalRef = useRef(null);
  const noButtonHoverTimerRef = useRef(null);
  const yesButtonRef = useRef(null);
  const mainTimerRef = useRef(null);
  const mainButtonTimerRef = useRef(null);
  const mainSecondButtonTimerRef = useRef(null);
  const mainSecondTypewriterTimerRef = useRef(null);
  const isNoButtonClickedRef = useRef(false);
  const finalTimerRef = useRef(null);
  
  // Refs for smooth mouse following with requestAnimationFrame
  const mouseTargetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const followerPositionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationFrameRef = useRef(null);

  const handleNoButtonHover = () => {
    setIsNoButtonHovered(true);
    setSavedText(displayedText); // Save current text
    setDisplayedText('............................');
    
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

  // Helper function to trigger mouse following behavior
  const triggerMouseFollowing = () => {
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
          // Initialize target to current mouse position
          mouseTargetRef.current = lastMousePositionRef.current;
          setShouldFollowMouse(true);
        }, 1000);
      }
    }, 100); // 100ms delay between each character
  };

  const handleNoButtonClick = () => {
    setIsNoButtonClicked(true);
    isNoButtonClickedRef.current = true;
    
    // Shrink the "No" button immediately
    setIsNoButtonShrinking(true);
    
    // Clear all main timer effects
    if (mainTimerRef.current) {
      clearTimeout(mainTimerRef.current);
      mainTimerRef.current = null;
    }
    if (mainButtonTimerRef.current) {
      clearTimeout(mainButtonTimerRef.current);
      mainButtonTimerRef.current = null;
    }
    if (mainSecondButtonTimerRef.current) {
      clearTimeout(mainSecondButtonTimerRef.current);
      mainSecondButtonTimerRef.current = null;
    }
    if (mainSecondTypewriterTimerRef.current) {
      clearTimeout(mainSecondTypewriterTimerRef.current);
      mainSecondTypewriterTimerRef.current = null;
    }
    if (finalTimerRef.current) {
      clearTimeout(finalTimerRef.current);
      finalTimerRef.current = null;
    }
    if (noButtonHoverTimerRef.current) {
      clearTimeout(noButtonHoverTimerRef.current);
      noButtonHoverTimerRef.current = null;
    }
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    
    // Don't reset button size states - keep whatever state it's currently in
    // Just prevent further progression
    
    triggerMouseFollowing();
  };


  useEffect(() => {
    // Don't start timer if "No" button was already clicked
    if (isNoButtonClickedRef.current) {
      return;
    }
    
    let buttonTimer = null;
    let secondButtonTimer = null;
    let secondTypewriterTimer = null;
    
    const timer = setTimeout(() => {
      // Check again before executing (in case "No" was clicked during the 10 second wait)
      if (isNoButtonClickedRef.current) {
        return;
      }
      
      const newText = 'you know what to do right?';
      setHeadingText(newText);
      
      // Typewriter effect
      setDisplayedText('');
      let currentIndex = 0;
      typeIntervalRef.current = setInterval(() => {
        if (isNoButtonClickedRef.current) {
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current);
            typeIntervalRef.current = null;
          }
          return;
        }
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
            if (isNoButtonClickedRef.current) return; // Check before executing
            setIsTimerComplete(true);
            mainButtonTimerRef.current = buttonTimer;
            
            // Start final timer after first button size change completes (3s transition + 10s wait)
            // Clear any existing final timer first
            if (finalTimerRef.current) {
              clearTimeout(finalTimerRef.current);
            }
            finalTimerRef.current = setTimeout(() => {
              // Only trigger if "Yes" hasn't been clicked and we're still at first size change
              if (!isNoButtonClickedRef.current && !shouldFollowMouse) {
                triggerMouseFollowing();
              }
            }, 3000 + 10000); // 3s (button transition) + 10s wait
            
            // After button size change completes (3s transition) + 5 seconds, start second typewriter
            secondTypewriterTimer = setTimeout(() => {
              if (isNoButtonClickedRef.current) return; // Check before executing
              const secondText = '......';
              setHeadingText(secondText);
              
              // Second typewriter effect
              setDisplayedText('');
              let secondIndex = 0;
              typeIntervalRef.current = setInterval(() => {
                if (isNoButtonClickedRef.current) {
                  if (typeIntervalRef.current) {
                    clearInterval(typeIntervalRef.current);
                    typeIntervalRef.current = null;
                  }
                  return;
                }
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
                    if (isNoButtonClickedRef.current) return; // Check before executing
                    setIsSecondButtonSize(true);
                    
                    // Clear the previous final timer and start a new one after second button size change
                    if (finalTimerRef.current) {
                      clearTimeout(finalTimerRef.current);
                    }
                    // Start final timer after second button size change completes (3s transition + 10s wait)
                    finalTimerRef.current = setTimeout(() => {
                      // Only trigger if "Yes" hasn't been clicked
                      if (!isNoButtonClickedRef.current && !shouldFollowMouse) {
                        triggerMouseFollowing();
                      }
                    }, 3000 + 10000); // 3s (button transition) + 10s wait
                  }, 1000); // 1 second delay after typewriter completes
                  mainSecondButtonTimerRef.current = secondButtonTimer;
                }
              }, 100); // 100ms delay between each character
            }, 3000 + 5000); // 3s (button transition) + 5s wait
            mainSecondTypewriterTimerRef.current = secondTypewriterTimer;
          }, 1000); // 1 second delay after typewriter completes
        }
      }, 100); // 100ms delay between each character
    }, 10000); // 10 seconds

    // Store refs for cleanup
    mainTimerRef.current = timer;

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
      if (finalTimerRef.current) {
        clearTimeout(finalTimerRef.current);
      }
    };
  }, []);

  // Update saved text when displayedText changes (for the main timer effects)
  useEffect(() => {
    if (!isNoButtonHovered && !isNoButtonShrinking && !isNoButtonClicked) {
      setSavedText(displayedText);
    }
  }, [displayedText, isNoButtonHovered, isNoButtonShrinking, isNoButtonClicked]);

  // Track mouse position continuously (even before following starts)
  useEffect(() => {
    const handleMouseMove = (e) => {
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      mouseTargetRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Smooth following animation using requestAnimationFrame
  useEffect(() => {
    if (!shouldFollowMouse) {
      // Cancel animation if following is disabled
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = () => {
      if (!yesButtonRef.current || !shouldFollowMouse) {
        return;
      }

      // Get current scale and translateX values
      let scale = 1;
      let translateX = -50;
      let easeScale = 1;
      if (isSecondButtonSize) {
        scale = 4;
        translateX = 100;
        easeScale = 8;
      } else if (isTimerComplete) {
        scale = 2;
        translateX = 0;
        easeScale = 8;
      }

      // Use constant easing for consistent visual speed regardless of scale
      const easing = 0.1 / easeScale;

      // Calculate difference from mouse to current position
      const diffX = mouseTargetRef.current.x - followerPositionRef.current.x;
      const diffY = mouseTargetRef.current.y - followerPositionRef.current.y;

      // Apply easing to the difference
      followerPositionRef.current.x += diffX * easing;
      followerPositionRef.current.y += diffY * easing;

      // Update the button's position directly using CSS transform
      yesButtonRef.current.style.left = `${followerPositionRef.current.x}px`;
      yesButtonRef.current.style.top = `${followerPositionRef.current.y}px`;
      yesButtonRef.current.style.transform = `translate(${translateX}%, -50%) scale(${scale})`;

      // Continue the animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize follower position to button's current position when following starts
    if (yesButtonRef.current) {
      const rect = yesButtonRef.current.getBoundingClientRect();
      followerPositionRef.current.x = rect.left + rect.width / 2;
      followerPositionRef.current.y = rect.top + rect.height / 2;
    }

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [shouldFollowMouse, isTimerComplete, isSecondButtonSize]);

  if (currentPage === 'slideshow') {
    return <Slideshow onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="App">
      <header 
        className="App-header"
        style={{
          backgroundImage: `url(${heartsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1>{displayedText}</h1>
        <img src={dogRose} className="App-logo" alt="dog rose" />
        <div className="button-container">
          <button 
            ref={yesButtonRef}
            className={`valentine-button ${isTimerComplete ? 'valentine-button-large' : ''} ${isSecondButtonSize ? 'valentine-button-extra-large' : ''} ${shouldFollowMouse ? 'valentine-button-follow' : ''}`}
            onClick={() => {
              // Clear final timer when "Yes" is clicked
              if (finalTimerRef.current) {
                clearTimeout(finalTimerRef.current);
                finalTimerRef.current = null;
              }
              setCurrentPage('slideshow');
            }}
            style={shouldFollowMouse ? {
              position: 'fixed',
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
