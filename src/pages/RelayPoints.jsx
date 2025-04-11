import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaClock, FaPhone, FaInfoCircle } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { relayPointAPI } from '../services/api';

const RelayPoints = () => {
  const [relayPoints, setRelayPoints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    fetchRelayPoints();
  }, []);

  useEffect(() => {
    if (!mapLoaded && document.getElementById('relay-map') && relayPoints.length > 0) {
      // Initialize map
      mapInstanceRef.current = L.map('relay-map').setView([46.2276, 2.2137], 5); // Center of France
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      
      // Store reference to the map
      mapRef.current = mapInstanceRef.current;
      
      // Add markers for each relay point
      relayPoints.forEach(async (point) => {
        // Geocode the address
        const geocoded = await geocodeAddress(point.address);
        if (geocoded) {
          // Create marker
          const marker = L.marker([geocoded.lat, geocoded.lon], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(mapRef.current);
          
          // Add popup with relay point info
          marker.bindPopup(`
            <strong>${point.name}</strong><br/>
            ${point.address}<br/>
            <small>Horaires: ${point.opening_hours}</small>
          `);
          
          // Store marker reference
          markers.current.push(marker);
        }
      });
      
      setMapLoaded(true);
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markers.current = [];
        setMapLoaded(false);
      }
    };
  }, [relayPoints, mapLoaded]);
  
  // Function to geocode an address using Nominatim (OpenStreetMap)
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const fetchRelayPoints = async () => {
    try {
      const response = await relayPointAPI.getAll();
      setRelayPoints(response.data);
    } catch (err) {
      console.error("Error fetching relay points:", err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des points relais');
    } finally {
      setLoading(false);
    }
  };

  const filteredPoints = relayPoints.filter(point =>
    point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.postal_code.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des points relais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaInfoCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Points relais disponibles</h1>
          <p className="mt-2 text-gray-600">
            Trouvez le point relais le plus proche de chez vous
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par ville ou code postal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-md border-gray-300 focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
            />
          </div>
        </div>

        {/* Relay Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.map((point) => (
            <div
              key={point.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-lg ${
                selectedPoint?.id === point.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedPoint(point)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{point.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    point.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {point.active ? 'Ouvert' : 'Fermé'}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{point.address}</p>
                      <p className="text-sm text-gray-500">
                        {point.postal_code} {point.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaClock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">Horaires d'ouverture</p>
                      <p className="text-sm text-gray-500 whitespace-pre-line">{point.opening_hours}</p>
                    </div>
                  </div>

                  {point.phone && (
                    <div className="flex items-start">
                      <FaPhone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">Contact</p>
                        <p className="text-sm text-gray-500">{point.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPoints.length === 0 && (
          <div className="text-center py-12">
            <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun point relais trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-bold p-4 border-b">Carte des Points Relais</h2>
          <div id="relay-map" style={{ height: '500px', width: '100%' }} className="rounded-lg leaflet-container"></div>
        </div>
      </div>
    </div>
  );
};

export default RelayPoints;