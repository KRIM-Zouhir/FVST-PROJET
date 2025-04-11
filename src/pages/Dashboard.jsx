import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBox, FaShippingFast, FaClipboardList, FaTruck, FaMapMarkedAlt, FaMoneyBillWave, FaClock, FaCalendarCheck, FaChartLine, FaArrowRight, FaMapPin, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingShipments: 0,
    inProgressShipments: 0,
    deliveredShipments: 0,
    totalShipments: 0,
    // Driver specific
    todayDeliveries: 0,
    completedToday: 0,
    earnings: 0,
    distance: 0
  });
  const [recentShipments, setRecentShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          // Mock data
          setStats({
            pendingShipments: 3,
            inProgressShipments: 2,
            deliveredShipments: 8,
            totalShipments: 13,
            // Driver specific
            todayDeliveries: 5,
            completedToday: 3,
            earnings: 85.50,
            distance: 42
          });
          
          setRecentShipments([
            {
              id: 'SHP12345',
              trackingNumber: 'TRK-12345-FR',
              destination: 'Paris, France',
              status: 'En cours',
              createdAt: new Date(2023, 3, 15),
              recipientName: 'Marie Dupont',
              estimatedDelivery: new Date(2023, 3, 18)
            },
            {
              id: 'SHP12346',
              trackingNumber: 'TRK-12346-FR',
              destination: 'Lyon, France',
              status: 'En attente',
              createdAt: new Date(2023, 3, 16),
              recipientName: 'Jean Martin',
              estimatedDelivery: new Date(2023, 3, 19)
            },
            {
              id: 'SHP12347',
              trackingNumber: 'TRK-12347-FR',
              destination: 'Marseille, France',
              status: 'Livré',
              createdAt: new Date(2023, 3, 10),
              recipientName: 'Sophie Bernard',
              estimatedDelivery: new Date(2023, 3, 14)
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect admins to the admin dashboard
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Render different dashboard based on user role
  if (user.role === 'expediteur') {
    return <ClientDashboard stats={stats} recentShipments={recentShipments} />;
  } else if (user.role === 'livreur') {
    return <DriverDashboard stats={stats} recentShipments={recentShipments} />;
  } else {
    return <div>Dashboard not available for your role.</div>;
  }
};

const ClientDashboard = ({ stats, recentShipments }) => {
  return (
    <div className="container-content py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenue dans votre espace client</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gérez vos expéditions, suivez vos colis et accédez à tous nos services depuis votre espace personnel.
        </p>
      </div>
      
      {/* Main Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <FaBox className="text-white text-4xl mb-4" />
            <h2 className="text-white text-xl font-semibold">Nouvelle expédition</h2>
            <p className="text-blue-100 mt-2">Créez et envoyez un nouveau colis en quelques clics</p>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">
              Remplissez un formulaire simple pour expédier votre colis partout en France rapidement et en toute sécurité.
            </p>
            <Link 
              to="/new-shipment" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 hover:underline"
            >
              Expédier maintenant
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
            <FaClipboardList className="text-white text-4xl mb-4" />
            <h2 className="text-white text-xl font-semibold">Mes expéditions</h2>
            <p className="text-purple-100 mt-2">Consultez et gérez toutes vos expéditions</p>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">
              Visualisez l'historique complet de vos envois, leurs statuts et informations détaillées.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {stats.deliveredShipments} livré{stats.deliveredShipments > 1 ? 's' : ''}
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {stats.inProgressShipments} en cours
              </div>
              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {stats.pendingShipments} en attente
              </div>
            </div>
            <Link 
              to="/my-shipments" 
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 hover:underline"
            >
              Voir toutes mes expéditions
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
            <FaSearch className="text-white text-4xl mb-4" />
            <h2 className="text-white text-xl font-semibold">Suivre un colis</h2>
            <p className="text-teal-100 mt-2">Suivez l'avancement de n'importe quel colis</p>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">
              Entrez simplement le numéro de suivi pour connaître la position et le statut d'un colis.
            </p>
            <Link 
              to="/track" 
              className="inline-flex items-center text-teal-600 font-medium hover:text-teal-800 hover:underline"
            >
              Suivre un colis
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Shipments */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Expéditions récentes</h2>
          <Link to="/my-shipments" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Voir toutes mes expéditions →
          </Link>
        </div>
        
        {recentShipments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentShipments.map(shipment => (
              <div key={shipment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full flex-shrink-0 ${
                      shipment.status === 'Livré' ? 'bg-green-100 text-green-600' : 
                      shipment.status === 'En cours' ? 'bg-blue-100 text-blue-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {shipment.status === 'Livré' ? <FaCalendarCheck className="text-xl" /> : 
                       shipment.status === 'En cours' ? <FaTruck className="text-xl" /> : 
                       <FaClock className="text-xl" />}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium text-gray-900">{shipment.trackingNumber}</h3>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          shipment.status === 'Livré' ? 'bg-green-100 text-green-800' : 
                          shipment.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {shipment.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <FaMapPin className="mr-1" />
                          {shipment.destination}
                        </span>
                        <span>
                          {shipment.status === 'Livré' 
                            ? `Livré le ${shipment.estimatedDelivery.toLocaleDateString()}` 
                            : `Livraison prévue: ${shipment.estimatedDelivery.toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 ml-12 md:ml-0">
                    <Link 
                      to={`/track/${shipment.trackingNumber}`} 
                      className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium"
                    >
                      Suivre
                    </Link>
                    <Link 
                      to={`/shipment-details/${shipment.id}`} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <FaBox className="text-gray-300 text-4xl mx-auto mb-4" />
            <p>Aucune expédition récente à afficher.</p>
            <Link to="/new-shipment" className="mt-2 inline-block text-blue-600 hover:underline">
              Créer votre première expédition
            </Link>
          </div>
        )}
      </div>
      
      {/* Additional Services */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Services complémentaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                <FaMapMarkedAlt className="text-xl" />
              </div>
              <h3 className="font-medium text-gray-900">Points relais</h3>
            </div>
            <p className="text-gray-500 mb-4">
              Trouvez les points relais les plus proches pour vos expéditions.
            </p>
            <Link 
              to="/relay-points" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              Rechercher un point relais →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                <FaMoneyBillWave className="text-xl" />
              </div>
              <h3 className="font-medium text-gray-900">Tarifs & options</h3>
            </div>
            <p className="text-gray-500 mb-4">
              Consultez nos tarifs et options d'expédition adaptés à vos besoins.
            </p>
            <Link 
              to="/pricing" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              Voir nos tarifs →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                <FaClipboardList className="text-xl" />
              </div>
              <h3 className="font-medium text-gray-900">FAQ & Aide</h3>
            </div>
            <p className="text-gray-500 mb-4">
              Trouvez des réponses à vos questions et accédez à notre centre d'aide.
            </p>
            <Link 
              to="/faq" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              Consulter la FAQ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const DriverDashboard = ({ stats, recentShipments }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord livreur</h1>
        <Link 
          to="/driver/routes" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
        >
          <FaMapMarkedAlt className="mr-2" />
          Voir mes itinéraires
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaBox className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Livraisons aujourd'hui</p>
              <p className="text-xl font-bold text-gray-800">{stats.todayDeliveries}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaCalendarCheck className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Complétées aujourd'hui</p>
              <p className="text-xl font-bold text-gray-800">{stats.completedToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Gains du jour</p>
              <p className="text-xl font-bold text-gray-800">{stats.earnings.toFixed(2)} €</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaTruck className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Distance aujourd'hui</p>
              <p className="text-xl font-bold text-gray-800">{stats.distance} km</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Deliveries */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Livraisons du jour</h2>
          <Link to="/driver/routes" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Voir tous les itinéraires
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentShipments.length > 0 ? (
            recentShipments.map(shipment => (
              <div key={shipment.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <span className="text-gray-800">{shipment.trackingNumber}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        shipment.status === 'Livré' ? 'bg-green-100 text-green-800' : 
                        shipment.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Destination: {shipment.destination}
                    </p>
                    <p className="text-sm text-gray-500">
                      Destinataire: {shipment.recipientName}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 space-y-1 text-right">
                    <p className="text-sm text-gray-500">
                      Heure de livraison: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none">
                        Marquer comme livré
                      </button>
                      <Link 
                        to={`/driver/delivery/${shipment.id}`} 
                        className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                      >
                        Détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucune livraison pour aujourd'hui.
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mb-4">
              <FaMapMarkedAlt className="text-2xl" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Mes itinéraires</h3>
            <p className="text-sm text-gray-500 mb-4">
              Consultez vos itinéraires optimisés pour les livraisons du jour.
            </p>
            <Link 
              to="/driver/routes" 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Voir les itinéraires →
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mb-4">
              <FaClipboardList className="text-2xl" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Historique des livraisons</h3>
            <p className="text-sm text-gray-500 mb-4">
              Accédez à l'historique de toutes vos livraisons passées.
            </p>
            <Link 
              to="/driver/history" 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Voir l'historique →
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mb-4">
              <FaChartLine className="text-2xl" />
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Mes performances</h3>
            <p className="text-sm text-gray-500 mb-4">
              Suivez vos statistiques de livraison et vos performances.
            </p>
            <Link 
              to="/driver/performance" 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Voir mes performances →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;