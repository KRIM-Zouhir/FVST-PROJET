import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkedAlt, FaTruck, FaCheckCircle, FaClock, FaBox, FaExclamationTriangle, FaDirections } from 'react-icons/fa';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const DriverRoutes = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [activeRoute, setActiveRoute] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          // Mock data
          const mockRoutes = [
            {
              id: 'RT12345',
              date: new Date(),
              status: 'in_progress',
              deliveries: [
                {
                  id: 'DL123',
                  tracking_number: 'TRK-12345-FR',
                  address: '123 Rue de Paris, 75001 Paris',
                  recipient_name: 'Marie Dupont',
                  estimated_delivery_time: '10:30',
                  status: 'pending',
                  notes: 'Code d\'entrée: 1234',
                  position: { lat: 48.856614, lng: 2.352222 }
                },
                {
                  id: 'DL124',
                  tracking_number: 'TRK-12346-FR',
                  address: '45 Avenue des Champs-Élysées, 75008 Paris',
                  recipient_name: 'Jean Martin',
                  estimated_delivery_time: '11:15',
                  status: 'pending',
                  notes: '3ème étage, porte droite',
                  position: { lat: 48.869681, lng: 2.307199 }
                },
                {
                  id: 'DL125',
                  tracking_number: 'TRK-12347-FR',
                  address: '36 Rue du Louvre, 75001 Paris',
                  recipient_name: 'Sophie Bernard',
                  estimated_delivery_time: '12:00',
                  status: 'delivered',
                  delivery_time: '11:55',
                  notes: '',
                  position: { lat: 48.863419, lng: 2.341208 }
                }
              ],
              total_distance: 15.4,
              total_deliveries: 3,
              completed_deliveries: 1
            },
            {
              id: 'RT12346',
              date: new Date(Date.now() + 86400000), // Tomorrow
              status: 'scheduled',
              deliveries: [
                {
                  id: 'DL126',
                  tracking_number: 'TRK-12348-FR',
                  address: '6 Place du Trocadéro, 75016 Paris',
                  recipient_name: 'Thomas Lefebvre',
                  estimated_delivery_time: '09:30',
                  status: 'pending',
                  notes: '',
                  position: { lat: 48.862794, lng: 2.287181 }
                },
                {
                  id: 'DL127',
                  tracking_number: 'TRK-12349-FR',
                  address: '20 Rue de Rivoli, 75004 Paris',
                  recipient_name: 'Claire Dubois',
                  estimated_delivery_time: '10:15',
                  status: 'pending',
                  notes: 'Attention: fragile',
                  position: { lat: 48.856054, lng: 2.351426 }
                }
              ],
              total_distance: 12.8,
              total_deliveries: 2,
              completed_deliveries: 0
            }
          ];
          
          setRoutes(mockRoutes);
          
          // Set the first route as selected by default if it exists and is today's route
          if (mockRoutes.length > 0) {
            const todayRoutes = mockRoutes.filter(route => 
              new Date(route.date).toDateString() === new Date().toDateString()
            );
            if (todayRoutes.length > 0) {
              setSelectedRoute(todayRoutes[0]);
            }
          }
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching routes:', error);
        toast.error('Erreur lors du chargement des itinéraires');
        setLoading(false);
      }
    };
    
    fetchRoutes();
    
    // Initialize the map (in a real app you would use a map library like Google Maps or Leaflet)
    const initMap = () => {
      // This is just a mock function to simulate map initialization
      setTimeout(() => {
        setMapLoaded(true);
      }, 1500);
    };
    
    initMap();
  }, []);

  useEffect(() => {
    if (activeRoute && !mapLoaded && document.getElementById('route-map')) {
      // Initialize map
      mapInstanceRef.current = L.map('route-map').setView([46.2276, 2.2137], 5); // Center of France
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      
      // Store reference to the map
      mapRef.current = mapInstanceRef.current;
      
      // Create waypoints from shipments for the selected route
      const createRouteWaypoints = async () => {
        try {
          // Start with the first pickup location
          const waypoints = [];
          
          // Add all shipment locations in order (first pickups, then deliveries)
          if (activeRoute.shipments && activeRoute.shipments.length > 0) {
            // First add all pickups
            for (const shipment of activeRoute.shipments) {
              const geocoded = await geocodeAddress(shipment.origin);
              if (geocoded) {
                waypoints.push(L.latLng(geocoded.lat, geocoded.lon));
              }
            }
            
            // Then add all deliveries
            for (const shipment of activeRoute.shipments) {
              const geocoded = await geocodeAddress(shipment.destination);
              if (geocoded) {
                waypoints.push(L.latLng(geocoded.lat, geocoded.lon));
              }
            }
          }
          
          if (waypoints.length > 1) {
            // Create routing control with all waypoints
            const routingControl = L.Routing.control({
              waypoints: waypoints,
              routeWhileDragging: false,
              lineOptions: {
                styles: [{ color: '#000', weight: 4 }]
              },
              createMarker: function(i, waypoint, n) {
                // Use different colors for pickup and delivery
                const isPickup = i < activeRoute.shipments.length;
                return L.marker(waypoint.latLng, {
                  draggable: false,
                  icon: L.icon({
                    iconUrl: isPickup ? 
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
          console.error("Error creating route waypoints:", error);
        }
      };
      
      createRouteWaypoints();
      setMapLoaded(true);
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [activeRoute, mapLoaded]);
  
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
  
  const updateDeliveryStatus = (deliveryId, status) => {
    // In a real app, you would call your API to update the delivery status
    setRoutes(prevRoutes => {
      return prevRoutes.map(route => {
        const updatedDeliveries = route.deliveries.map(delivery => {
          if (delivery.id === deliveryId) {
            const updatedDelivery = {
              ...delivery,
              status,
              delivery_time: status === 'delivered' ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : delivery.delivery_time
            };
            
            if (status === 'delivered') {
              toast.success(`Livraison marquée comme livrée: ${delivery.tracking_number}`);
            } else if (status === 'failed') {
              toast.info(`Livraison marquée comme échouée: ${delivery.tracking_number}`);
            }
            
            return updatedDelivery;
          }
          return delivery;
        });
        
        const completedCount = updatedDeliveries.filter(d => d.status === 'delivered').length;
        
        if (route.deliveries.some(d => d.id === deliveryId)) {
          return {
            ...route,
            deliveries: updatedDeliveries,
            completed_deliveries: completedCount
          };
        }
        return route;
      });
    });
    
    // Update the selected route if it contains the delivery
    if (selectedRoute && selectedRoute.deliveries.some(d => d.id === deliveryId)) {
      setSelectedRoute(prev => {
        const updatedDeliveries = prev.deliveries.map(delivery => {
          if (delivery.id === deliveryId) {
            return {
              ...delivery,
              status,
              delivery_time: status === 'delivered' ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : delivery.delivery_time
            };
          }
          return delivery;
        });
        
        const completedCount = updatedDeliveries.filter(d => d.status === 'delivered').length;
        
        return {
          ...prev,
          deliveries: updatedDeliveries,
          completed_deliveries: completedCount
        };
      });
    }
  };
  
  const filteredRoutes = routes.filter(route => {
    const routeDate = new Date(route.date).toDateString();
    const today = new Date().toDateString();
    
    if (activeTab === 'today') {
      return routeDate === today;
    } else if (activeTab === 'upcoming') {
      return new Date(route.date) > new Date() && routeDate !== today;
    } else if (activeTab === 'completed') {
      return route.completed_deliveries === route.total_deliveries && route.total_deliveries > 0;
    }
    return true;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mes itinéraires</h1>
        <button 
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 inline-flex items-center"
          onClick={() => {
            // In a real app, you would optimize the route
            toast.info('Optimisation de l\'itinéraire en cours...');
          }}
        >
          <FaDirections className="mr-2" />
          Optimiser l'itinéraire
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'today'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('today')}
          >
            Aujourd'hui
          </button>
          <button
            className={`${
              activeTab === 'upcoming'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('upcoming')}
          >
            À venir
          </button>
          <button
            className={`${
              activeTab === 'completed'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('completed')}
          >
            Terminés
          </button>
        </nav>
      </div>
      
      {filteredRoutes.length === 0 ? (
        <div className="text-center py-8">
          <FaTruck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun itinéraire</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'today' && "Vous n'avez pas d'itinéraire prévu pour aujourd'hui."}
            {activeTab === 'upcoming' && "Vous n'avez pas d'itinéraires à venir."}
            {activeTab === 'completed' && "Vous n'avez pas encore d'itinéraires terminés."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Routes List */}
          <div className="md:col-span-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  {activeTab === 'today' && "Itinéraires du jour"}
                  {activeTab === 'upcoming' && "Itinéraires à venir"}
                  {activeTab === 'completed' && "Itinéraires terminés"}
                </h2>
            </div>
              <div className="divide-y divide-gray-200">
                {filteredRoutes.map(route => (
                  <div 
                    key={route.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedRoute?.id === route.id ? 'bg-gray-50' : ''}`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{route.id}</p>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            route.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            route.status === 'in_progress' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {route.status === 'completed' ? 'Terminé' : 
                             route.status === 'in_progress' ? 'En cours' : 
                             'Planifié'}
                          </span>
                    </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(route.date).toLocaleDateString()} - {route.total_deliveries} livraisons
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{route.completed_deliveries}/{route.total_deliveries}</p>
                        <p className="text-xs text-gray-500">{route.total_distance} km</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-black h-2.5 rounded-full" 
                        style={{ width: `${(route.completed_deliveries / route.total_deliveries) * 100}%` }}
                      ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Route Details and Map */}
          <div className="md:col-span-8">
            {selectedRoute ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Détails de l'itinéraire {selectedRoute.id}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedRoute.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-2">Carte de la Route</h3>
                  <div id="route-map" style={{ height: '500px', width: '100%' }} className="rounded-lg leaflet-container"></div>
                </div>
                
                {/* Deliveries List */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Livraisons de la journée</h3>
                  <div className="divide-y divide-gray-200">
                    {selectedRoute.deliveries.map((delivery, index) => (
                      <div key={delivery.id} className="py-4">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            delivery.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            delivery.status === 'failed' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-black'
                          }`}>
                            {delivery.status === 'delivered' ? 
                              <FaCheckCircle /> : 
                              delivery.status === 'failed' ?
                              <FaExclamationTriangle /> :
                              <FaClock />
                            }
              </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                <div>
                                <p className="text-sm font-medium text-gray-900">Livraison #{index + 1}: {delivery.tracking_number}</p>
                                <p className="text-xs text-gray-500">{delivery.address}</p>
                    </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {delivery.status === 'delivered' ? delivery.delivery_time : delivery.estimated_delivery_time}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {delivery.status === 'delivered' ? 'Livré' : delivery.status === 'failed' ? 'Échec' : 'Prévu'}
                                </p>
                  </div>
                </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Destinataire: {delivery.recipient_name}
                            </p>
                            {delivery.notes && (
                              <p className="text-xs text-gray-500 mt-1 italic">
                                Note: {delivery.notes}
                              </p>
                            )}
                            
                            {delivery.status === 'pending' && (
                              <div className="mt-2 flex space-x-2">
                                <button
                                  onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <FaCheckCircle className="mr-1" />
                                  Marquer comme livré
                                </button>
                                <button
                                  onClick={() => updateDeliveryStatus(delivery.id, 'failed')}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <FaExclamationTriangle className="mr-1" />
                                  Problème de livraison
                                </button>
                              </div>
                            )}
                </div>
              </div>
                    </div>
                    ))}
                  </div>
                </div>

                {/* Route Stats */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                      <p className="text-sm text-gray-500">Distance totale</p>
                      <p className="font-bold text-gray-900">{selectedRoute.total_distance} km</p>
                    </div>
              <div>
                      <p className="text-sm text-gray-500">Livraisons</p>
                      <p className="font-bold text-gray-900">{selectedRoute.completed_deliveries} / {selectedRoute.total_deliveries}</p>
          </div>
                    <div>
                      <p className="text-sm text-gray-500">Progression</p>
                      <p className="font-bold text-gray-900">
                        {selectedRoute.total_deliveries > 0 
                          ? Math.round((selectedRoute.completed_deliveries / selectedRoute.total_deliveries) * 100) 
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <FaMapMarkedAlt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sélectionnez un itinéraire</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choisissez un itinéraire dans la liste pour afficher les détails.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverRoutes; 
