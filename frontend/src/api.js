import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Store user ID in localStorage
export const storage = {
  getUserId: () => localStorage.getItem('userId'),
  setUserId: (id) => localStorage.setItem('userId', id),
  clearUserId: () => localStorage.removeItem('userId'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('user')
};

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await axios.post(`${API}/auth/register`, data);
    return response.data;
  },
  login: async (data) => {
    const response = await axios.post(`${API}/auth/login`, data);
    return response.data;
  }
};

// Portfolio API
export const portfolioAPI = {
  getSummary: async (userId) => {
    const response = await axios.get(`${API}/portfolio/summary?user_id=${userId}`);
    return response.data;
  },
  getPositions: async (userId) => {
    const response = await axios.get(`${API}/positions?user_id=${userId}`);
    return response.data;
  },
  addPosition: async (userId, data) => {
    const response = await axios.post(`${API}/positions?user_id=${userId}`, data);
    return response.data;
  },
  deletePosition: async (userId, positionId) => {
    const response = await axios.delete(`${API}/positions/${positionId}?user_id=${userId}`);
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getCorrelation: async (userId) => {
    const response = await axios.get(`${API}/analytics/correlation?user_id=${userId}`);
    return response.data;
  },
  getRecommendations: async (userId) => {
    const response = await axios.get(`${API}/analytics/recommendations?user_id=${userId}`);
    return response.data;
  }
};

// Transactions API
export const transactionsAPI = {
  getTransactions: async (userId) => {
    const response = await axios.get(`${API}/transactions?user_id=${userId}`);
    return response.data;
  }
};

// Market API
export const marketAPI = {
  getQuote: async (symbol) => {
    const response = await axios.get(`${API}/market/quote/${symbol}`);
    return response.data;
  },
  search: async (query) => {
    const response = await axios.get(`${API}/market/search?q=${query}`);
    return response.data;
  }
};
