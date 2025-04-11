import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaMapMarkedAlt, 
  FaShippingFast, 
  FaTruck, 
  FaBox, 
  FaUserPlus,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <FaShippingFast className="text-blue-400 text-2xl mr-2" />
              <h3 className="text-xl font-bold">FVST Delivery</h3>
            </div>
            <p className="text-gray-300">
              Votre partenaire de confiance pour toutes vos livraisons en France.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white flex items-center">
                  <span className="mr-2">›</span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-300 hover:text-white flex items-center">
                  <span className="mr-2">›</span>
                  Suivi de colis
                </Link>
              </li>
              {isAuthenticated && user?.role === 'expediteur' && (
                <>
                  <li>
                    <Link to="/my-shipments" className="text-gray-300 hover:text-white flex items-center">
                      <span className="mr-2">›</span>
                      Mes expéditions
                    </Link>
                  </li>
                  <li>
                    <Link to="/new-shipment" className="text-gray-300 hover:text-white flex items-center">
                      <span className="mr-2">›</span>
                      Nouvelle expédition
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && user?.role === 'livreur' && (
                <>
                  <li>
                    <Link to="/routes" className="text-gray-300 hover:text-white flex items-center">
                      <span className="mr-2">›</span>
                      Mes itinéraires
                    </Link>
                  </li>
                  <li>
                    <Link to="/delivery-history" className="text-gray-300 hover:text-white flex items-center">
                      <span className="mr-2">›</span>
                      Historique des livraisons
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white flex items-center">
                  <span className="mr-2">›</span>
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nos Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 flex items-center">
                <FaBox className="mr-2 text-blue-400" />
                Livraison de colis
              </li>
              <li className="text-gray-300 flex items-center">
                <FaTruck className="mr-2 text-blue-400" />
                Livraison express
              </li>
              <li className="text-gray-300 flex items-center">
                <FaMapMarkedAlt className="mr-2 text-blue-400" />
                Suivi en temps réel
              </li>
              <li className="text-gray-300 flex items-center">
                <FaUserPlus className="mr-2 text-blue-400" />
                Devenez livreur
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-400" />
                123 Rue de la Livraison, 75001 Paris
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-blue-400" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-400" />
                contact@fvst-delivery.fr
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>
            © {new Date().getFullYear()} FVST Delivery. Tous droits réservés.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link to="/privacy-policy" className="hover:text-white">
              Politique de confidentialité
            </Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 