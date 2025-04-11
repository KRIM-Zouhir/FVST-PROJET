import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaCar, FaIdCard, FaCreditCard, FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, refreshAuthToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    // Livreur specific fields
    vehicle_type: '',
    vehicle_plate: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: '',
    license_number: '',
    // Bank info
    bank_name: '',
    bank_account_number: '',
    bank_iban: '',
    bank_bic: '',
    bank_account_holder: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (user) {
      // Initialize form with user data
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        // Livreur specific fields
        vehicle_type: user.vehicle_type || '',
        vehicle_plate: user.vehicle_plate || '',
        vehicle_brand: user.vehicle_brand || '',
        vehicle_model: user.vehicle_model || '',
        vehicle_year: user.vehicle_year || '',
        license_number: user.license_number || '',
        // Bank info
        bank_name: user.bank_name || '',
        bank_account_number: user.bank_account_number || '',
        bank_iban: user.bank_iban || '',
        bank_bic: user.bank_bic || '',
        bank_account_holder: user.bank_account_holder || '',
      });
      setInitialLoad(false);
    }
  }, [user]);

  // If we encounter an auth error, try to refresh the token
  useEffect(() => {
    // Only try to refresh if we're not in the initial loading state
    if (!initialLoad && !user) {
      const attemptRefresh = async () => {
        const success = await refreshAuthToken();
        if (!success) {
          toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        }
      };
      
      attemptRefresh();
    }
  }, [user, initialLoad, refreshAuthToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      console.error('Profile update error:', error);
      let errorMsg = 'Erreur lors de la mise à jour du profil';
      
      if (error.response) {
        errorMsg = error.response.data?.message || errorMsg;
      }
      
      toast.error(errorMsg);
      
      // Try to refresh token if unauthorized
      if (error.response && error.response.status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          toast.info("Session rafraîchie. Veuillez réessayer.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to user data
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        // Livreur specific fields
        vehicle_type: user.vehicle_type || '',
        vehicle_plate: user.vehicle_plate || '',
        vehicle_brand: user.vehicle_brand || '',
        vehicle_model: user.vehicle_model || '',
        vehicle_year: user.vehicle_year || '',
        license_number: user.license_number || '',
        // Bank info
        bank_name: user.bank_name || '',
        bank_account_number: user.bank_account_number || '',
        bank_iban: user.bank_iban || '',
        bank_bic: user.bank_bic || '',
        bank_account_holder: user.bank_account_holder || '',
      });
    }
    setIsEditing(false);
  };

  // In case we're still loading or user is null
  if (initialLoad || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto mt-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-2">Session expirée</h2>
          <p className="text-gray-700 mb-4">
            Votre session a expiré ou vous n'êtes pas connecté. Veuillez vous reconnecter pour accéder à votre profil.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-black text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center">
              <FaUser className="mr-3" />
              Mon Profil
            </h1>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaEdit className="inline mr-2" />
                Modifier
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  <FaTimes className="inline mr-2" />
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                  disabled={loading}
                >
                  <FaSave className="inline mr-2" />
                  Enregistrer
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-100 mt-2">
            {user.role === 'expediteur' ? 'Client' : user.role === 'livreur' ? 'Livreur' : 'Admin'} • Membre depuis {new Date(user.created_at || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Informations personnelles</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                  />
                </div>

                {/* Livreur-specific fields */}
                {user.role === 'livreur' && (
                  <>
                    <div className="col-span-2">
                      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Informations du véhicule</h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type de véhicule</label>
                      <select
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      >
                        <option value="">Sélectionner</option>
                        <option value="car">Voiture</option>
                        <option value="van">Camionnette</option>
                        <option value="truck">Camion</option>
                        <option value="motorcycle">Moto</option>
                        <option value="bicycle">Vélo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plaque d'immatriculation</label>
                      <input
                        type="text"
                        name="vehicle_plate"
                        value={formData.vehicle_plate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                      <input
                        type="text"
                        name="vehicle_brand"
                        value={formData.vehicle_brand}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                      <input
                        type="text"
                        name="vehicle_model"
                        value={formData.vehicle_model}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                      <input
                        type="text"
                        name="vehicle_year"
                        value={formData.vehicle_year}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de permis</label>
                      <input
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div className="col-span-2">
                      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Informations bancaires</h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la banque</label>
                      <input
                        type="text"
                        name="bank_name"
                        value={formData.bank_name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire du compte</label>
                      <input
                        type="text"
                        name="bank_account_holder"
                        value={formData.bank_account_holder}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                      <input
                        type="text"
                        name="bank_iban"
                        value={formData.bank_iban}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BIC</label>
                      <input
                        type="text"
                        name="bank_bic"
                        value={formData.bank_bic}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
                      />
                    </div>
                  </>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <FaUser className="mt-1 text-gray-700 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="mt-1 text-gray-700 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhone className="mt-1 text-gray-700 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="font-medium">{user.phone || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 text-gray-700 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Adresse</p>
                      <p className="font-medium">
                        {user.address ? (
                          <>
                            {user.address}
                            <br />
                            {user.postal_code} {user.city}
                          </>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Livreur-specific information */}
              {user.role === 'livreur' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-8">Informations du véhicule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <FaCar className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Type de véhicule</p>
                          <p className="font-medium">
                            {user.vehicle_type === 'car' ? 'Voiture' :
                             user.vehicle_type === 'van' ? 'Camionnette' :
                             user.vehicle_type === 'truck' ? 'Camion' :
                             user.vehicle_type === 'motorcycle' ? 'Moto' :
                             user.vehicle_type === 'bicycle' ? 'Vélo' :
                             "Non spécifié"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaCar className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Véhicule</p>
                          <p className="font-medium">
                            {user.vehicle_brand ? (
                              <>
                                {user.vehicle_brand} {user.vehicle_model} {user.vehicle_year || ''}
                              </>
                            ) : (
                              "-"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaIdCard className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Plaque d'immatriculation</p>
                          <p className="font-medium">{user.vehicle_plate || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaIdCard className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Numéro de permis</p>
                          <p className="font-medium">{user.license_number || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-8">Informations bancaires</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <FaCreditCard className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Banque</p>
                          <p className="font-medium">{user.bank_name || "-"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaUser className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Titulaire du compte</p>
                          <p className="font-medium">{user.bank_account_holder || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaCreditCard className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">IBAN</p>
                          <p className="font-medium">
                            {user.bank_iban ? (
                              <span className="font-mono">
                                {/* Only show first and last 4 characters for security */}
                                {user.bank_iban.substring(0, 4)}
                                {'•'.repeat(Math.max(0, user.bank_iban.length - 8))}
                                {user.bank_iban.substring(user.bank_iban.length - 4)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaCreditCard className="mt-1 text-gray-700 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">BIC</p>
                          <p className="font-medium">{user.bank_bic || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;