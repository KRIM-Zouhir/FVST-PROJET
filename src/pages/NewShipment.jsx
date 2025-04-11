import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaBox, FaInfoCircle, FaMapMarkerAlt, FaUser, FaTruck, FaArrowRight, FaCalendarAlt, FaEuroSign, FaArrowLeft, FaCheck } from 'react-icons/fa';

const NewShipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [formData, setFormData] = useState({
    // Package information
    package_type: '',
    package_weight: '',
    package_length: '',
    package_width: '',
    package_height: '',
    package_description: '',
    
    // Recipient information
    recipient_name: '',
    recipient_email: '',
    recipient_phone: '',
    recipient_address: '',
    recipient_city: '',
    recipient_postal_code: '',
    
    // Delivery options
    delivery_type: '',
    delivery_date: '',
    use_relay_point: false,
    relay_point_id: '',
    
    // Payment information
    payment_method: '',
    terms_accepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const validateStep = (currentStep) => {
    const errors = [];
    
    switch (currentStep) {
      case 1:
        if (!formData.package_type) {
          errors.push("Veuillez sélectionner un type de colis");
        }
        if (!formData.package_weight) {
          errors.push("Veuillez entrer le poids du colis");
        } else if (formData.package_weight > 30) {
          errors.push("Le poids maximum est de 30kg");
        }
        if (!formData.package_length || !formData.package_width || !formData.package_height) {
          errors.push("Veuillez entrer les dimensions du colis");
        }
        if (!formData.package_description) {
          errors.push("Veuillez décrire le contenu du colis");
        }
        break;

      case 2:
        if (!formData.recipient_name) {
          errors.push("Veuillez entrer le nom du destinataire");
        }
        if (!formData.recipient_email) {
          errors.push("Veuillez entrer l'email du destinataire");
        }
        if (!formData.recipient_phone) {
          errors.push("Veuillez entrer le numéro de téléphone du destinataire");
        }
        if (!formData.recipient_address) {
          errors.push("Veuillez entrer l'adresse du destinataire");
        }
        if (!formData.recipient_city) {
          errors.push("Veuillez entrer la ville du destinataire");
        }
        if (!formData.recipient_postal_code) {
          errors.push("Veuillez entrer le code postal du destinataire");
        }
        break;

      case 3:
        if (!formData.delivery_type) {
          errors.push("Veuillez sélectionner un type de livraison");
        }
        if (!formData.delivery_date) {
          errors.push("Veuillez sélectionner une date de livraison");
        }
        if (formData.use_relay_point && !formData.relay_point_id) {
          errors.push("Veuillez sélectionner un point relais");
        }
        break;

      case 4:
        if (!formData.payment_method) {
          errors.push("Veuillez sélectionner un mode de paiement");
        }
        if (!formData.terms_accepted) {
          errors.push("Veuillez accepter les conditions générales");
        }
        break;
    }

    if (errors.length > 0) {
      toast.error(
        <div>
          {errors.map((error, index) => (
            <div key={index} className="mb-1">• {error}</div>
          ))}
        </div>
      );
      return false;
    }
    return true;
  };
  
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) {
      return;
    }

    setLoading(true);
    try {
      // Calculate estimated price based on package details and options
      const basePrice = calculateBasePrice(formData);
      const urgencyMultiplier = {
        normal: 1,
        priority: 1.2,
        urgent: 1.5
      }[formData.urgency_level];
      const insurancePrice = formData.insurance_required ? (formData.package_value * 0.05) : 0;
      const totalPrice = basePrice * urgencyMultiplier + insurancePrice;

      // Prepare shipment data
      const shipmentData = {
        ...formData,
        status: 'pending',
        estimated_price: totalPrice,
        created_by: user.id,
        tracking_number: generateTrackingNumber(),
        created_at: new Date().toISOString()
      };

      // Submit to API
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }

      const data = await response.json();
      
      // Show success message with tracking number
      toast.success(`Expédition créée avec succès! Numéro de suivi: ${data.tracking_number}`);
      
      // Redirect to tracking page
      navigate(`/tracking/${data.tracking_number}`);
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Erreur lors de la création de l\'expédition');
    } finally {
      setLoading(false);
    }
  };
  
  const currentYear = new Date().getFullYear();
  const nextTwoYears = [currentYear, currentYear + 1, currentYear + 2];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Helper function to calculate base price
  const calculateBasePrice = (data) => {
    // Base price calculation based on weight and dimensions
    let price = 5; // Minimum price
    
    // Weight-based pricing
    if (data.package_weight <= 1) {
      price += 3;
    } else if (data.package_weight <= 5) {
      price += 5;
    } else if (data.package_weight <= 10) {
      price += 8;
    } else {
      price += 8 + Math.ceil((data.package_weight - 10) / 5) * 3;
    }
    
    // Volume-based adjustment
    const volume = data.package_length * data.package_width * data.package_height;
    if (volume > 50000) { // 50x50x20 cm
      price *= 1.2;
    }
    
    // Special handling fees
    if (data.is_fragile) {
      price *= 1.15;
    }
    if (data.requires_signature) {
      price += 2;
    }
    
    // Delivery type multiplier
    const deliveryMultiplier = {
      standard: 1,
      express: 1.5,
      same_day: 2
    }[data.delivery_type];
    
    price *= deliveryMultiplier;
    
    return Math.round(price * 100) / 100; // Round to 2 decimal places
  };

  // Helper function to generate tracking number
  const generateTrackingNumber = () => {
    const prefix = 'FVST';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  return (
    <div className="container-content min-h-screen py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle expédition</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
              <FaBox />
            </div>
            <span className="text-sm font-medium">Colis</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
              <FaUser />
            </div>
            <span className="text-sm font-medium">Destinataire</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
              <FaTruck />
            </div>
            <span className="text-sm font-medium">Livraison</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step > 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 4 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
              <FaEuroSign />
            </div>
            <span className="text-sm font-medium">Paiement</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 h-full">
        <div className="p-6 h-full">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du colis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de colis</label>
                <select
                    name="package_type"
                    value={formData.package_type}
                  onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="parcel">Colis standard</option>
                    <option value="envelope">Enveloppe</option>
                    <option value="large_package">Grand colis</option>
                    <option value="pallet">Palette</option>
                </select>
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.package_type === 'parcel' && 'Pour les colis jusqu\'à 30kg'}
                    {formData.package_type === 'envelope' && 'Pour les documents et petits objets plats'}
                    {formData.package_type === 'large_package' && 'Pour les colis volumineux jusqu\'à 50kg'}
                    {formData.package_type === 'pallet' && 'Pour les palettes jusqu\'à 800kg'}
                  </p>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                  <input
                    type="number"
                    name="package_weight"
                    value={formData.package_weight}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max={
                      formData.package_type === 'envelope' ? 2 :
                      formData.package_type === 'parcel' ? 30 :
                      formData.package_type === 'large_package' ? 50 :
                      formData.package_type === 'pallet' ? 800 : 30
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.package_weight > (
                    formData.package_type === 'envelope' ? 2 :
                    formData.package_type === 'parcel' ? 30 :
                    formData.package_type === 'large_package' ? 50 :
                    formData.package_type === 'pallet' ? 800 : 30
                  ) && (
                    <p className="mt-1 text-sm text-red-500">
                      Le poids dépasse la limite maximale pour ce type de colis
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longueur (cm)</label>
                  <input
                    type="number"
                    name="package_length"
                    value={formData.package_length}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Largeur (cm)</label>
                  <input
                    type="number"
                    name="package_width"
                    value={formData.package_width}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
              </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hauteur (cm)</label>
                  <input
                    type="number"
                    name="package_height"
                    value={formData.package_height}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
            </div>

            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valeur déclarée (€)</label>
                  <input
                    type="number"
                    name="package_value"
                    value={formData.package_value}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="col-span-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_fragile"
                      id="is_fragile"
                      checked={formData.is_fragile}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_fragile" className="ml-2 block text-sm text-gray-700">
                      Colis fragile (nécessite une manipulation spéciale)
                  </label>
                    </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="requires_signature"
                      id="requires_signature"
                      checked={formData.requires_signature}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requires_signature" className="ml-2 block text-sm text-gray-700">
                      Signature requise à la livraison
                    </label>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description du contenu</label>
                  <textarea
                    name="package_description"
                    value={formData.package_description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez le contenu de votre colis..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du destinataire</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du destinataire"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="recipient_email"
                    value={formData.recipient_email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@exemple.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="recipient_phone"
                    value={formData.recipient_phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
            </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                    name="recipient_address"
                    value={formData.recipient_address}
                      onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Adresse de livraison"
                    />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    name="recipient_city"
                    value={formData.recipient_city}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ville"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    name="recipient_postal_code"
                    value={formData.recipient_postal_code}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Code postal"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Options de livraison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de livraison</label>
                  <select
                    name="delivery_type"
                    value={formData.delivery_type}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard (2-3 jours)</option>
                    <option value="express">Express (24h)</option>
                    <option value="same_day">Même jour</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'urgence</label>
                  <select
                    name="urgency_level"
                    value={formData.urgency_level}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="priority">Prioritaire (+20%)</option>
                    <option value="urgent">Urgent (+50%)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison souhaitée</label>
                <input
                  type="date"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Créneau horaire préféré</label>
                  <select
                    name="preferred_time_slot"
                    value={formData.preferred_time_slot}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pas de préférence</option>
                    <option value="morning">Matin (8h-12h)</option>
                    <option value="afternoon">Après-midi (12h-17h)</option>
                    <option value="evening">Soir (17h-20h)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de livreur préféré</label>
                  <select
                    name="preferred_courier_type"
                    value={formData.preferred_courier_type}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="any">Pas de préférence</option>
                    <option value="professional">Professionnel uniquement</option>
                    <option value="individual">Particulier uniquement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix maximum (€)</label>
                  <input
                    type="number"
                    name="max_price"
                    value={formData.max_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Laissez vide si pas de limite"
                  />
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="use_relay_point"
                      id="use_relay_point"
                      checked={formData.use_relay_point}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="use_relay_point" className="ml-2 block text-sm text-gray-700">
                      Livrer en point relais plutôt qu'à domicile
                    </label>
                  </div>
                  
                  {formData.use_relay_point && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm mb-3">Sélectionnez un point relais proche de l'adresse du destinataire:</p>
                      <select
                        name="relay_point_id"
                        value={formData.relay_point_id}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionner un point relais</option>
                        <option value="relay1">Point Relais - Tabac du Centre (0.5 km)</option>
                        <option value="relay2">Point Relais - Supermarché Express (1.2 km)</option>
                        <option value="relay3">Point Relais - Librairie Dupont (1.8 km)</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="col-span-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="insurance_required"
                      id="insurance_required"
                      checked={formData.insurance_required}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="insurance_required" className="ml-2 block text-sm text-gray-700">
                      Assurance supplémentaire (+5% de la valeur déclarée)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="tracking_notifications"
                      id="tracking_notifications"
                      checked={formData.tracking_notifications}
                  onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tracking_notifications" className="ml-2 block text-sm text-gray-700">
                      Recevoir des notifications de suivi par email et SMS
                    </label>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions de livraison</label>
                  <textarea
                    name="delivery_notes"
                    value={formData.delivery_notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Informations complémentaires pour la livraison (code d'entrée, étage, etc.)"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Paiement</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${formData.payment_method === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setFormData({...formData, payment_method: 'credit_card'})}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="payment_method" 
                        id="credit_card" 
                        value="credit_card"
                        checked={formData.payment_method === 'credit_card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600" 
                      />
                      <label htmlFor="credit_card" className="ml-2 font-medium">Carte bancaire</label>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${formData.payment_method === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setFormData({...formData, payment_method: 'paypal'})}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="payment_method" 
                        id="paypal" 
                        value="paypal"
                        checked={formData.payment_method === 'paypal'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600" 
                      />
                      <label htmlFor="paypal" className="ml-2 font-medium">PayPal</label>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${formData.payment_method === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setFormData({...formData, payment_method: 'bank_transfer'})}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="payment_method" 
                        id="bank_transfer" 
                        value="bank_transfer"
                        checked={formData.payment_method === 'bank_transfer'}
                  onChange={handleChange}
                        className="h-4 w-4 text-blue-600" 
                />
                      <label htmlFor="bank_transfer" className="ml-2 font-medium">Virement bancaire</label>
                    </div>
                  </div>
                </div>
              </div>
              
              {formData.payment_method === 'credit_card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire de la carte</label>
                    <input
                      type="text"
                      name="card_holder"
                      value={formData.card_holder}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NOM PRÉNOM"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="card_expiry_month"
                          value={formData.card_expiry_month}
                          onChange={(e) => setFormData({...formData, card_expiry_month: e.target.value})}
                          className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">MM</option>
                          {months.map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        <select
                          name="card_expiry_year"
                          value={formData.card_expiry_year}
                          onChange={(e) => setFormData({...formData, card_expiry_year: e.target.value})}
                          className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">AAAA</option>
                          {nextTwoYears.map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="card_cvv"
                        value={formData.card_cvv}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Order Summary */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg relative z-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Récapitulatif de la commande</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type de colis:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.package_type === 'parcel' && 'Colis standard'}
                      {formData.package_type === 'envelope' && 'Enveloppe'}
                      {formData.package_type === 'large_package' && 'Grand colis'}
                      {formData.package_type === 'pallet' && 'Palette'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Poids:</span>
                    <span className="text-gray-900 font-medium">{formData.package_weight} kg</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expéditeur:</span>
                    <span className="text-gray-900 font-medium">{formData.sender_name}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Destinataire:</span>
                    <span className="text-gray-900 font-medium">{formData.recipient_name}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type de livraison:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.delivery_type === 'standard' && 'Standard (2-3 jours)'}
                      {formData.delivery_type === 'express' && 'Express (24h)'}
                      {formData.delivery_type === 'same_day' && 'Même jour'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Niveau d'urgence:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.urgency_level === 'normal' && 'Normal'}
                      {formData.urgency_level === 'priority' && 'Prioritaire (+20%)'}
                      {formData.urgency_level === 'urgent' && 'Urgent (+50%)'}
                    </span>
                  </div>
                  
                  <hr className="my-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix de base:</span>
                    <span className="text-gray-900 font-medium">{calculateBasePrice(formData).toFixed(2)} €</span>
            </div>

                  {formData.urgency_level !== 'normal' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Majoration urgence:</span>
                      <span className="text-gray-900 font-medium">
                        {formData.urgency_level === 'priority' ? '+20%' : '+50%'}
                      </span>
                    </div>
                  )}
                  
                  {formData.insurance_required && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assurance:</span>
                      <span className="text-gray-900 font-medium">
                        {(formData.package_value * 0.05).toFixed(2)} €
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-base font-bold border-t border-gray-300 pt-2 mt-2">
                    <span>Total:</span>
                    <span>
                      {(() => {
                        const basePrice = calculateBasePrice(formData);
                        const urgencyMultiplier = {
                          normal: 1,
                          priority: 1.2,
                          urgent: 1.5
                        }[formData.urgency_level];
                        const insurancePrice = formData.insurance_required ? (formData.package_value * 0.05) : 0;
                        const total = (basePrice * urgencyMultiplier) + insurancePrice;
                        return `${total.toFixed(2)} €`;
                      })()}
                </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaArrowLeft className="mr-2" />
                Précédent
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Suivant
                <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  <>
                    Créer l'expédition
                    <FaCheck className="ml-2" />
                  </>
                )}
              </button>
            )}
            </div>
        </div>
      </div>

      {/* Price Information */}
      {step === 1 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowPriceModal(!showPriceModal)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FaInfoCircle className="mr-2" />
            Voir les prix
          </button>
          
          {showPriceModal && (
            <div className="mt-4 bg-white shadow-md rounded-lg p-6 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grille tarifaire</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Prix de base</h4>
                  <p className="text-sm text-gray-600">Calculé selon le poids et les dimensions:</p>
                  <ul className="mt-1 text-sm text-gray-600 pl-5 list-disc">
                    <li>Jusqu'à 1kg: 8€</li>
                    <li>1kg à 5kg: 10€</li>
                    <li>5kg à 10kg: 13€</li>
                    <li>Plus de 10kg: +3€ par tranche de 5kg supplémentaire</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">Suppléments</h4>
                  <ul className="mt-1 text-sm text-gray-600 pl-5 list-disc">
                    <li>Colis fragile: +15% du prix de base</li>
                    <li>Signature à la livraison: +2€</li>
                    <li>Assurance: 5% de la valeur déclarée</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">Types de livraison</h4>
                  <ul className="mt-1 text-sm text-gray-600 pl-5 list-disc">
                    <li>Standard (2-3 jours): prix de base</li>
                    <li>Express (24h): +50% du prix de base</li>
                    <li>Même jour (selon disponibilité): +100% du prix de base</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">Niveau d'urgence</h4>
                  <ul className="mt-1 text-sm text-gray-600 pl-5 list-disc">
                    <li>Normal: prix standard</li>
                    <li>Prioritaire: +20% du prix</li>
                    <li>Urgent: +50% du prix</li>
                  </ul>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowPriceModal(false)}
                className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewShipment;