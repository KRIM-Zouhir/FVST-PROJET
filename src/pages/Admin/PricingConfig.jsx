import React, { useState, useEffect } from 'react';
import { pricingService } from '../../services/PricingService';

export default function PricingConfig() {
  const [config, setConfig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch this from your backend
    setConfig(pricingService.config);
  }, []);

  const handleEdit = () => {
    setEditedConfig({ ...config });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real application, you would save this to your backend
      pricingService.updateConfig(editedConfig);
      setConfig(editedConfig);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleCancel = () => {
    setEditedConfig(null);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedConfig(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Configuration des prix</h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Modifier
              </button>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white text-black border border-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Prix de base</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix minimum (€)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedConfig.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    step="0.01"
                  />
                ) : (
                  <p className="text-lg">{config.minPrice} €</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix de base
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedConfig.basePrice}
                    onChange={(e) => handleChange('basePrice', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    step="0.01"
                  />
                ) : (
                  <p className="text-lg">{config.basePrice} €</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix par kilomètre (€)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedConfig.pricePerKm}
                    onChange={(e) => handleChange('pricePerKm', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    step="0.01"
                  />
                ) : (
                  <p className="text-lg">{config.pricePerKm} €</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Multiplicateurs</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de pointe (x)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedConfig.rushHourMultiplier}
                    onChange={(e) => handleChange('rushHourMultiplier', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    step="0.01"
                  />
                ) : (
                  <p className="text-lg">x{config.rushHourMultiplier}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekend (x)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedConfig.weekendMultiplier}
                    onChange={(e) => handleChange('weekendMultiplier', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    step="0.01"
                  />
                ) : (
                  <p className="text-lg">x{config.weekendMultiplier}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nuit (x)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedConfig.nightMultiplier}
                    onChange={(e) => handleChange('nightMultiplier', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    step="0.01"
                  />
                ) : (
                  <p className="text-lg">x{config.nightMultiplier}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Commission plateforme</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pourcentage de commission (%)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedConfig.platformFeePercentage}
                    onChange={(e) => handleChange('platformFeePercentage', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    step="0.1"
                  />
                ) : (
                  <p className="text-lg">{config.platformFeePercentage}%</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 