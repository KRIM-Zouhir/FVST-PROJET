import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBuilding, FaChartLine, FaMapMarkedAlt, FaTruck, 
  FaShieldAlt, FaCheck, FaHandshake, FaLock, FaClock, 
  FaCreditCard, FaUserTie 
} from 'react-icons/fa';

const ForBusinesses = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto bg-black text-white rounded-lg shadow-xl overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 py-12 px-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Solutions Logistiques pour Entreprises</h1>
              <p className="text-lg mb-8">
                Optimisez votre chaîne logistique et réduisez vos coûts de livraison avec FVST
              </p>
              <Link to="/contact" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors self-start">
                Contacter un conseiller
              </Link>
            </div>
            <div className="md:w-1/2 bg-gray-100" style={{ minHeight: '300px', background: "#424242", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaBuilding className="text-white" style={{ fontSize: "120px", opacity: "0.8" }} />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Avantages pour votre entreprise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Réduction des coûts</h3>
              <p className="text-gray-600">
                Économisez jusqu'à 30% sur vos frais de livraison par rapport aux services traditionnels.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkedAlt className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Couverture nationale</h3>
              <p className="text-gray-600">
                Accédez à notre réseau de livreurs et points relais partout en France, même dans les zones rurales.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Livraison flexible</h3>
              <p className="text-gray-600">
                Offrez à vos clients des options de livraison personnalisées selon leurs besoins et préférences.
              </p>
            </div>
          </div>
        </div>

        {/* Offer Section */}
        <div className="max-w-5xl mx-auto mb-16 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6">Notre offre entreprise</h2>
              <p className="text-gray-600 mb-6">
                FVST propose des solutions sur mesure adaptées aux besoins spécifiques de votre entreprise, qu'elle soit une TPE, PME ou grande entreprise.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <FaCheck className="text-black mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">API d'intégration</span>
                    <p className="text-gray-600">Connectez facilement votre site e-commerce ou votre ERP à notre plateforme</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-black mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Tableau de bord dédié</span>
                    <p className="text-gray-600">Suivez toutes vos expéditions et gérez vos factures en un seul endroit</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-black mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Tarifs préférentiels</span>
                    <p className="text-gray-600">Bénéficiez de remises basées sur votre volume d'expéditions</p>
                  </div>
                </li>
              </ul>
              
              <Link to="/register" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors inline-block">
                Créer un compte entreprise
              </Link>
            </div>
            <div className="flex flex-col space-y-4 bg-gray-100 p-8">
              <h3 className="text-2xl font-bold mb-2">Formules disponibles</h3>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Starter</h4>
                <p className="text-gray-600 mb-3">Pour les petites entreprises</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <FaCheck className="text-black mr-2" />
                    <span>Jusqu'à 50 expéditions/mois</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-black mr-2" />
                    <span>Accès au tableau de bord</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-black mr-2" />
                    <span>Support par email</span>
                  </li>
                </ul>
                <p className="font-bold">À partir de 49€/mois</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow border-2 border-black">
                <h4 className="text-xl font-semibold mb-2">Business</h4>
                <p className="text-gray-600 mb-3">Pour les entreprises en croissance</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <FaCheck className="text-black mr-2" />
                    <span>Jusqu'à 500 expéditions/mois</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-black mr-2" />
                    <span>API d'intégration complète</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-black mr-2" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <p className="font-bold">À partir de 199€/mois</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Enterprise</h4>
                <p className="text-gray-600 mb-3">Solutions personnalisées</p>
                <p className="font-bold">Contactez-nous pour un devis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features and Benefits */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Caractéristiques clés</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaHandshake className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Service client dédié</h3>
                <p className="text-gray-600">
                  Un gestionnaire de compte personnel pour répondre à toutes vos questions et optimiser votre expérience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaLock className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Sécurité garantie</h3>
                <p className="text-gray-600">
                  Toutes les expéditions sont assurées et nos livreurs font l'objet d'une vérification rigoureuse.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaClock className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Livraison programmée</h3>
                <p className="text-gray-600">
                  Planifiez vos livraisons à l'avance et offrez des créneaux précis à vos clients.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaCreditCard className="text-xl text-black" />
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold mb-2">Facturation simplifiée</h3>
                <p className="text-gray-600">
                  Factures mensuelles détaillées et possibilité de paiement différé pour une gestion simplifiée.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Secteurs d'activité</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaBuilding className="mr-2 text-black" /> 
                E-commerce
              </h3>
              <p className="text-gray-600">
                Optimisez vos livraisons du dernier kilomètre et améliorez la satisfaction client grâce à nos options de livraison flexibles.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaBuilding className="mr-2 text-black" /> 
                Retail
              </h3>
              <p className="text-gray-600">
                Proposez la livraison à domicile depuis vos magasins physiques et augmentez votre zone de chalandise.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaBuilding className="mr-2 text-black" /> 
                Restauration
              </h3>
              <p className="text-gray-600">
                Livrez vos plats dans des conditions optimales grâce à nos livreurs spécialisés et nos conteneurs isothermes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaBuilding className="mr-2 text-black" /> 
                Services de santé
              </h3>
              <p className="text-gray-600">
                Transport sécurisé pour médicaments et équipements médicaux avec des livreurs formés et certifiés.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaBuilding className="mr-2 text-black" /> 
                Services juridiques
              </h3>
              <p className="text-gray-600">
                Livraison de documents confidentiels avec signature électronique et traçabilité complète.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaBuilding className="mr-2 text-black" /> 
                Autres secteurs
              </h3>
              <p className="text-gray-600">
                Contactez-nous pour discuter de solutions adaptées aux besoins spécifiques de votre industrie.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Témoignages de nos clients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUserTie className="text-gray-500 text-2xl" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold">Marc Dupont</h3>
                  <p className="text-gray-600 mb-4">Directeur Logistique, ModeExpress</p>
                  <p className="text-gray-700 italic">
                    "Depuis que nous utilisons FVST, notre taux de satisfaction client a augmenté de 28%. La flexibilité du système et la fiabilité des livreurs font toute la différence."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUserTie className="text-gray-500 text-2xl" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold">Sophie Martin</h3>
                  <p className="text-gray-600 mb-4">CEO, BioManger</p>
                  <p className="text-gray-700 italic">
                    "La plateforme FVST nous a permis d'étendre notre zone de livraison et d'offrir des créneaux plus précis à nos clients. Un vrai game-changer pour notre activité."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Prêt à optimiser votre logistique ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour une démo personnalisée ou pour discuter de vos besoins spécifiques.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-xl hover:bg-gray-900 transition-colors"
            >
              Demander une démo
            </Link>
            <Link 
              to="/register" 
              className="bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-xl hover:bg-gray-50 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForBusinesses; 