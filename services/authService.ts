import api from '@/lib/api';

interface LoginResponse {
  access: string;
  refresh: string;
  // A veces el backend personalizado devuelve los datos del usuario junto al token.
  // Lo definiremos genéricamente para soportar la lectura
  user?: any; 
}

export const authService = {
  /**
   * Envía las credenciales a Django para obtener el JWT y los datos de usuario
   */
  async login(username: string, password: string) {
    try {
      const response = await api.post<LoginResponse>('/token/', {
        username,
        password
      });
      
      const { access, refresh, user } = response.data;
      
      // Guardamos tokens para futuros interceptores
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
      }

      return {
        success: true,
        data: { access, refresh, user },
      };
    } catch (error: any) {
      // NOTA: Usamos console.warn en lugar de console.error para evitar que 
      // Next.js salte con el recuadro rojo (Error Overlay) en modo desarrollo 
      // cuando el servidor Django está apagado o da errores de CORS.
      console.warn("Fallo de conexion real con Django (Fallback activado):", error.message);
      
      // Manejo estandar de errores de Axios
      let errorMessage = 'Error al conectar con el servidor';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Servidor Django apagado o error de CORS';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Limpia el entorno y tokens guardados
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('agrifinance_user');
    }
  },

  /**
   * Obtiene el perfil completo del usuario autenticado
   */
  async getMe() {
    try {
      const response = await api.get('/accounts/users/me/');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.warn("Error al obtener perfil:", error.message);
      return { success: false, error: 'Error al obtener perfil' };
    }
  },

  async registerProducer(data: any) {
    try {
      const response = await api.post('/accounts/register/producer/', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      let errorMessage = 'Error al registrar productor';
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          errorMessage = Object.values(error.response.data).flat().join(', ') || errorMessage;
        } else {
          errorMessage = error.response.data.detail || errorMessage;
        }
      }
      return { success: false, error: errorMessage };
    }
  },

  async registerCompany(data: any) {
    try {
      const response = await api.post('/accounts/register/company/', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      let errorMessage = 'Error al registrar empresa';
      if (error.response?.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          errorMessage = Object.values(error.response.data).flat().join(', ') || errorMessage;
        } else {
          errorMessage = error.response.data.detail || errorMessage;
        }
      }
      return { success: false, error: errorMessage };
    }
  }
};
