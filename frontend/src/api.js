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
  clearUser: () => localStorage.removeItem('user'),
  getActivePortfolioId: () => localStorage.getItem('activePortfolioId'),
  setActivePortfolioId: (id) => localStorage.setItem('activePortfolioId', id),
  clearActivePortfolioId: () => localStorage.removeItem('activePortfolioId')
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

// Portfolios API (multi-portfolio management)
export const portfoliosAPI = {
  getAll: async (userId) => {
    const response = await axios.get(`${API}/portfolios?user_id=${userId}`);
    return response.data;
  },
  create: async (userId, data) => {
    const response = await axios.post(`${API}/portfolios?user_id=${userId}`, data);
    return response.data;
  },
  update: async (userId, portfolioId, data) => {
    const response = await axios.put(`${API}/portfolios/${portfolioId}?user_id=${userId}`, data);
    return response.data;
  },
  delete: async (userId, portfolioId) => {
    const response = await axios.delete(`${API}/portfolios/${portfolioId}?user_id=${userId}`);
    return response.data;
  }
};

// Portfolio API
export const portfolioAPI = {
  getSummary: async (userId, portfolioId = null) => {
    let url = `${API}/portfolio/summary?user_id=${userId}`;
    if (portfolioId) url += `&portfolio_id=${portfolioId}`;
    const response = await axios.get(url);
    return response.data;
  },
  getPositions: async (userId, portfolioId = null) => {
    let url = `${API}/positions?user_id=${userId}`;
    if (portfolioId) url += `&portfolio_id=${portfolioId}`;
    const response = await axios.get(url);
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
