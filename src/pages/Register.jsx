import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTruck, FaCar, FaCreditCard, FaUserTie, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    birth_date: '',
    address: '',
    city: '',
    postal_code: '',
    // Driver-specific fields
    vehicle_type: '',
    vehicle_plate: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: '',
    license_number: '',
    // Bank information
    bank_name: '',
    bank_account_number: '',
    bank_iban: '',
    bank_bic: '',
    bank_account_holder: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePostalCode = (code) => {
    const postalCodeRegex = /^[0-9]{5}$/;
    return postalCodeRegex.test(code);
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 2:
        if (!formData.first_name.trim()) {
          newErrors.first_name = 'Le prénom est requis';
        }
        if (!formData.last_name.trim()) {
          newErrors.last_name = 'Le nom est requis';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'L\'email est requis';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Format d\'email invalide';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Le numéro de téléphone est requis';
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = 'Format de numéro de téléphone invalide';
        }
        if (!formData.birth_date) {
          newErrors.birth_date = 'La date de naissance est requise';
        }
        if (!formData.address.trim()) {
          newErrors.address = 'L\'adresse est requise';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'La ville est requise';
        }
        if (!formData.postal_code.trim()) {
          newErrors.postal_code = 'Le code postal est requis';
        } else if (!validatePostalCode(formData.postal_code)) {
          newErrors.postal_code = 'Format de code postal invalide';
        }
        break;
      case 3:
        if (userType === 'livreur') {
          if (!formData.vehicle_type) {
            newErrors.vehicle_type = 'Le type de véhicule est requis';
          }
          if (!formData.vehicle_plate.trim()) {
            newErrors.vehicle_plate = 'La plaque d\'immatriculation est requise';
          }
          if (!formData.vehicle_brand.trim()) {
            newErrors.vehicle_brand = 'La marque du véhicule est requise';
          }
          if (!formData.vehicle_model.trim()) {
            newErrors.vehicle_model = 'Le modèle du véhicule est requis';
          }
          if (!formData.vehicle_year) {
            newErrors.vehicle_year = 'L\'année du véhicule est requise';
          }
          if (!formData.license_number.trim()) {
            newErrors.license_number = 'Le numéro de permis est requis';
          }
        } else {
          if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
          } else if (formData.password.length < 8) {
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
          }
          if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
          } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
          }
        }
        break;
      case 4:
        // Only validate bank information for livreur users
        if (userType === 'livreur') {
          if (!formData.bank_name.trim()) {
            newErrors.bank_name = 'Le nom de la banque est requis';
          }
          if (!formData.bank_account_number.trim()) {
            newErrors.bank_account_number = 'Le numéro de compte est requis';
          }
          if (!formData.bank_iban.trim()) {
            newErrors.bank_iban = 'L\'IBAN est requis';
          }
          if (!formData.bank_bic.trim()) {
            newErrors.bank_bic = 'Le BIC est requis';
          }
          if (!formData.bank_account_holder.trim()) {
            newErrors.bank_account_holder = 'Le titulaire du compte est requis';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      role: type
    }));
    setStep(2);
  };

  const handleNextStep = (e, nextStep) => {
    e.preventDefault();
    if (validateStep(step)) {
      setStep(nextStep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateStep(step)) {
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword from the data being sent
      const { confirmPassword, ...submitData } = formData;

      // Remove bank information for expediteur users
      if (userType === 'expediteur') {
        delete submitData.bank_name;
        delete submitData.bank_account_number;
        delete submitData.bank_iban;
        delete submitData.bank_bic;
        delete submitData.bank_account_holder;
      }

      // Use API service instead of direct fetch with hardcoded URL
      const response = userType === 'livreur' 
        ? await authAPI.registerDriver(submitData)
        : await authAPI.registerClient(submitData);

      console.log('Registration response:', response.data); // Debug log

      // Clear form data from localStorage
      localStorage.removeItem('registrationForm');
      
      // Show success message and redirect to login
      alert('Inscription réussie! Veuillez vérifier votre email pour activer votre compte.');
      navigate('/login', { 
        state: { 
          successMessage: 'Votre compte a été créé avec succès! Veuillez vous connecter.',
          email: formData.email
        } 
      });
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
    ) : null;
  };

  const renderStep1 = () => (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Choisissez votre type de compte</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <button
          onClick={() => handleUserTypeSelect('expediteur')}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaUserTie className="w-16 h-16 text-black mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Client</h3>
          <p className="text-gray-600 mt-2">Je souhaite envoyer des colis</p>
        </button>
        <button
          onClick={() => handleUserTypeSelect('livreur')}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaTruck className="w-16 h-16 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Livreur</h3>
          <p className="text-gray-600 mt-2">Je souhaite livrer des colis</p>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
      <form onSubmit={(e) => handleNextStep(e, 3)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.first_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Votre prénom"
            />
            {renderError('first_name')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.last_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Votre nom"
            />
            {renderError('last_name')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="votre@email.com"
            />
            {renderError('email')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="06 12 34 56 78"
            />
            {renderError('phone')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.birth_date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {renderError('birth_date')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Votre adresse"
            />
            {renderError('address')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Votre ville"
              />
              {renderError('city')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Code postal</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.postal_code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="75000"
              />
              {renderError('postal_code')}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Retour
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
          >
            Suivant
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {userType === 'livreur' ? 'Informations du véhicule' : 'Mot de passe'}
      </h2>
      <form onSubmit={(e) => userType === 'expediteur' ? handleSubmit(e) : handleNextStep(e, 4)}>
        {userType === 'livreur' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type de véhicule</label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.vehicle_type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un type</option>
                <option value="car">Voiture</option>
                <option value="van">Fourgon</option>
                <option value="truck">Camion</option>
                <option value="motorcycle">Moto</option>
              </select>
              {renderError('vehicle_type')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plaque d'immatriculation</label>
              <input
                type="text"
                name="vehicle_plate"
                value={formData.vehicle_plate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.vehicle_plate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="AB-123-CD"
              />
              {renderError('vehicle_plate')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marque du véhicule</label>
              <input
                type="text"
                name="vehicle_brand"
                value={formData.vehicle_brand}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.vehicle_brand ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Renault"
              />
              {renderError('vehicle_brand')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Modèle du véhicule</label>
              <input
                type="text"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.vehicle_model ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Clio"
              />
              {renderError('vehicle_model')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Année du véhicule</label>
              <input
                type="number"
                name="vehicle_year"
                value={formData.vehicle_year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.vehicle_year ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="2020"
              />
              {renderError('vehicle_year')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de permis</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                  errors.license_number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123456789"
              />
              {renderError('license_number')}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm focus:ring-black focus:border-black pr-10 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {renderError('password')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm focus:ring-black focus:border-black pr-10 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {renderError('confirmPassword')}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Retour
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
          >
            {userType === 'expediteur' ? (loading ? 'Inscription en cours...' : 'S\'inscrire') : 'Suivant'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations bancaires</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la banque</label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.bank_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="BNP Paribas"
            />
            {renderError('bank_name')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de compte</label>
            <input
              type="text"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.bank_account_number ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="123456789"
            />
            {renderError('bank_account_number')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IBAN</label>
            <input
              type="text"
              name="bank_iban"
              value={formData.bank_iban}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.bank_iban ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="FR7630006000011234567890189"
            />
            {renderError('bank_iban')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BIC</label>
            <input
              type="text"
              name="bank_bic"
              value={formData.bank_bic}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.bank_bic ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="BNPAFRPP"
            />
            {renderError('bank_bic')}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Titulaire du compte</label>
            <input
              type="text"
              name="bank_account_holder"
              value={formData.bank_account_holder}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-black focus:border-black ${
                errors.bank_account_holder ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {renderError('bank_account_holder')}
          </div>
        </div>
        {errors.submit && (
          <div className="mt-4 text-sm text-red-600">
            {errors.submit}
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Retour
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default Register;