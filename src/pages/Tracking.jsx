import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTruck, FaBox, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

const Tracking = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipmentDetails();
  }, [id]);

  const fetchShipmentDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Veuillez vous connecter pour suivre votre envoi');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/shipments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du chargement des détails de l\'envoi');
      }

      setShipment(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'livre':
        return <FaCheckCircle className="text-green-500" />;
      case 'en_transit':
        return <FaTruck className="text-black" />;
      case 'en_attente':
        return <FaClock className="text-yellow-500" />;
      case 'annule':
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'livre':
        return 'Livré';
      case 'en_transit':
        return 'En transit';
      case 'en_attente':
        return 'En attente';
      case 'annule':
        return 'Annulé';
      default:
        return 'Statut inconnu';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails de l'envoi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Envoi non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 bg-black text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Suivi de l'envoi</h2>
                <p className="mt-1 text-sm text-gray-100">
                  Numéro de suivi: {shipment.tracking_number}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{getStatusIcon(shipment.status)}</div>
                <div className="text-sm font-medium">{getStatusText(shipment.status)}</div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Détails du colis</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Taille</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.package_size}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Poids</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.package_weight} kg</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Prix</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipment.price} €</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Points relais</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Départ</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {shipment.origin_relay.name}
                      <br />
                      {shipment.origin_relay.address}
                      <br />
                      {shipment.origin_relay.postal_code} {shipment.origin_relay.city}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Arrivée</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {shipment.destination_relay.name}
                      <br />
                      {shipment.destination_relay.address}
                      <br />
                      {shipment.destination_relay.postal_code} {shipment.destination_relay.city}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Tracking History */}
          <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Historique</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {shipment.tracking_history.map((event, index) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {index !== shipment.tracking_history.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-black flex items-center justify-center ring-8 ring-white">
                            <FaClock className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.status}
                            </p>
                            <p className="text-sm text-gray-900">
                              {event.location}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(event.timestamp).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;