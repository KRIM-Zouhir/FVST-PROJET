import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSearch, FaBoxOpen, FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhoneAlt, FaClock } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const TrackShipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackingId } = useParams();
  
  const [searchQuery, setSearchQuery] = useState(trackingId || '');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  const milestones = [
    { status: 'pending', label: 'Commande reçue', icon: <FaBoxOpen /> },
    { status: 'processing', label: 'En préparation', icon: <FaBox /> },
    { status: 'in_transit', label: 'En livraison', icon: <FaTruck /> },
    { status: 'delivered', label: 'Livré', icon: <FaCheckCircle /> }
  ];
  
  useEffect(() => {
    if (trackingId) {
      fetchShipmentDetails(trackingId);
    }
    
    // Initialize map 
    setTimeout(() => {
      setMapLoaded(true);
    }, 1500);
  }, [trackingId]);
  
  useEffect(() => {
    if (shipment && shipment.status === 'en cours' && shipment.origin && shipment.destination) {
      // Initialize map after component is mounted
      if (!isMapLoaded && document.getElementById('tracking-map')) {
        // Create map
        mapInstanceRef.current = L.map('tracking-map').setView([46.2276, 2.2137], 5); // Center of France
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
        
        // Store reference to the map
        mapRef.current = mapInstanceRef.current;
        
        // Try to geocode addresses and add route
        const setupRoute = async () => {
          try {
            // Geocode origin and destination
            const originResult = await geocodeAddress(shipment.origin);
            const destinationResult = await geocodeAddress(shipment.destination);
            
            if (originResult && destinationResult) {
              // Create routing control
              const routingControl = L.Routing.control({
                waypoints: [
                  L.latLng(originResult.lat, originResult.lon),
                  L.latLng(destinationResult.lat, destinationResult.lon)
                ],
                routeWhileDragging: false,
                lineOptions: {
                  styles: [{ color: '#000', weight: 4 }]
                },
                createMarker: function(i, waypoint, n) {
                  return L.marker(waypoint.latLng, {
                    draggable: false,
                    icon: L.icon({
                      iconUrl: i === 0 ? 
                        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png' : 
                        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                    })
                  });
                }
              }).addTo(mapRef.current);
              
              // Hide the control panel, but keep the route
              const container = routingControl.getContainer();
              L.DomUtil.addClass(container, 'leaflet-routing-container-hide');
            }
          } catch (error) {
            console.error("Error setting up route:", error);
          }
        };
        
        setupRoute();
        setIsMapLoaded(true);
      }
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapLoaded(false);
      }
    };
  }, [shipment, isMapLoaded]);
  
  const fetchShipmentDetails = async (id) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data
        const mockShipment = {
          tracking_number: id,
          status: 'in_transit',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          estimated_delivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
          current_location: 'En transit - Centre de distribution Paris',
          recipient: {
            name: 'Marie Dupont',
            address: '123 Rue de Paris, 75001 Paris',
            phone: '+33 6 12 34 56 78'
          },
          sender: {
            name: 'Entreprise ABC',
            address: '45 Avenue Victor Hugo, 75016 Paris'
          },
          package: {
            weight: '2.5 kg',
            dimensions: '30 x 20 x 15 cm',
            items: 3
          },
          history: [
            {
              status: 'pending',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              location: 'Centre d\'envoi - Paris',
              note: 'Commande reçue'
            },
            {
              status: 'processing',
              timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
              location: 'Centre de traitement - Paris',
              note: 'Colis préparé et prêt pour l\'expédition'
            },
            {
              status: 'in_transit',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
              location: 'Centre de distribution - Paris',
              note: 'En cours de livraison'
            }
          ],
          current_position: {
            lat: 48.862794,
            lng: 2.287181
          }
        };
        
        setShipment(mockShipment);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching shipment details:', error);
      toast.error('Erreur lors de la récupération des détails de livraison');
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warn('Veuillez entrer un numéro de suivi');
      return;
    }
    
    navigate(`/track/${searchQuery}`);
    fetchShipmentDetails(searchQuery);
  };
  
  const getCurrentMilestoneIndex = () => {
    if (!shipment) return -1;
    
    const statusIndex = milestones.findIndex(milestone => milestone.status === shipment.status);
    return statusIndex >= 0 ? statusIndex : 0;
  };
  
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
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Suivi de colis</h1>
      
      {/* Search Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de suivi
            </label>
            <input
              type="text"
              id="tracking"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              placeholder="Entrez le numéro de suivi (ex: TRK-12345-FR)"
            />
          </div>
          <div className="sm:self-end">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <FaSearch className="mr-2" />
              Rechercher
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : shipment ? (
        <div className="space-y-6">
          {/* Shipment Header */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Colis #{shipment.tracking_number}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    <FaCalendarAlt className="mr-1" /> 
                    Commandé le {shipment.created_at.toLocaleDateString()}
                  </span>
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  shipment.status === 'in_transit' ? 'bg-gray-100 text-gray-800' :
                  shipment.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {shipment.status === 'delivered' ? 'Livré' :
                   shipment.status === 'in_transit' ? 'En livraison' :
                   shipment.status === 'processing' ? 'En préparation' :
                   'Commande reçue'}
                </span>
              </div>
            </div>
            
            {/* Delivery Timeline */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                
                <div className="relative flex justify-between">
                  {milestones.map((milestone, index) => {
                    const currentIndex = getCurrentMilestoneIndex();
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={milestone.status} className="flex flex-col items-center">
                        <div 
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            isCompleted 
                              ? 'bg-black text-white' 
                              : 'bg-gray-200 text-gray-400'
                          } ${
                            isCurrent ? 'ring-2 ring-offset-2 ring-black' : ''
                          }`}
                        >
                          {milestone.icon}
                        </div>
                        <div className="text-xs text-center mt-2">
                          <span className={isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                            {milestone.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Map and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Status */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statut de la livraison</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Position actuelle</p>
                  <p className="flex items-center text-gray-900 mt-1">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {shipment.current_location}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Dernière mise à jour</p>
                  <p className="flex items-center text-gray-900 mt-1">
                    <FaClock className="mr-2 text-black" />
                    {shipment.history[shipment.history.length - 1].timestamp.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Livraison estimée</p>
                  <p className="flex items-center text-gray-900 mt-1">
                    <FaCalendarAlt className="mr-2 text-green-500" />
                    {shipment.estimated_delivery.toLocaleDateString()} ({
                      Math.ceil((shipment.estimated_delivery - new Date()) / (1000 * 60 * 60 * 24))
                    } jour{Math.ceil((shipment.estimated_delivery - new Date()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''})
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Destinataire</p>
                  <p className="flex items-center text-gray-900 mt-1">
                    <FaUser className="mr-2 text-indigo-500" />
                    {shipment.recipient.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléphone du destinataire</p>
                  <p className="flex items-center text-gray-900 mt-1">
                    <FaPhoneAlt className="mr-2 text-indigo-500" />
                    {shipment.recipient.phone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="h-full min-h-[250px] bg-gray-100 relative">
                {isMapLoaded ? (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-4">
                      <FaMapMarkerAlt className="mx-auto h-10 w-10 text-red-500" />
                      <p className="mt-2 text-sm text-gray-600">
                        Carte de suivi de la livraison<br />
                        <span className="text-xs">(cette carte est un exemple - dans une application réelle, une carte interactive serait affichée ici)</span>
                      </p>
                      <div className="mt-4 bg-white p-2 rounded-md shadow-sm text-left">
                        <p className="text-xs">Position du colis:</p>
                        <p className="text-sm font-medium">
                          {shipment.current_location}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Shipment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Package Details */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Détails du colis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Poids</p>
                  <p className="text-gray-900">{shipment.package.weight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dimensions</p>
                  <p className="text-gray-900">{shipment.package.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Articles</p>
                  <p className="text-gray-900">{shipment.package.items}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Adresse de livraison</p>
                <p className="text-gray-900 mt-1">{shipment.recipient.address}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Expéditeur</p>
                <p className="text-gray-900 mt-1">{shipment.sender.name}</p>
                <p className="text-gray-600 text-sm">{shipment.sender.address}</p>
              </div>
            </div>
            
            {/* Delivery History */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historique de livraison</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {[...shipment.history].reverse().map((event, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== shipment.history.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              event.status === 'delivered' ? 'bg-green-500' :
                              event.status === 'in_transit' ? 'bg-black' :
                              event.status === 'processing' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}>
                              {event.status === 'delivered' ? 
                                <FaCheckCircle className="h-5 w-5 text-white" /> : 
                                event.status === 'in_transit' ? 
                                <FaTruck className="h-5 w-5 text-white" /> :
                                event.status === 'processing' ? 
                                <FaBox className="h-5 w-5 text-white" /> :
                                <FaBoxOpen className="h-5 w-5 text-white" />
                              }
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">{event.note}</p>
                              <p className="text-xs text-gray-500">{event.location}</p>
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-500">
                              <time dateTime={event.timestamp}>
                                {event.timestamp.toLocaleString([], {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (trackingId ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-base font-semibold text-gray-900">Colis introuvable</h3>
          <p className="mt-1 text-sm text-gray-500">
            Nous n'avons pas pu trouver de colis avec le numéro de suivi {trackingId}.<br />
            Veuillez vérifier le numéro et réessayer.
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-base font-semibold text-gray-900">Suivez votre livraison</h3>
          <p className="mt-1 text-sm text-gray-500">
            Entrez votre numéro de suivi ci-dessus pour connaître l'état de votre livraison.
          </p>
        </div>
      ))}
    </div>
  );
};

export default TrackShipment; 