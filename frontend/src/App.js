import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout';
import LoadingScreen from './components/LoadingScreen';  // Import the LoadingScreen component
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import "./styles/index.css";

const App = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      const geoPermission = await navigator.permissions.query({ name: 'geolocation' });
      geoPermission.onchange = () => {
        if (geoPermission.state === 'granted') {
          setLocationGranted(true);
          
        }
      };
    } catch (err) {
      console.error('Permission error:', err);
    }
  };

  useEffect(() => {
    requestLocationPermission();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);


  return (
    <BrowserRouter>
      <div>
      {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
        <Layout>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/about" element={<Home />} />
        </Routes>
        </Layout>
          </>
          )}
      </div>
    </BrowserRouter>
  );
};

export default App;
