import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, 
  FaCheck, FaTimes, FaSearch, FaSave, FaMapMarkedAlt
} from 'react-icons/fa';
import api from '../../services/api';
import './Admin.css';

const RelayPoints = () => {
  const { isAuthenticated, user, refreshAuthToken } = useAuth();
  const [relayPoints, setRelayPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    coordinates: { lat: '', lng: '' },
    contact_name: '',
    contact_phone: '',
    storage_capacity: '',
    is_active: true
  });

  // Initial data loading
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.href = '/login';
      return;
    }

    const fetchRelayPoints = async () => {
      try {
        setLoading(true);
        const response = await api.admin.getRelayPoints();
        setRelayPoints(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            await refreshAuthToken();
            // Retry after token refresh
            fetchRelayPoints();
          } catch (refreshError) {
            toast.error('Authentication error. Please log in again.');
            window.location.href = '/login';
          }
        } else {
          toast.error('Failed to load relay points');
          setLoading(false);
        }
      }
    };

    fetchRelayPoints();
  }, [isAuthenticated, user, refreshAuthToken]);

  // Filtering relay points based on search term
  const filteredRelayPoints = relayPoints.filter(point => 
    point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'lat' || name === 'lng') {
      setFormData({
        ...formData,
        coordinates: {
          ...formData.coordinates,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Start editing a relay point
  const handleEdit = (point) => {
    setIsEditing(true);
    setEditingId(point.id);
    setFormData({
      name: point.name,
      address: point.address,
      city: point.city,
      postal_code: point.postal_code,
      coordinates: point.coordinates,
      contact_name: point.contact_name,
      contact_phone: point.contact_phone,
      storage_capacity: point.storage_capacity,
      is_active: point.is_active
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      postal_code: '',
      coordinates: { lat: '', lng: '' },
      contact_name: '',
      contact_phone: '',
      storage_capacity: '',
      is_active: true
    });
  };

  // Show the add form
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      postal_code: '',
      coordinates: { lat: '', lng: '' },
      contact_name: '',
      contact_phone: '',
      storage_capacity: '',
      is_active: true
    });
  };

  // Submit handler for adding/editing relay points
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing relay point
        const response = await api.admin.updateRelayPoint(editingId, formData);
        
        // Update the relay points list
        const updatedPoints = relayPoints.map(point => 
          point.id === editingId ? response.data : point
        );
        setRelayPoints(updatedPoints);
        
        toast.success('Relay point updated successfully');
      } else {
        // Create new relay point
        const response = await api.admin.createRelayPoint(formData);
        
        // Add to the relay points list
        setRelayPoints([...relayPoints, response.data]);
        
        toast.success('Relay point created successfully');
      }
      
      // Reset form
      handleCancel();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Delete relay point
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this relay point?')) {
      try {
        await api.admin.deleteRelayPoint(id);
        
        // Remove from the relay points list
        const updatedPoints = relayPoints.filter(point => point.id !== id);
        setRelayPoints(updatedPoints);
        
        toast.success('Relay point deleted successfully');
      } catch (error) {
        toast.error('Failed to delete relay point');
      }
    }
  };

  // Toggle relay point active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.admin.updateRelayPoint(id, { is_active: !currentStatus });
      
      // Update the relay points list
      const updatedPoints = relayPoints.map(point => 
        point.id === id ? { ...point, is_active: !currentStatus } : point
      );
      setRelayPoints(updatedPoints);
      
      toast.success(`Relay point ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update relay point status');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading relay points...</p>
      </div>
    );
  }

  return (
    <div className="admin-relay-points">
      <div className="admin-header">
        <h1><FaMapMarkerAlt /> Relay Points Management</h1>
        <button onClick={handleShowAddForm} className="admin-add-button">
          <FaPlus /> Add Relay Point
        </button>
      </div>

      <div className="admin-search-bar">
        <FaSearch />
        <input 
          type="text" 
          placeholder="Search relay points..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {(showAddForm || isEditing) && (
        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <h2>{isEditing ? 'Edit Relay Point' : 'Add New Relay Point'}</h2>
            
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Postal Code</label>
                <input 
                  type="text" 
                  name="postal_code" 
                  value={formData.postal_code} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Latitude</label>
                <input 
                  type="text" 
                  name="lat" 
                  value={formData.coordinates.lat} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Longitude</label>
                <input 
                  type="text" 
                  name="lng" 
                  value={formData.coordinates.lng} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Contact Name</label>
                <input 
                  type="text" 
                  name="contact_name" 
                  value={formData.contact_name} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Contact Phone</label>
                <input 
                  type="text" 
                  name="contact_phone" 
                  value={formData.contact_phone} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Storage Capacity</label>
                <input 
                  type="number" 
                  name="storage_capacity" 
                  value={formData.storage_capacity} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    checked={formData.is_active} 
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>
            </div>
            
            <div className="admin-form-actions">
              <button type="submit" className="admin-action-btn save">
                <FaSave /> {isEditing ? 'Update' : 'Save'}
              </button>
              <button 
                type="button" 
                className="admin-action-btn cancel" 
                onClick={handleCancel}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRelayPoints.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-message">No relay points found</td>
              </tr>
            ) : (
              filteredRelayPoints.map(point => (
                <tr key={point.id}>
                  <td>{point.name}</td>
                  <td>
                    <div className="location-details">
                      <div>{point.address}, {point.city}</div>
                      <div className="postal-code">{point.postal_code}</div>
                    </div>
                  </td>
                  <td>
                    <div>{point.contact_name}</div>
                    <div className="phone-number">{point.contact_phone}</div>
                  </td>
                  <td>{point.storage_capacity} packages</td>
                  <td>
                    <span className={`status-indicator ${point.is_active ? 'active' : 'inactive'}`}>
                      {point.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="admin-action-btn view"
                        title="View on map"
                      >
                        <FaMapMarkedAlt />
                      </button>
                      <button 
                        className="admin-action-btn edit"
                        onClick={() => handleEdit(point)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={`admin-action-btn ${point.is_active ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleActive(point.id, point.is_active)}
                        title={point.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {point.is_active ? <FaTimes /> : <FaCheck />}
                      </button>
                      <button 
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(point.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelayPoints; 