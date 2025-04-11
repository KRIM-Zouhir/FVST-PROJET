import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount and when token changes
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
          // Log successful authentication for debugging
          console.log('User authenticated:', response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Try token refresh if refresh token is available
          if (refreshToken) {
            const refreshSuccessful = await refreshAuthToken();
            if (!refreshSuccessful) {
              // Only logout if refresh also fails
              logout();
            }
          } else {
            logout();
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token]); // Only depend on token to prevent refresh loops

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/signin', credentials);
      const { token: newToken, refreshToken: newRefreshToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        throw new Error("Les données de connexion sont incomplètes");
      }
      
      // Save tokens to localStorage
      localStorage.setItem('token', newToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      // Update state
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);

      // Log user role for debugging
      console.log('User logged in with role:', userData.role);

      // Navigate based on user role
      if (userData.role === 'livreur') {
        navigate('/driver-routes');
      } else if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

      toast.success('Connexion réussie !');
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Erreur lors de la connexion';
      
      // Get more descriptive error if available
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        // Add more debug info if needed
        if (error.response.data?.error) {
          errorMessage += ` (${error.response.data.error})`;
        }
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // Determine endpoint based on user role
      const endpoint = userData.role === 'livreur' 
        ? '/auth/signup-livreur'
        : '/auth/signup-expediteur';
        
      const response = await api.post(endpoint, userData);
      toast.success('Inscription réussie ! Veuillez vérifier votre email.');
      
      // Navigate to login with success message instead of verification page
      navigate('/login', { 
        state: { 
          successMessage: 'Votre compte a été créé avec succès! Veuillez vous connecter.',
          email: userData.email
        } 
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      
      let errorMessage = 'Erreur lors de l\'inscription';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    navigate('/login');
    toast.info('Vous avez été déconnecté');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      setUser(prev => ({
        ...prev,
        ...response.data
      }));
      toast.success('Profil mis à jour avec succès !');
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  const refreshAuthToken = async () => {
    if (!refreshToken) return false;

    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token: newToken } = response.data;
      
      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      toast.success('Email vérifié avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
      return response.data;
    } catch (error) {
      console.error('Email verification failed:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la vérification de l\'email');
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
    verifyEmail,
    refreshAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;