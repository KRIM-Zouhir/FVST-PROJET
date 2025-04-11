import React from 'react';
import { FaTruck, FaMapMarkedAlt, FaBox, FaMobileAlt, FaMoneyBillWave, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Comment ça marche</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment FVST simplifie le transport de colis en France avec un service fiable, rapide et économique.
          </p>
        </div>

        {/* Process Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">De l'envoi à la livraison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBox className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Créez votre envoi</h3>
              <p className="text-gray-600">
                Renseignez les adresses d'origine et de destination, les dimensions et le poids de votre colis.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Choisissez votre livreur</h3>
              <p className="text-gray-600">
                Sélectionnez parmi notre réseau de livreurs disponibles celui qui correspond à vos besoins.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Suivez la livraison</h3>
              <p className="text-gray-600">
                Recevez des notifications en temps réel sur l'état de votre livraison jusqu'à sa destination finale.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir FVST ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaMapMarkedAlt className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Réseau de points relais</h3>
                <p className="text-gray-600">
                  Plus de 1000 points relais à travers la France pour faciliter le dépôt et la récupération de vos colis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaMobileAlt className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Suivi en temps réel</h3>
                <p className="text-gray-600">
                  Suivez votre colis à chaque étape du trajet grâce à notre système de suivi avancé.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Tarifs transparents</h3>
                <p className="text-gray-600">
                  Des prix clairs basés sur la distance et le volume, sans frais cachés ni surprises.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaTruck className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Livraison multi-trajets</h3>
                <p className="text-gray-600">
                  Notre système innovant permet de coordonner plusieurs livreurs pour un même colis sur de longues distances.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Relay Points */}
        <div className="mb-20 bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Notre réseau de points relais</h2>
          
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <img 
                src="/images/map-placeholder.jpg" 
                alt="Carte des points relais" 
                className="rounded-lg shadow-md"
                style={{ maxHeight: '300px', width: '100%', objectFit: 'cover', background: '#f1f1f1' }}
              />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <p className="text-gray-600 mb-4">
                Nos points relais sont stratégiquement répartis dans toute la France pour faciliter le dépôt et la collecte de vos colis.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaArrowRight className="text-black mr-2" />
                  <span>Horaires d'ouverture étendus</span>
                </li>
                <li className="flex items-center">
                  <FaArrowRight className="text-black mr-2" />
                  <span>Emplacements pratiques (centres commerciaux, stations-service)</span>
                </li>
                <li className="flex items-center">
                  <FaArrowRight className="text-black mr-2" />
                  <span>Personnel formé pour la gestion des colis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Quels types de colis puis-je envoyer ?</h3>
              <p className="text-gray-600">
                Vous pouvez envoyer la plupart des colis jusqu'à 30kg, dans la limite des dimensions maximales de 100x80x60cm. Certaines restrictions s'appliquent pour les matières dangereuses ou périssables.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Comment suivre mon colis ?</h3>
              <p className="text-gray-600">
                Vous recevrez un numéro de suivi par email après la confirmation de votre envoi. Utilisez ce numéro sur notre site ou notre application mobile pour suivre votre colis en temps réel.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Que se passe-t-il en cas de retard ou de problème ?</h3>
              <p className="text-gray-600">
                Notre service client est disponible 7j/7 pour résoudre tout problème. Une assurance est incluse pour tous les envois jusqu'à 500€ de valeur déclarée.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à expédier votre colis ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Créez votre compte en quelques minutes et commencez à envoyer vos colis partout en France.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/register" 
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-300"
            >
              Créer un compte
            </a>
            <a 
              href="/contact" 
              className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 