import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaUsers, FaShippingFast, FaMapMarkerAlt, FaMoneyBillWave,
  FaUserCheck, FaUserTimes, FaBoxOpen, FaTruck, FaExchangeAlt,
  FaChartLine, FaCalendarAlt, FaSearch, FaBox
} from 'react-icons/fa';
import api from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
  const { user, isAuthenticated, refreshAuthToken } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [relayPoints, setRelayPoints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState('week');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.href = '/login';
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics
        const statsResponse = await api.admin.getStats();
        setStats(statsResponse.data);
        
        // Fetch initial data based on active tab
        if (activeTab === 'users') {
          const usersResponse = await api.admin.getUsers();
          setUsers(usersResponse.data);
        } else if (activeTab === 'shipments') {
          const shipmentsResponse = await api.admin.getShipments();
          setShipments(shipmentsResponse.data);
        } else if (activeTab === 'relayPoints') {
          const relayPointsResponse = await api.admin.getRelayPoints();
          setRelayPoints(relayPointsResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            await refreshAuthToken();
            // Retry after token refresh
            fetchAdminData();
          } catch (refreshError) {
            toast.error('Authentication error. Please log in again.');
            window.location.href = '/login';
          }
        } else {
          toast.error('Failed to load admin data');
          setLoading(false);
        }
      }
    };

    fetchAdminData();
  }, [isAuthenticated, user, activeTab, refreshAuthToken]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  const getFilteredData = () => {
    if (!searchTerm.trim()) return activeTab === 'users' ? users : activeTab === 'shipments' ? shipments : relayPoints;
    
    if (activeTab === 'users') {
      return users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'shipments') {
      return shipments.filter(shipment => 
        shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.recipient_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return relayPoints.filter(point => 
        point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  // Mock function to handle user approval
  const handleApproveUser = async (userId) => {
    try {
      await api.admin.approveUser(userId);
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, verified: true } : user
      );
      setUsers(updatedUsers);
      
      toast.success('User approved successfully');
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  // Mock function to handle relay point activation
  const handleToggleRelayPoint = async (pointId, currentStatus) => {
    try {
      await api.admin.updateRelayPoint(pointId, { is_active: !currentStatus });
      
      // Update local state
      const updatedPoints = relayPoints.map(point => 
        point.id === pointId ? { ...point, is_active: !currentStatus } : point
      );
      setRelayPoints(updatedPoints);
      
      toast.success(`Relay point ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update relay point');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Welcome, {user.first_name} {user.last_name}</span>
        </div>
      </div>

      <div className="admin-navigation">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => handleTabChange('overview')}
        >
          <FaChartLine /> Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => handleTabChange('users')}
        >
          <FaUsers /> Users
        </button>
        <button 
          className={activeTab === 'shipments' ? 'active' : ''} 
          onClick={() => handleTabChange('shipments')}
        >
          <FaShippingFast /> Shipments
        </button>
        <button 
          className={activeTab === 'relayPoints' ? 'active' : ''} 
          onClick={() => handleTabChange('relayPoints')}
        >
          <FaMapMarkerAlt /> Relay Points
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-content">
          <div className="admin-timeframe-selector">
            <button 
              className={timeframe === 'week' ? 'active' : ''} 
              onClick={() => setTimeframe('week')}
            >
              <FaCalendarAlt /> This Week
            </button>
            <button 
              className={timeframe === 'month' ? 'active' : ''} 
              onClick={() => setTimeframe('month')}
            >
              <FaCalendarAlt /> This Month
            </button>
            <button 
              className={timeframe === 'year' ? 'active' : ''} 
              onClick={() => setTimeframe('year')}
            >
              <FaCalendarAlt /> This Year
            </button>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaUsers />
              </div>
              <div className="admin-stat-details">
                <h3>Total Users</h3>
                <p className="admin-stat-number">{stats.totalUsers}</p>
                <p className="admin-stat-change">+{stats.newUsers} new</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaBoxOpen />
              </div>
              <div className="admin-stat-details">
                <h3>Shipments</h3>
                <p className="admin-stat-number">{stats.totalShipments}</p>
                <p className="admin-stat-change">+{stats.newShipments} new</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaTruck />
              </div>
              <div className="admin-stat-details">
                <h3>Active Routes</h3>
                <p className="admin-stat-number">{stats.activeRoutes}</p>
                <p className="admin-stat-change">{stats.completedRoutes} completed</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaMoneyBillWave />
              </div>
              <div className="admin-stat-details">
                <h3>Revenue</h3>
                <p className="admin-stat-number">${stats.totalRevenue}</p>
                <p className="admin-stat-change">+{stats.revenueChange}%</p>
              </div>
            </div>
          </div>

          <div className="admin-charts">
            <div className="admin-chart-container">
              <h3>User Registration</h3>
              <div className="admin-chart-placeholder">
                [User Registration Chart]
              </div>
            </div>
            <div className="admin-chart-container">
              <h3>Shipment Volume</h3>
              <div className="admin-chart-placeholder">
                [Shipment Volume Chart]
              </div>
            </div>
          </div>

          <div className="admin-quick-stats">
            <div className="admin-quick-stat">
              <h4>Client/Driver Ratio</h4>
              <p>{stats.clientCount} : {stats.driverCount}</p>
            </div>
            <div className="admin-quick-stat">
              <h4>Avg. Delivery Time</h4>
              <p>{stats.avgDeliveryTime} hours</p>
            </div>
            <div className="admin-quick-stat">
              <h4>Success Rate</h4>
              <p>{stats.deliverySuccessRate}%</p>
            </div>
            <div className="admin-quick-stat">
              <h4>Relay Points</h4>
              <p>{stats.activeRelayPoints} active</p>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div className="admin-content">
          <div className="admin-search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {getFilteredData().length > 0 ? (
            <>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nom complet</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData().map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                            </div>
                            <div>
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'expediteur' ? (
                              <>
                                <FaBox className="text-xs" />
                                Client
                              </>
                            ) : user.role === 'livreur' ? (
                              <>
                                <FaTruck className="text-xs" />
                                Livreur
                              </>
                            ) : (
                              <>
                                <FaUserCheck className="text-xs" />
                                Admin
                              </>
                            )}
                          </span>
                        </td>
                        <td>
                          <span className={`status-indicator ${user.verified ? 'verified' : 'unverified'}`}>
                            {user.verified ? 'Vérifié' : 'Non vérifié'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-action-btn view" title="Voir les détails">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {!user.verified && (
                              <button
                                className="admin-action-btn approve"
                                title="Approuver l'utilisateur"
                                onClick={() => handleApproveUser(user.id)}
                              >
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            <button className="admin-action-btn edit" title="Modifier">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="admin-action-btn delete" title="Supprimer">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="admin-pagination">
                <button disabled={currentPage === 1}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button disabled={currentPage === 1}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="admin-table-empty">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>Aucun utilisateur trouvé pour cette recherche.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 