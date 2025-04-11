import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTruck, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaClock, FaUser, FaRoute } from 'react-icons/fa';

const DeliveryHistory = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('delivery_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    avgPerDay: 0
  });
  
  useEffect(() => {
    fetchDeliveryHistory();
  }, []);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [deliveries, searchQuery, statusFilter, dateFilter, sortField, sortDirection]);
  
  const fetchDeliveryHistory = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data
        const today = new Date();
        const mockDeliveries = [
          {
            id: 'DL123',
            tracking_number: 'TRK-12345-FR',
            route_id: 'RT12345',
            status: 'delivered',
            delivery_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14, 30), // Yesterday
            delivery_time: '14:30',
            recipient: {
              name: 'Marie Dupont',
              address: '123 Rue de Paris, 75001 Paris',
              phone: '+33 6 12 34 56 78'
            },
            package: {
              weight: '2.5 kg',
              size: 'Medium'
            },
            signature: true,
            notes: 'Livré à la réception'
          },
          {
            id: 'DL124',
            tracking_number: 'TRK-12346-FR',
            route_id: 'RT12345',
            status: 'delivered',
            delivery_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 15, 45), // Yesterday
            delivery_time: '15:45',
            recipient: {
              name: 'Jean Martin',
              address: '45 Avenue des Champs-Élysées, 75008 Paris',
              phone: '+33 6 98 76 54 32'
            },
            package: {
              weight: '1.2 kg',
              size: 'Small'
            },
            signature: true,
            notes: ''
          },
          {
            id: 'DL125',
            tracking_number: 'TRK-12347-FR',
            route_id: 'RT12345',
            status: 'failed',
            delivery_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 16, 30), // Yesterday
            delivery_time: '16:30',
            recipient: {
              name: 'Sophie Bernard',
              address: '36 Rue du Louvre, 75001 Paris',
              phone: '+33 6 23 45 67 89'
            },
            package: {
              weight: '3.7 kg',
              size: 'Large'
            },
            signature: false,
            notes: 'Destinataire absent'
          },
          {
            id: 'DL126',
            tracking_number: 'TRK-12348-FR',
            route_id: 'RT12344',
            status: 'delivered',
            delivery_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 15), // 2 days ago
            delivery_time: '10:15',
            recipient: {
              name: 'Thomas Lefebvre',
              address: '6 Place du Trocadéro, 75016 Paris',
              phone: '+33 6 34 56 78 90'
            },
            package: {
              weight: '0.8 kg',
              size: 'Small'
            },
            signature: true,
            notes: ''
          },
          {
            id: 'DL127',
            tracking_number: 'TRK-12349-FR',
            route_id: 'RT12344',
            status: 'delivered',
            delivery_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 11, 0), // 2 days ago
            delivery_time: '11:00',
            recipient: {
              name: 'Claire Dubois',
              address: '20 Rue de Rivoli, 75004 Paris',
              phone: '+33 6 45 67 89 01'
            },
            package: {
              weight: '5.2 kg',
              size: 'Large'
            },
            signature: true,
            notes: 'Livré au voisin'
          },
          {
            id: 'DL128',
            tracking_number: 'TRK-12350-FR',
            route_id: 'RT12343',
            status: 'delivered',
            delivery_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 13, 20), // 5 days ago
            delivery_time: '13:20',
            recipient: {
              name: 'Antoine Moreau',
              address: '8 Boulevard Saint-Michel, 75006 Paris',
              phone: '+33 6 56 78 90 12'
            },
            package: {
              weight: '1.8 kg',
              size: 'Medium'
            },
            signature: true,
            notes: ''
          },
          {
            id: 'DL129',
            tracking_number: 'TRK-12351-FR',
            route_id: 'RT12343',
            status: 'failed',
            delivery_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 14, 10), // 5 days ago
            delivery_time: '14:10',
            recipient: {
              name: 'Isabelle Petit',
              address: '75 Rue de Rennes, 75006 Paris',
              phone: '+33 6 67 89 01 23'
            },
            package: {
              weight: '2.1 kg',
              size: 'Medium'
            },
            signature: false,
            notes: 'Adresse introuvable'
          }
        ];
        
        // Calculate stats
        const total = mockDeliveries.length;
        const completed = mockDeliveries.filter(d => d.status === 'delivered').length;
        const failed = mockDeliveries.filter(d => d.status === 'failed').length;
        
        // Get unique dates to calculate avg per day
        const uniqueDates = [...new Set(mockDeliveries.map(d => 
          new Date(d.delivery_date).toDateString()
        ))];
        const avgPerDay = uniqueDates.length > 0 ? (total / uniqueDates.length).toFixed(1) : 0;
        
        setStats({
          total,
          completed,
          failed,
          avgPerDay
        });
        
        setDeliveries(mockDeliveries);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching delivery history:', error);
      toast.error('Erreur lors du chargement de l\'historique des livraisons');
      setLoading(false);
    }
  };
  
  const applyFiltersAndSort = () => {
    let result = [...deliveries];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        delivery =>
          delivery.tracking_number.toLowerCase().includes(query) ||
          delivery.recipient.name.toLowerCase().includes(query) ||
          delivery.recipient.address.toLowerCase().includes(query) ||
          delivery.route_id.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(delivery => delivery.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (dateFilter === 'today') {
        result = result.filter(delivery => 
          new Date(delivery.delivery_date).toDateString() === today.toDateString()
        );
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        result = result.filter(delivery => 
          new Date(delivery.delivery_date).toDateString() === yesterday.toDateString()
        );
      } else if (dateFilter === 'last7days') {
        const last7Days = new Date(startOfToday);
        last7Days.setDate(last7Days.getDate() - 7);
        result = result.filter(delivery => 
          new Date(delivery.delivery_date) >= last7Days
        );
      } else if (dateFilter === 'last30days') {
        const last30Days = new Date(startOfToday);
        last30Days.setDate(last30Days.getDate() - 30);
        result = result.filter(delivery => 
          new Date(delivery.delivery_date) >= last30Days
        );
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'delivery_date') {
        aValue = new Date(a.delivery_date).getTime();
        bValue = new Date(b.delivery_date).getTime();
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
    
    setFilteredDeliveries(result);
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Historique des livraisons</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <FaTruck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total des livraisons
                </dt>
                <dd className="text-xl font-semibold text-gray-900">
                  {stats.total}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Livraisons réussies
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-xl font-semibold text-gray-900">
                    {stats.completed}
                  </div>
                  {stats.total > 0 && (
                    <div className="ml-2 text-sm font-medium text-green-600">
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Échecs de livraison
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-xl font-semibold text-gray-900">
                    {stats.failed}
                  </div>
                  {stats.total > 0 && (
                    <div className="ml-2 text-sm font-medium text-red-600">
                      {Math.round((stats.failed / stats.total) * 100)}%
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <FaRoute className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Moyenne par jour
                </dt>
                <dd className="text-xl font-semibold text-gray-900">
                  {stats.avgPerDay}
                </dd>
              </dl>
            </div>
          </div>
        </div>
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
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="delivered">Livré</option>
              <option value="failed">Échec</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <select
              id="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="last7days">7 derniers jours</option>
              <option value="last30days">30 derniers jours</option>
            </select>
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
                <option value="delivery_date">Date de livraison</option>
                <option value="tracking_number">Numéro de suivi</option>
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
      ) : filteredDeliveries.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <FaTruck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-base font-semibold text-gray-900">Aucune livraison trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
              ? "Aucune livraison ne correspond à vos critères de recherche."
              : "Vous n'avez pas encore effectué de livraisons."}
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
                    onClick={() => handleSort('delivery_date')}
                  >
                    Date
                  </th>
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
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Signature
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {new Date(delivery.delivery_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <FaClock className="mr-1 text-gray-400" />
                          {delivery.delivery_time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.tracking_number}
                        </div>
                        <div className="text-xs text-gray-500">
                          Itinéraire: {delivery.route_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <FaUser className="mr-1 text-gray-400" />
                          {delivery.recipient.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-gray-400" />
                          {delivery.recipient.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        delivery.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {delivery.status === 'delivered' ? 'Livré' : 'Échec'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.signature ? (
                        <span className="text-green-600 flex items-center">
                          <FaCheckCircle className="mr-1" /> Signée
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <FaExclamationTriangle className="mr-1" /> Non signée
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.notes || 'Aucune note'}
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

export default DeliveryHistory; 