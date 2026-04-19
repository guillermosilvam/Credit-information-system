import axios from 'axios';

// La URL base asume el puerto 8000 confirmado por el entorno de desarrollo local Django
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar via Header el Token JWT devuelto por simplejwt
api.interceptors.request.use(
  (config) => {
    // Evitamos problemas si se ejecuta desde SSR en Next.js
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si recibe codigo 401 (Unauthorized) por un token expirado, puede emitirse una alerta 
    // o forzar el deslogueo en un futuro.
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.warn('Token expirado o no autorizado. Se requiere nuevo inicio de sesion.');
      // Opcional: localStorage.removeItem('access_token'); window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
