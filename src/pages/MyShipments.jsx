import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSearch, FaBoxOpen, FaBox, FaTruck, FaCheckCircle, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const MyShipments = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    fetchShipments();
  }, []);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [shipments, searchQuery, statusFilter, sortField, sortDirection]);
  
  const fetchShipments = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data
        const mockShipments = [
          {
            id: 1,
            tracking_number: 'TRK-12345-FR',
            status: 'delivered',
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            delivered_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
            recipient: {
              name: 'Marie Dupont',
              address: '123 Rue de Paris, 75001 Paris'
            },
            package: {
              weight: '2.5 kg',
              description: 'Vêtements'
            }
          },
          {
            id: 2,
            tracking_number: 'TRK-12346-FR',
            status: 'in_transit',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            estimated_delivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            recipient: {
              name: 'Jean Martin',
              address: '45 Avenue des Champs-Élysées, 75008 Paris'
            },
            package: {
              weight: '1.2 kg',
              description: 'Livres'
            },
            current_location: 'Centre de distribution Paris'
          },
          {
            id: 3,
            tracking_number: 'TRK-12347-FR',
            status: 'processing',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            recipient: {
              name: 'Sophie Bernard',
              address: '36 Rue du Louvre, 75001 Paris'
            },
            package: {
              weight: '3.7 kg',
              description: 'Appareils électroniques'
            }
          },
          {
            id: 4,
            tracking_number: 'TRK-12348-FR',
            status: 'pending',
            created_at: new Date(), // Today
            estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            recipient: {
              name: 'Thomas Lefebvre',
              address: '6 Place du Trocadéro, 75016 Paris'
            },
            package: {
              weight: '0.8 kg',
              description: 'Documents'
            }
          },
          {
            id: 5,
            tracking_number: 'TRK-12349-FR',
            status: 'delivered',
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            delivered_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // 13 days ago
            recipient: {
              name: 'Claire Dubois',
              address: '20 Rue de Rivoli, 75004 Paris'
            },
            package: {
              weight: '5.2 kg',
              description: 'Décoration'
            }
          }
        ];
        
        setShipments(mockShipments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Erreur lors du chargement des expéditions');
      setLoading(false);
    }
  };
  
  const applyFiltersAndSort = () => {
    let result = [...shipments];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        shipment =>
          shipment.tracking_number.toLowerCase().includes(query) ||
          shipment.recipient.name.toLowerCase().includes(query) ||
          shipment.recipient.address.toLowerCase().includes(query) ||
          (shipment.package.description && shipment.package.description.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(shipment => shipment.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'created_at') {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else if (sortField === 'weight') {
        aValue = parseFloat(a.package.weight);
        bValue = parseFloat(b.package.weight);
      } else if (sortField === 'recipient') {
        aValue = a.recipient.name.toLowerCase();
        bValue = b.recipient.name.toLowerCase();
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredShipments(result);
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'in_transit':
        return <FaTruck className="text-black" />;
      case 'processing':
        return <FaBox className="text-yellow-500" />;
      case 'pending':
        return <FaBoxOpen className="text-gray-500" />;
      default:
        return <FaBoxOpen className="text-gray-500" />;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Livré';
      case 'in_transit':
        return 'En livraison';
      case 'processing':
        return 'En préparation';
      case 'pending':
        return 'Commande reçue';
      default:
        return status;
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container-content py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes expéditions</h1>
        <Link
          to="/new-shipment"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nouvelle expédition
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Numéro de suivi, nom du destinataire..."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">Commande reçue</option>
                <option value="processing">En préparation</option>
                <option value="in_transit">En livraison</option>
                <option value="delivered">Livré</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sortField}
                onChange={(e) => handleSort(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="created_at">Date de création</option>
                <option value="weight">Poids</option>
                <option value="recipient">Destinataire</option>
                <option value="status">Statut</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {sortDirection === 'asc' ? (
                  <FaSortAmountUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <FaSortAmountDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {sortDirection === 'asc' ? (
              <FaSortAmountUp className="h-4 w-4 mr-1" />
            ) : (
              <FaSortAmountDown className="h-4 w-4 mr-1" />
            )}
            {sortDirection === 'asc' ? 'Croissant' : 'Décroissant'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-base font-semibold text-gray-900">Aucune expédition trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all' 
              ? "Aucune expédition ne correspond à vos critères de recherche."
              : "Vous n'avez pas encore d'expéditions. Créez votre première expédition en cliquant sur le bouton 'Nouvelle expédition'."}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('tracking_number')}
                  >
                    Numéro de suivi
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Date
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('recipient')}
                  >
                    Destinataire
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Statut
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                          {getStatusIcon(shipment.status)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {shipment.tracking_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {shipment.package.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {shipment.status === 'delivered' 
                            ? `Livré le ${new Date(shipment.delivered_at).toLocaleDateString()}`
                            : shipment.estimated_delivery 
                              ? `Estimé pour le ${new Date(shipment.estimated_delivery).toLocaleDateString()}`
                              : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{shipment.recipient.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-gray-400" />
                          {shipment.recipient.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(shipment.status)}`}>
                        {getStatusText(shipment.status)}
                      </span>
                      {shipment.status === 'in_transit' && shipment.current_location && (
                        <div className="text-xs text-gray-500 mt-1">
                          {shipment.current_location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/track/${shipment.tracking_number}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShipments; 