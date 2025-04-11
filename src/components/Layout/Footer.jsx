import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaShieldAlt, FaShippingFast, FaTruck, FaBoxOpen } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-full mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <FaShippingFast className="text-white text-3xl mr-2" />
              <h3 className="text-2xl font-bold">FVST Delivery</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Votre partenaire de confiance pour toutes vos livraisons en France. Service premium de livraison rapide et fiable.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider">Liens Rapides</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span>
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span>
                  Suivi de colis
                </Link>
              </li>
              <li>
                <Link to="/relay-points" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span>
                  Points Relais
                </Link>
              </li>
              <li>
                <Link to="/become-driver" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="mr-2">›</span>
                  Devenir Livreur
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider">Nos Services</h4>
            <ul className="space-y-4">
              <li className="text-gray-300 flex items-center">
                <FaBoxOpen className="mr-3 text-white" />
                Livraison de colis
              </li>
              <li className="text-gray-300 flex items-center">
                <FaTruck className="mr-3 text-white" />
                Livraison express
              </li>
              <li className="text-gray-300 flex items-center">
                <FaShippingFast className="mr-3 text-white" />
                Service international
              </li>
              <li className="text-gray-300 flex items-center">
                <FaShieldAlt className="mr-3 text-white" />
                Suivi en temps réel
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-3 text-white" />
                <span>123 Rue de la Livraison, 75001 Paris</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-white" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-white" />
                <span>contact@fvst-delivery.fr</span>
              </li>
              <li className="flex items-center">
                <FaClock className="mr-3 text-white" />
                <span>Lun - Ven: 8h30 - 19h00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} FVST Delivery. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-300">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
              Conditions d'utilisation
            </Link>
            <Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-300">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;