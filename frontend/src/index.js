// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // import from 'react-dom/client'
import './styles/index.css'; // The global CSS file
import App from './App'; // The main component

// Create the root for the app
const root = ReactDOM.createRoot(document.getElementById('root')); // use createRoot

// Render the app using createRoot
root.render(
  
    <App />

);
