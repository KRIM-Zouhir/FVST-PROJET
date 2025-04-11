import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaBox } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">FVST</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Accueil
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/new-shipment" className="text-gray-700 hover:text-blue-600">
                  Nouvel envoi
                </Link>
                <Link to="/tracking" className="text-gray-700 hover:text-blue-600">
                  Suivi
                </Link>
                <Link to="/relay-points" className="text-gray-700 hover:text-blue-600">
                  Points relais
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <FaUser className="mr-2" />
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={toggleMenu}
              >
                Accueil
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/new-shipment"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Nouvel envoi
                  </Link>
                  <Link
                    to="/tracking"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Suivi
                  </Link>
                  <Link
                    to="/relay-points"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Points relais
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={toggleMenu}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 