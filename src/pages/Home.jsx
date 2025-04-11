import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaMapMarkedAlt, FaShieldAlt, FaEuroSign, FaSearch, FaArrowRight, FaMapMarkerAlt, FaTimes, FaBox } from 'react-icons/fa';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useAuth } from '../context/AuthContext';
import { pricingService } from '../services/PricingService';
import debounce from 'lodash/debounce';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState(1);
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [route, setRoute] = useState(null);
  const [priceDetails, setPriceDetails] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);

  // Debounced search functions
  const debouncedSearchDeparture = useCallback(
    debounce(async (query) => {
      if (query.length < 3) return;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
        const data = await response.json();
        const suggestions = data.map(item => ({
          display_name: item.display_name,
          short_name: item.display_name.split(',')[0],
          lat: item.lat,
          lon: item.lon
        }));
        setDepartureSuggestions(suggestions);
        setShowDepartureSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300),
    []
  );

  const debouncedSearchDestination = useCallback(
    debounce(async (query) => {
      if (query.length < 3) return;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
        const data = await response.json();
        const suggestions = data.map(item => ({
          display_name: item.display_name,
          short_name: item.display_name.split(',')[0],
          lat: item.lat,
          lon: item.lon
        }));
        setDestinationSuggestions(suggestions);
        setShowDestinationSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300),
    []
  );

  const handleDepartureChange = (e) => {
    const value = e.target.value;
    setDeparture(value);
    if (value.length >= 3) {
      debouncedSearchDeparture(value);
    } else {
      setShowDepartureSuggestions(false);
    }
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length >= 3) {
      debouncedSearchDestination(value);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion, isDeparture) => {
    const value = suggestion.display_name;
    if (isDeparture) {
      setDeparture(value);
      setShowDepartureSuggestions(false);
    } else {
      setDestination(value);
      setShowDestinationSuggestions(false);
    }
  };

  const calculateRoute = async () => {
    if (!departure || !destination) return;

    try {
      // Clear existing markers and route
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (routingControlRef.current) {
        mapInstanceRef.current.removeControl(routingControlRef.current);
      }

      // Geocode departure and destination
      const [departureResponse, destinationResponse] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(departure)}&limit=1`),
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`)
      ]);

      const [departureData, destinationData] = await Promise.all([
        departureResponse.json(),
        destinationResponse.json()
      ]);

      if (departureData.length === 0 || destinationData.length === 0) {
        throw new Error('Could not find locations');
      }

      const start = [parseFloat(departureData[0].lat), parseFloat(departureData[0].lon)];
      const end = [parseFloat(destinationData[0].lat), parseFloat(destinationData[0].lon)];

      // Add markers
      const startMarker = L.marker(start).addTo(mapInstanceRef.current)
        .bindPopup(`Départ: ${departureData[0].display_name}`);
      const endMarker = L.marker(end).addTo(mapInstanceRef.current)
        .bindPopup(`Destination: ${destinationData[0].display_name}`);
      
      markersRef.current = [startMarker, endMarker];

      // Calculate and display route
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1])
        ],
        routeWhileDragging: true,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        language: 'fr'
      }).addTo(mapInstanceRef.current);

      routingControlRef.current = routingControl;

      // Listen for the route calculation completion
      routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        
        // Update route with actual distance and duration
        setRoute({
          distance: summary.totalDistance,
          duration: summary.totalTime,
          start: departureData[0].display_name,
          end: destinationData[0].display_name
        });

        // Calculate price based on actual distance and weight
        const priceInfo = pricingService.calculateTotalPrice(summary.totalDistance / 1000, weight);
        setPriceDetails(priceInfo);
        setShowPriceModal(true);
      });

      // Fit bounds to show the entire route
      const bounds = L.latLngBounds([start, end]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });

    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* First Section - Map and Input */}
      <div className="w-full px-4 py-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Title and Form */}
            <div className="w-full lg:w-1/2">
              <div className="mb-8">
                <h1 className="text-5xl font-bold tracking-tight">
                  Préparez votre<br />premier envoi
            </h1>
                <p className="text-xl text-gray-600 mt-4">
                  Découvrez la simplicité d'envoi de colis. Calculez votre itinéraire maintenant.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-2xl p-8 h-[450px] flex flex-col">
                <div className="space-y-8 flex-grow">
                  {/* Departure Input */}
                  <div className="relative">
                    <div className="relative flex items-center">
                      <div className="absolute left-5">
                        <div className="w-6 h-6 bg-black rounded-full"></div>
                      </div>
                      <input
                        type="text"
                        value={departure}
                        onChange={handleDepartureChange}
                        className="w-full pl-16 pr-5 py-6 text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Point de départ"
                      />
                    </div>
                    {showDepartureSuggestions && departureSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {departureSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionClick(suggestion, true)}
                          >
                            <div className="font-medium text-xl">{suggestion.short_name}</div>
                            <div className="text-gray-500 text-lg truncate mt-1">{suggestion.display_name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Destination Input */}
                  <div className="relative">
                    <div className="relative flex items-center">
                      <div className="absolute left-5">
                        <div className="w-6 h-6 border-3 border-black rounded-full"></div>
                      </div>
                      <input
                        type="text"
                        value={destination}
                        onChange={handleDestinationChange}
                        className="w-full pl-16 pr-5 py-6 text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Point d'arrivée"
                      />
                    </div>
                    {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {destinationSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionClick(suggestion, false)}
                          >
                            <div className="font-medium text-xl">{suggestion.short_name}</div>
                            <div className="text-gray-500 text-lg truncate mt-1">{suggestion.display_name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Weight Input */}
                  <div className="relative">
                    <div className="relative flex items-center">
                      <div className="absolute left-5">
                        <FaBox className="w-6 h-6 text-black" />
                      </div>
                      <input
                        type="number"
                        min="0.1"
                        max="30"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="w-full pl-16 pr-5 py-6 text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Poids du colis (kg)"
                      />
                    </div>
                  </div>

                  <button
                    onClick={calculateRoute}
                    className="w-full bg-black text-white py-6 px-8 text-2xl font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200"
                  >
                    Voir les prix
                  </button>
                </div>

                {/* Price Modal */}
                {showPriceModal && priceDetails && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative shadow-2xl">
                      <button
                        onClick={() => setShowPriceModal(false)}
                        className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      <h3 className="text-3xl font-bold text-gray-800 mb-6">Estimation de livraison</h3>
                      <div className="space-y-5">
                        <div className="flex justify-between items-center text-xl">
                          <span className="font-medium">Distance:</span>
                          <span className="font-semibold">{(route.distance / 1000).toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between items-center text-xl">
                          <span className="font-medium">Type de trajet:</span>
                          <span className="font-semibold">
                            {priceDetails.details.isIntraCity ? 'Intra-ville' : 
                             priceDetails.details.isPopularRoute ? 'Route populaire' : 'Standard'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xl">
                          <span className="font-medium">Durée estimée:</span>
                          <span className="font-semibold">{Math.round(route.duration / 60)} min</span>
                        </div>
                        <div className="flex justify-between items-center text-xl">
                          <span className="font-medium">Catégorie de poids:</span>
                          <span className="font-semibold">{priceDetails.details.weightTier}</span>
                        </div>
                        
                        <div className="border-t border-gray-200 my-4"></div>
                        
                        <div className="flex justify-between items-center text-xl">
                          <span className="font-medium">Prix de base:</span>
                          <span className="font-semibold">{priceDetails.basePrice.toFixed(2)} €</span>
                        </div>
                        {priceDetails.weightPrice > 0 && (
                          <div className="flex justify-between items-center text-xl">
                            <span className="font-medium">Supplément poids:</span>
                            <span className="font-semibold">+{priceDetails.weightPrice.toFixed(2)} €</span>
                          </div>
                        )}
                        {priceDetails.timeMultiplier > 1 && (
                          <div className="flex justify-between items-center text-xl">
                            <span className="font-medium">Multiplicateur horaire:</span>
                            <span className="font-semibold">x{priceDetails.timeMultiplier.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-200 my-4"></div>
                        
                        <div className="flex justify-between items-center text-2xl">
                          <span className="font-bold">Prix total:</span>
                          <span className="font-bold text-2xl">{priceDetails.total.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center text-lg text-gray-600">
                          <span>Rémunération voyageur:</span>
                          <span>{priceDetails.travelerPayout.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center text-lg text-gray-600">
                          <span>Commission FVST (20%):</span>
                          <span>{priceDetails.platformFee.toFixed(2)} €</span>
                        </div>
                        
                        <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="text-sm text-gray-600 space-y-2">
                            <p>• Les prix sont donnés à titre indicatif et peuvent varier</p>
                            <p>• Livraison estimée: {priceDetails.details.estimatedDeliveryTime.toLocaleString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                            {priceDetails.details.isRushHour && <p>• Tarif heure de pointe (+10%)</p>}
                            {priceDetails.details.isWeekend && <p>• Tarif weekend (+5%)</p>}
                            {priceDetails.details.isNightTime && <p>• Tarif de nuit (+15%)</p>}
                            <p className="text-green-600">• Jusqu'à 60% moins cher que les services traditionnels</p>
                          </div>
                        </div>
                        
                        <div className="mt-8 flex justify-center">
            <Link
              to="/new-shipment"
                            className="bg-black text-white px-8 py-3 text-lg rounded-xl font-semibold hover:bg-gray-900 transition duration-300"
            >
              Créer un envoi
            </Link>
          </div>
                      </div>
                    </div>
                  </div>
                )}
        </div>
      </div>

            {/* Right side - Map */}
            <div className="w-full lg:w-1/2 h-[650px] rounded-xl overflow-hidden shadow-2xl relative z-0">
              <div ref={mapRef} className="w-full h-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Updated with black/white styling */}
      <div className="w-full px-4 py-24 bg-black">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center">
              <FaTruck className="text-5xl text-black mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Livraison Rapide</h3>
              <p className="text-gray-600 text-lg">Délai de livraison de 24-48h vers toute la France</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl text-center">
              <FaMapMarkedAlt className="text-5xl text-black mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Points Relais</h3>
              <p className="text-gray-600 text-lg">Plus de 1000 points relais disponibles</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl text-center">
              <FaShieldAlt className="text-5xl text-black mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Suivi en Temps Réel</h3>
              <p className="text-gray-600 text-lg">Suivez votre colis à chaque étape</p>
          </div>
            <div className="bg-white p-8 rounded-xl shadow-xl text-center">
              <FaEuroSign className="text-5xl text-black mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Tarifs Compétitifs</h3>
              <p className="text-gray-600 text-lg">Des prix avantageux pour tous vos envois</p>
          </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Updated with black/white styling */}
      <div className="w-full px-4 py-24 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-2xl font-semibold mb-4">Créez votre envoi</h3>
              <p className="text-gray-600 text-lg">Remplissez le formulaire et choisissez votre point relais</p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-2xl font-semibold mb-4">Déposez votre colis</h3>
              <p className="text-gray-600 text-lg">Apportez votre colis au point relais sélectionné</p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-2xl font-semibold mb-4">Suivez la livraison</h3>
              <p className="text-gray-600 text-lg">Recevez des notifications sur l'état de votre envoi</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Updated with black/white styling */}
      <div className="w-full px-4 py-24 bg-black">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white rounded-xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 text-black">Prêt à envoyer votre colis ?</h2>
            <p className="text-2xl mb-12 text-gray-600">Rejoignez-nous et profitez de nos services de livraison</p>
            <div className="space-x-6">
            <Link
              to="/register"
                className="bg-black text-white px-12 py-4 text-lg rounded-xl font-semibold hover:bg-gray-900 transition duration-300"
            >
              Créer un compte
            </Link>
            <Link
              to="/new-shipment"
                className="bg-transparent border-2 border-black text-black px-12 py-4 text-lg rounded-xl font-semibold hover:bg-black hover:text-white transition duration-300"
            >
              Envoyer un colis
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;