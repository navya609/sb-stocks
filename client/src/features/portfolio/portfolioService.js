import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/';

// Get user portfolio
const getPortfolio = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'portfolio', config);
  return response.data;
};

// Execute trade
const executeTrade = async (tradeData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'trade', tradeData, config);
  return response.data;
};

// Search stocks
const searchStocks = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `stocks?q=${query}`, config);
  return response.data;
};

const portfolioService = {
  getPortfolio,
  executeTrade,
  searchStocks
};

export default portfolioService;
