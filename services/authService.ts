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
      console.error("Error conectando con Django:", error);
      
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
  }
};
