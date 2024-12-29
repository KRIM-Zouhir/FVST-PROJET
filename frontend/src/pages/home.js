import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import ModernMap from '../components/Map';
import cities from '../components/european_cities.json'; // Adjust the path if necessary
import './styles/home.css';

const Home = () => {
    const [locationGranted, setLocationGranted] = useState(false);

    const [depart, setDepart] = useState('');
    const [destination, setDestination] = useState('');
    const [departSuggestions, setDepartSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeInput, setActiveInput] = useState(null); // Track active input (location or destination)


 // Gérer les suggestions pour "depart"
  const handleDepartChange = (value) => {
  setDepart(value);

  if (value.trim().length > 0) {
    const filtered = cities
      .filter(city => city.name.toLowerCase().startsWith(value.toLowerCase()))
      .slice(0, 10);
    setDepartSuggestions(filtered);
    setActiveInput('depart');
  } else {
    setDepartSuggestions([]);
    setActiveInput(null);
  }
};

  // Gérer les suggestions pour "destination"
  const handleDestinationChange = (value) => {
    setDestination(value);

    if (value.trim().length > 0) {
      const filtered = cities
        .filter(city => city.name.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 10);
      setDestinationSuggestions(filtered);
      setActiveInput('destination');
    } else {
      setDestinationSuggestions([]);
      setActiveInput(null);
    }
  };

  // Gérer la sélection d'une suggestion pour "depart"
  const handleDepartSuggestionClick = (city) => {
    setDepart(city.name);
    setDepartSuggestions([]);
    setActiveInput(null);
  };

  // Gérer la sélection d'une suggestion pour "destination"
  const handleDestinationSuggestionClick = (city) => {
    setDestination(city.name);
    setDestinationSuggestions([]);
    setActiveInput(null);
  };

    const handleCitySelect = (cityName) => {
    if (!depart) {
    setDepart(cityName);
    } else if (!destination) {
    setDestination(cityName);
    }
    };

      // Gérer la perte de focus avec un petit délai
  const handleBlur = () => {
    setTimeout(() => {
      setDepartSuggestions([]);
      setDestinationSuggestions([]);
      setActiveInput(null);
    }, 100);
  };
    return (
      
    <div>
{/*----------------------------------------------------------FIRST PART----------------------------------------------------*/}

        <main className="INPUT_GPS">

            <div className="INPUT1">

            <div className="INPUT2">

                <h2 className="SLOGAN">FAST delivery, with FVST</h2>

            <div className="SEARCH">
                
            <input
                type="text"
                className="location"
                placeholder="Enter location"
                value={depart}
                onChange={(e) => handleDepartChange(e.target.value)}
                onFocus={() => setActiveInput('depart')}
                onBlur={handleBlur}
            />


            {activeInput === 'depart' && (
                <ul className="suggestions">
                  {departSuggestions.map((city, index) => (
                    
                    <li
                      key={index}
                      onClick={() => handleDepartSuggestionClick(city)}
                    >
                      {city.name} - {city.country}
                    </li>
                  ))}
                </ul>
            )}



            <input
                type="text"
                className="destination"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onFocus={() => setActiveInput('destination')}
                onBlur={handleBlur}
            />

            {activeInput === 'destination' && (
                <ul className="suggestions2">
                  {destinationSuggestions.map((city, index) => (
                    <li
                      key={index}
                      onClick={() => handleDestinationSuggestionClick(city)}
                    >
                      {city.name} - {city.country}
                    </li>
                  ))}
                </ul>
            )}

              
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

                <h1 className="TITLE3">FVST</h1>
                <h2 className="TITLEP2">The platform that connects merchants and couriers for fast and efficient deliveries.</h2>

            
            </div>
            </div>
                
            </main>



    </div> 
);
};
export default Home;