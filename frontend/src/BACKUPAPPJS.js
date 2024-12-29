import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';  // Import the LoadingScreen component
import ModernMap from './components/Map';
import { BrowserRouter as Router, Link } from "react-router-dom";
import AutocompleteInput from './components/AutocompleteInput';
import SmoothScroll from 'smooth-scroll';
import  Login from './pages/login';
import SignUp from './pages/signup';
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';



const App = () => {

  
  const [depart, setDepart] = useState('');
  const [destination, setDestination] = useState('');
  const [locationGranted, setLocationGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCitySelect = (cityName) => {
    if (!depart) {
      setDepart(cityName);
    } else if (!destination) {
      setDestination(cityName);
    }
  };

  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 600000,
    speedAsDuration: true
  });

  const requestLocationPermission = async () => {
    try {
      const geoPermission = await navigator.permissions.query({ name: 'geolocation' });
      geoPermission.onchange = () => {
        if (geoPermission.state === 'granted') {
          setLocationGranted(true);
          getCurrentLocation();
        }
      };
    } catch (err) {
      console.error('Permission error:', err);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setDepart(`Lat: ${lat}, Lon: ${lon}`);  // Example usage of location
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    const scroll = new SmoothScroll('a[href*="#"]', {
      speed: 600,
      speedAsDuration: true,
    });
  
    // Optional: Cleanup the effect when the component is unmounted
    return () => scroll.destroy();
  }, []);

  useEffect(() => {
    requestLocationPermission();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const suggestions = [];


  return (
    
    <Router> 
    

    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>


{/*----------------------------------------------------------NAVIGATION----------------------------------------------------*/}

          <header className="Header">
            <div className="navigation-container">

            {/*  <nav className="Nav">
                <a href="#home" className="HOME">Home</a>
                <a href="#about" className="ABOUT">About</a>
                <a href="#contact" className="CONTACT">Contact</a>
              </nav>*/}


              <nav className="Nav">
                <Link to="/home" className="HOME">Home</Link>
                <Link to="/about" className="ABOUT">About</Link>
                <Link to="/contact" className="CONTACT">Contact</Link>
              </nav>

              <a href="#home" className="Logo">FVST</a>

              <div className="BTN">
              <Link to="/login" >
                <button className="LOGIN">Log In</button>
              </Link>

              <Link to="/signup" >
                <button className="SIGN_IN">Sign Up</button>
                </Link>
              </div>
            </div>
          </header>



{/*----------------------------------------------------------FIRST PART----------------------------------------------------*/}

          <main className="INPUT_GPS">

            <div className="INPUT1">

              <div className="INPUT2">

                <h2 className="SLOGAN">FAST delivery, with FVST</h2>

                <div className="SEARCH">
                
                <input  type="text" className="location" placeholder="Enter location"   onChange={(e) => setDepart(e.target.value)} />
                <input  type="text" className="destination" placeholder="Enter destination" onChange={(e) =>  setDestination(e.target.value)} />

                {/* <AutocompleteInput
                    suggestions={suggestions}
                    placeholder="Enter location"
                    value={depart}
                    onChange={setDepart}
                  />
                  <AutocompleteInput
                    suggestions={suggestions}
                    placeholder="Enter destination"
                    value={destination}
                    onChange={setDestination}
                  /> */}

                  <div className="TIME">
                    <input type="date" className="DATE"  />
                    <input type="time" className="TIME1" placeholder='Time' />
                  </div>

                  <button className="BTN_SEARCH">Search</button>
                </div>
              </div>

              <div className="MAP">
                <ModernMap onCitySelect={handleCitySelect} locationGranted={locationGranted} />
              </div>

            </div>
          </main>




{/*----------------------------------------------------------SECOND PART----------------------------------------------------*/}



          <main className='SECOND_PART'>
          <div className="Container3">

          <div className="IMG">
            <img src="icone/FIRSTPIC.jpeg" className="IMG" alt="IMAGE" />
          </div>



          <div className="TEXT3">

                <h1 className="TITLE2">Save Time, Cut Delivery Costs</h1>
                <h2 className="TITLEP">The platform that connects merchants and couriers for fast and efficient deliveries.</h2>

            
          </div>
          </div>
            
          </main>

          
          
{/*----------------------------------------------------------THIRD PART----------------------------------------------------*/}
        
          <main className='THIRD_PART'>
          <div className="Container4">

          <div className="IMG">
            <img src="icone/FIRSTPIC.jpeg" className="IMG" alt="IMAGE" />
          </div>



          <div className="TEXT3">

                <h1 className="TITLE3">Save Time, Cut Delivery Costs</h1>
                <h2 className="TITLEP2">The platform that connects merchants and couriers for fast and efficient deliveries.</h2>

            
          </div>
          </div>
            
          </main>

          


        
          <AppRoutes />
        </>
      )}
    </div>
    </Router> 
  );
};

export default App;
