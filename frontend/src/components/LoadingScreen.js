// src/components/LoadingScreen.js
import React, { useState, useEffect } from 'react';
import './LoadingScreen.css'; // We'll create a separate CSS file for styling

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval); // Stop progress when it's complete
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 200); // Increase every 300ms

    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="loading-text">Loading<span className="dots">...</span></p>
    </div>
  );
};

export default LoadingScreen;
