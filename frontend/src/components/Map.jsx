import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const EnhancedMap = ({ onCitySelect }) => {
  const [markerPosition, setMarkerPosition] = useState([48.82999, 2.3522]); // Default to Paris coordinates
  const [city, setCity] = useState("Paris");
  const mapRef = useRef(null); // Reference to the MapContainer

  // Use geolocation API to get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      // Ask for the user's location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log('User location:', lat, lon); // Log coordinates to confirm

          // Set the new marker position based on the user's location
          setMarkerPosition([lat, lon]);
          
          // Reverse geocoding to get the city name based on the coordinates
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          )
            .then((response) => response.json())
            .then((data) => {
              const cityName = data.address?.city || data.address?.town || "Unknown";
              console.log('City Name:', cityName); // Log city name
              setCity(cityName);
              onCitySelect(cityName); // Notify parent with the selected city
            });

          // Center the map to the new location and update the map view
          if (mapRef.current) {
            //mapRef.current.leafletElement.useState([lat, lon]);
             mapRef.current.setView([lat, lon], 13); // Set the new view with a zoom level of 13
          }
        },
        (error) => {
          console.error('Geolocation error:', error); // Log errors if geolocation fails
          setMarkerPosition([48.8566, 2.3522]); // Fallback to Paris if geolocation fails
          setCity("Paris"); // Set city to Paris if location access fails
          // If geolocation fails, no need to update the map view because it remains in Paris
        }
      );
    } else {
      console.warn('Geolocation not supported by this browser');
      setMarkerPosition([48.8566, 2.3522]); // Fallback to Paris if geolocation isn't supported
      setCity("Paris"); // Set city to Paris if geolocation isn't supported
    }
  }, [onCitySelect]);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={markerPosition} // Center map at the marker position (dynamic based on location)
        zoom={13} // Set the zoom level (13 is a nice zoom level for a city)
        style={{ height: '800px', width: '100%', borderRadius: '8px' }}
        dragging
        className="leaflet-container"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)} // Save map instance
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="http://stamen.com/">Stamen Design</a>'
        />
        {/* Circle to represent the user’s location */}
        <Circle
          center={markerPosition}
          radius={50} // Radius of the circle around the marker
          pathOptions={{ color: 'black', fillColor: 'white', fillOpacity: 0.7 }}
        />
      </MapContainer>

      {/* Display the city name */}
      <div style={{ marginTop: "8px" }}>
        <input
          type="text"
          value={city}
          onChange={() => {}}
          placeholder="City"
          style={{
            /*fontFamily: "Arial, sans-serif",*/
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            /*pointerEvents: "none", // Disable user input */
          }}
          readOnly
        />
      </div>
    </div>
  );
};

export default EnhancedMap;
