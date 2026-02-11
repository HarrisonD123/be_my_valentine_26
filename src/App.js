import React, { useState } from 'react';
import './App.css';
import dogRose from './images/dog_rose.jpg';
import Slideshow from './Slideshow';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'slideshow') {
    return <Slideshow onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Will you be my Valentine?</h1>
        <img src={dogRose} className="App-logo" alt="dog rose" />
        <div className="button-container">
          <button 
            className="valentine-button"
            onClick={() => setCurrentPage('slideshow')}
          >
            Yes
          </button>
          <button 
            className="valentine-button"
            onClick={() => alert('Button 2 clicked!')}
          >
            No
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
