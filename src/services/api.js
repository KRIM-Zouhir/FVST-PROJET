import axios from "axios";

// Create API base URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token before each request
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If there's no response, return the error (network issue)
    if (!error.response) {
      console.error('Network error (no response):', error);
      return Promise.reject(error);
    }

    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          // No refresh token available
          console.error('No refresh token available');
          throw new Error("No refresh token available");
        }
        
        console.log('Attempting to refresh token...');
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        const { token } = response.data;

        if (token) {
          console.log('Token refreshed successfully');
          localStorage.setItem("token", token);

          // Update Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Return the original request with the new token
          return api(originalRequest);
        } else {
          console.error('Token refresh failed: No token received');
          throw new Error("No token received");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        // Clear auth data on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        return Promise.reject(error);
      }
    }

    // Handle specific error codes
    if (error.response.status === 403) {
      console.error('Access forbidden:', error.response.data);
    } else if (error.response.status === 404) {
      console.error('Resource not found:', error.response.data);
    } else if (error.response.status === 422) {
      console.error('Validation error:', error.response.data);
    } else if (error.response.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/signin", credentials),
  registerClient: (userData) => api.post("/auth/signup-expediteur", userData),
  registerDriver: (userData) => api.post("/auth/signup-livreur", userData),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  me: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/users/profile", userData),
  refreshToken: (refreshToken) => api.post("/auth/refresh-token", { refreshToken }),
  resetPassword: (email) => api.post("/auth/reset-password", { email }),
  setNewPassword: (token, password) => api.post("/auth/new-password", { token, password }),
};

// Shipment API
export const shipmentAPI = {
  create: (shipmentData) => api.post("/shipments", shipmentData),
  getAll: () => api.get("/shipments"),
  getById: (id) => api.get(`/shipments/${id}`),
  update: (id, shipmentData) => api.put(`/shipments/${id}`, shipmentData),
  delete: (id) => api.delete(`/shipments/${id}`),
  track: (trackingNumber) => api.get(`/shipments/track/${trackingNumber}`),
  getUserShipments: () => api.get("/shipments/user"),
};

// Route API
export const routeAPI = {
  create: (routeData) => api.post("/routes", routeData),
  getAll: () => api.get("/routes"),
  getById: (id) => api.get(`/routes/${id}`),
  update: (id, routeData) => api.put(`/routes/${id}`, routeData),
  delete: (id) => api.delete(`/routes/${id}`),
  getAvailable: () => api.get("/routes/available"),
  matchShipment: (shipmentId) => api.get(`/routes/match/${shipmentId}`),
  acceptShipment: (routeId, shipmentId) => api.post(`/routes/${routeId}/accept/${shipmentId}`),
};

// Notification API
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
};

// Points Relais API
export const relayPointAPI = {
  getAll: () => api.get("/relay-points"),
  getById: (id) => api.get(`/relay-points/${id}`),
  getNearby: (lat, lng, radius) => api.get(`/relay-points/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: () => api.get("/admin/users"),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getShipments: () => api.get("/admin/shipments"),
  getRoutes: () => api.get("/admin/routes"),
};