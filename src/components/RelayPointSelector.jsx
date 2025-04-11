import React, { useState, useEffect } from 'react';
import { relayPointService } from '../services/RelayPointService';
import { FaMapMarkerAlt, FaClock, FaPhone, FaGlobe } from 'react-icons/fa';

export default function RelayPointSelector({ location, onSelect }) {
  const [relayPoints, setRelayPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location?.lat && location?.lon) {
      loadRelayPoints(location.lat, location.lon);
    }
  }, [location]);

  const loadRelayPoints = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const points = await relayPointService.searchRelayPoints(lat, lon);
      setRelayPoints(points);
    } catch (error) {
      setError('Erreur lors du chargement des points relais');
      console.error('Error loading relay points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (point) => {
    try {
      const details = await relayPointService.getRelayPointDetails(point.id, point.type);
      setSelectedPoint(details);
      if (onSelect) onSelect(details);
    } catch (error) {
      console.error('Error fetching relay point details:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Recherche des points relais...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold">Points Relais à proximité</h2>
        <p className="text-gray-600 mt-2">
          {relayPoints.length} points relais trouvés dans votre zone
        </p>
      </div>

      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {relayPoints.map((point) => (
          <div
            key={`${point.type}-${point.id}`}
            className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedPoint?.id === point.id ? 'bg-gray-50' : ''
            }`}
            onClick={() => handleSelect(point)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{point.name}</h3>
                <p className="text-gray-600 mt-1 flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  {point.address}
                </p>
                <p className="text-gray-600 mt-1 flex items-center">
                  <FaClock className="mr-2" />
                  {point.openingHours}
                </p>
                {point.phone && (
                  <p className="text-gray-600 mt-1 flex items-center">
                    <FaPhone className="mr-2" />
                    {point.phone}
                  </p>
                )}
                {point.website && (
                  <p className="text-gray-600 mt-1 flex items-center">
                    <FaGlobe className="mr-2" />
                    <a
                      href={point.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:underline"
                    >
                      Site web
                    </a>
                  </p>
                )}
              </div>
              <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full">
                {point.type}
              </span>
            </div>

            {selectedPoint?.id === point.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(point);
                  }}
                >
                  Sélectionner ce point relais
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {relayPoints.length === 0 && !loading && (
        <div className="p-8 text-center text-gray-600">
          <p>Aucun point relais trouvé dans cette zone</p>
        </div>
      )}
    </div>
  );
} 