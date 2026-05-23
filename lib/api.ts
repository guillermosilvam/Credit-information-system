import axios from 'axios';

// Determinamos dinámicamente la URL para que funcione si se accede desde otro dispositivo (ej. teléfono)
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/,'').replace(/\/$/, '');
  if (typeof window !== 'undefined') {
    // Si estamos en el navegador del teléfono, usa la IP del host en lugar de 127.0.0.1
    return `http://${window.location.hostname}:8000`;
  }
  return 'http://127.0.0.1:8000'; // Fallback para SSR
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para ajustar la ruta y inyectar via Header el Token JWT devuelto por simplejwt
api.interceptors.request.use(
  (config) => {
    // Ajustar URL: si la llamada no es una URL completa y no contiene /api, anteponer /api
    if (config && typeof config.url === 'string') {
      const isFullUrl = config.url.startsWith('http://') || config.url.startsWith('https://');
      if (!isFullUrl) {
        if (!config.url.startsWith('/api')) {
          // asegurar leading slash
          if (!config.url.startsWith('/')) config.url = '/' + config.url;
          config.url = `/api${config.url}`;
        }
      }
    }

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

let isRefreshing = false;
let pendingRequests: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processPendingRequests = (error: any, token: string | null = null) => {
  pendingRequests.forEach((req) => {
    if (token) {
      req.resolve(token);
    } else {
      req.reject(error);
    }
  });
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        localStorage.removeItem('access_token');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        processPendingRequests(null, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processPendingRequests(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('agrifinance_user');
        localStorage.removeItem('session_start');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
