import axios from 'axios';

// Determinamos dinámicamente la URL para que funcione si se accede desde otro dispositivo (ej. teléfono)
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    // Si estamos en el navegador del teléfono, usa la IP del host en lugar de 127.0.0.1
    return `http://${window.location.hostname}:8000/api`;
  }
  return 'http://127.0.0.1:8000/api'; // Fallback para SSR
};

const API_URL = getApiUrl();

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
