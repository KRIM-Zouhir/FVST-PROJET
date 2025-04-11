import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaBars, FaTimes, FaUser, FaBox, FaTruck, FaShippingFast, 
  FaMapMarkedAlt, FaHistory, FaClipboardList, FaSearch, 
  FaSignOutAlt, FaHome, FaInfoCircle, FaQuestionCircle,
  FaUserPlus, FaBuilding, FaHandsHelping, FaInfo, FaQuestion
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };
  
  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };
  
  const activeClassName = "text-white font-medium border-b-2 border-white";
  const inactiveClassName = "text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-400";
  
  const expediteurLinks = [
    { to: '/dashboard', label: 'Tableau de bord', icon: <FaHome className="mr-2" /> },
    { to: '/new-shipment', label: 'Nouvelle expédition', icon: <FaBox className="mr-2" /> },
    { to: '/my-shipments', label: 'Mes expéditions', icon: <FaClipboardList className="mr-2" /> },
    { to: '/track', label: 'Suivi colis', icon: <FaSearch className="mr-2" /> },
  ];
  
  const livreurLinks = [
    { to: '/dashboard', label: 'Tableau de bord', icon: <FaHome className="mr-2" /> },
    { to: '/routes', label: 'Mes itinéraires', icon: <FaMapMarkedAlt className="mr-2" /> },
    { to: '/delivery-history', label: 'Historique', icon: <FaHistory className="mr-2" /> },
  ];
  
  const publicInfoLinks = [
    { to: '/how-it-works', label: 'Comment ça marche', icon: <FaInfoCircle className="mr-2" /> },
    { to: '/become-driver', label: 'Devenir Livreur', icon: <FaTruck className="mr-2" /> },
    { to: '/for-businesses', label: 'Pour les Entreprises', icon: <FaBuilding className="mr-2" /> },
    { to: '/faq', label: 'FAQ', icon: <FaQuestionCircle className="mr-2" /> },
  ];
  
  const getNavLinks = () => {
    if (!isAuthenticated) return publicInfoLinks;
    return user?.role === 'expediteur' ? expediteurLinks : user?.role === 'livreur' ? livreurLinks : [];
  };
  
  return (
    <nav className="bg-black text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <FaShippingFast className="text-white text-3xl mr-2" />
            <span className="text-2xl font-bold text-white">FVST</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              onClick={closeMenu}
            >
              Accueil
            </NavLink>
            
            {getNavLinks().map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                onClick={closeMenu}
              >
                <span className="flex items-center">
                  {link.icon}
                  {link.label}
                </span>
              </NavLink>
            ))}
            
            {/* Auth buttons for desktop */}
            {isAuthenticated ? (
              <div className="flex items-center ml-4 space-x-4">
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `flex items-center ${isActive ? activeClassName : inactiveClassName}`}
                  onClick={closeMenu}
                >
                  <FaUser className="mr-2" />
                  Mon Compte
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition-colors duration-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center ml-4 space-x-4">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-md border border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
                >
                  Connexion
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition-colors duration-300"
                >
                  Inscription
                </NavLink>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 transition-colors duration-300"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md ${isActive ? "bg-gray-900 text-white font-medium" : "text-gray-300 hover:text-white hover:bg-gray-800"}`
                }
                onClick={closeMenu}
              >
                <span className="flex items-center">
                  <FaHome className="mr-2" />
                  Accueil
                </span>
              </NavLink>
              
              <div className="pt-2 space-y-1">
                {getNavLinks().map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => 
                      `block px-3 py-2 rounded-md ${isActive ? "bg-gray-900 text-white font-medium" : "text-gray-300 hover:text-white hover:bg-gray-800"}`
                    }
                    onClick={closeMenu}
                  >
                    <span className="flex items-center">
                      {link.icon}
                      {link.label}
                    </span>
                  </NavLink>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                {isAuthenticated ? (
                  <>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) => 
                        `block px-3 py-2 rounded-md ${isActive ? "bg-gray-900 text-white font-medium" : "text-gray-300 hover:text-white hover:bg-gray-800"}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="flex items-center">
                        <FaUser className="mr-2" />
                        Mon Compte
                      </span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 mt-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <span className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Déconnexion
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={({ isActive }) => 
                        `block px-3 py-2 rounded-md ${isActive ? "bg-gray-900 text-white font-medium" : "text-gray-300 hover:text-white hover:bg-gray-800"}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="flex items-center">
                        <FaUser className="mr-2" />
                        Connexion
                      </span>
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={({ isActive }) => 
                        `block px-3 py-2 rounded-md ${isActive ? "bg-gray-900 text-white font-medium" : "text-gray-300 hover:text-white hover:bg-gray-800"}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="flex items-center">
                        <FaUserPlus className="mr-2" />
                        Inscription
                      </span>
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 