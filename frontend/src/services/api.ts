import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (backend offline)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error('Tempo de resposta excedido. Tente novamente.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Servidor offline. Verifique sua conexão.');
      } else {
        toast.error('Erro de conexão com o servidor.');
      }
      return Promise.reject({
        message: 'Backend offline',
        offline: true
      });
    }

    // HTTP errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      toast.error('Erro interno do servidor.');
    } else if (error.response?.status === 503) {
      toast.error('Serviço temporariamente indisponível.');
    }

    return Promise.reject(error);
  }
);

export default api;
