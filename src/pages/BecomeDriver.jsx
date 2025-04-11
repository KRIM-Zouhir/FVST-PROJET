import React from 'react';
import { FaTruck, FaClipboardCheck, FaMoneyBillWave, FaUserCheck, FaMap, FaFileAlt, FaIdCard, FaCarAlt, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BecomeDriver = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto bg-black text-white rounded-lg shadow-xl overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 py-12 px-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Devenir Livreur</h1>
              <p className="text-lg mb-8">
                Rejoignez notre réseau de livreurs indépendants et gagnez votre vie à votre rythme.
              </p>
              <Link to="/register" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors self-start">
                S'inscrire comme livreur
              </Link>
            </div>
            <div className="md:w-1/2 bg-gray-100" style={{ minHeight: '300px', background: "#424242", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaTruck className="text-white" style={{ fontSize: "120px", opacity: "0.8" }} />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi devenir livreur chez FVST ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Revenus attractifs</h3>
              <p className="text-gray-600">
                Gagnez jusqu'à 25€/heure en fonction des livraisons et des distances parcourues.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMap className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexibilité totale</h3>
              <p className="text-gray-600">
                Créez votre propre emploi du temps et définissez vos zones de livraison préférées.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMobileAlt className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Application simple</h3>
              <p className="text-gray-600">
                Utilisez notre application intuitive pour gérer vos livraisons et optimiser vos trajets.
              </p>
            </div>
          </div>
        </div>

        {/* How to become a driver */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Comment devenir livreur ?</h2>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Créez votre compte livreur</h3>
                  <p className="text-gray-600 mb-4">
                    Inscrivez-vous sur notre plateforme et sélectionnez l'option "Devenir livreur". Remplissez vos informations personnelles.
                  </p>
                  <div className="flex items-center text-gray-600">
                    <FaFileAlt className="mr-2" />
                    <span>Délai : 5 minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Vérification d'identité</h3>
                  <p className="text-gray-600 mb-4">
                    Téléchargez les documents requis pour vérifier votre identité et votre éligibilité (pièce d'identité, permis de conduire, etc.).
                  </p>
                  <div className="flex items-center text-gray-600">
                    <FaIdCard className="mr-2" />
                    <span>Délai : 1-2 jours ouvrés</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">3</div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Informations sur votre véhicule</h3>
                  <p className="text-gray-600 mb-4">
                    Enregistrez les informations sur votre véhicule (type, taille, capacité de chargement, etc.) et téléchargez les documents d'assurance.
                  </p>
                  <div className="flex items-center text-gray-600">
                    <FaCarAlt className="mr-2" />
                    <span>Délai : 10 minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">4</div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Formation en ligne</h3>
                  <p className="text-gray-600 mb-4">
                    Suivez notre module de formation en ligne pour apprendre à utiliser l'application et connaître les procédures de livraison.
                  </p>
                  <div className="flex items-center text-gray-600">
                    <FaClipboardCheck className="mr-2" />
                    <span>Délai : 1 heure</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">5</div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Activation de votre compte</h3>
                  <p className="text-gray-600 mb-4">
                    Une fois toutes les vérifications terminées, votre compte sera activé et vous pourrez commencer à recevoir des demandes de livraison.
                  </p>
                  <div className="flex items-center text-gray-600">
                    <FaCheckCircle className="mr-2" />
                    <span>Délai : 24-48 heures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Conditions requises</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Pour vous</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Être âgé d'au moins 18 ans</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Posséder un permis de conduire valide (catégorie B minimum)</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Avoir un casier judiciaire vierge</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Posséder un smartphone compatible avec notre application</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Être éligible à travailler en France</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Pour votre véhicule</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Véhicule en bon état de fonctionnement</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Assurance commerciale ou auto-entrepreneur</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Contrôle technique à jour</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Capacité de chargement adaptée aux livraisons</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-black mt-1 mr-3 flex-shrink-0" />
                  <span>Âge du véhicule : moins de 15 ans recommandé</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Témoignages de nos livreurs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4" style={{ background: "#e0e0e0" }}></div>
                <h3 className="text-xl font-semibold">Thomas D.</h3>
                <p className="text-gray-600 mb-4">Livreur depuis 8 mois</p>
                <p className="text-gray-700 italic">
                  "La flexibilité est ce qui m'a attiré. Je peux travailler quand je veux et organiser mes livraisons autour de mes études. Le revenu est stable et l'application est très intuitive."
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4" style={{ background: "#e0e0e0" }}></div>
                <h3 className="text-xl font-semibold">Marie L.</h3>
                <p className="text-gray-600 mb-4">Livreuse depuis 2 ans</p>
                <p className="text-gray-700 italic">
                  "J'ai commencé comme revenu complémentaire, mais j'ai rapidement augmenté mes heures. Le système de points relais est excellent et les clients sont généralement très satisfaits du service."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Comment suis-je payé ?</h3>
              <p className="text-gray-600">
                Les paiements sont effectués hebdomadairement par virement bancaire. Le montant dépend du nombre de livraisons effectuées, des distances parcourues et des éventuels bonus.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Quel type de véhicule puis-je utiliser ?</h3>
              <p className="text-gray-600">
                Nous acceptons plusieurs types de véhicules : voitures, camionnettes, scooters, et même vélos pour les livraisons urbaines courtes distances. Chaque véhicule a ses propres exigences et capacités de chargement.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Ai-je besoin d'une assurance spéciale ?</h3>
              <p className="text-gray-600">
                Oui, vous devez avoir une assurance qui couvre l'utilisation professionnelle de votre véhicule. Nous pouvons vous conseiller sur les options disponibles et les partenaires assureurs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre notre équipe ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Lancez-vous dès aujourd'hui et commencez à gagner de l'argent en effectuant des livraisons dans votre région.
          </p>
          <Link to="/register" className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-xl hover:bg-gray-900 transition-colors inline-block">
            Devenir livreur
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BecomeDriver; 