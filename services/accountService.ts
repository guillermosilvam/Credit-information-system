import api from '@/lib/api';

// Tipos base (deberían coincidir con lib/types.ts pero definimos los DTOs aquí)
export interface ProducerProfileResponse {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  farm_name: string;
  address: string;
  rif?: string;
  national_id?: string;
  phone_number?: string;
  total_area?: number;
  cultivated_area?: number;
  land_tenure?: string;
  machinery_inventory?: string;
  road_condition?: string;
  main_activity?: string;
}

export interface CompanyProfileResponse {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  company_name: string;
  rif: string;
  legal_name?: string;
  corporate_phone?: string;
  website?: string;
  fiscal_address?: string;
  company_type?: string;
  description?: string;
  response_time?: string;
  status: string;
  is_verified_at?: string;
}

export const accountService = {
  // === ADMINISTRADOR ===
  getCompanies: async (): Promise<CompanyProfileResponse[]> => {
    const response = await api.get('/accounts/company/');
    return response.data;
  },

  getProducers: async (): Promise<ProducerProfileResponse[]> => {
    const response = await api.get('/accounts/producer/');
    return response.data;
  },

  reviewCompany: async (id: number, status: 'verified' | 'rejected') => {
    const response = await api.post(`/accounts/company/${id}/review/`, { status });
    return response.data;
  },

  exportProducer: async (id: number) => {
    const response = await api.get(`/accounts/producer/${id}/export/`, {
      responseType: 'blob'
    });
    return response.data;
  },

  exportCompany: async (id: number) => {
    const response = await api.get(`/accounts/company/${id}/export/`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // === PRODUCTORES / EMPRESAS (PERFIL) ===
  // Nota: Estas rutas asumen que el backend provee estos endpoints. 
  // Para actualizar perfil, normalmente sería PUT /accounts/producer/{id}/
  updateProducerProfile: async (id: number, data: Partial<ProducerProfileResponse>) => {
    const response = await api.patch(`/accounts/producer/${id}/`, data);
    return response.data;
  },

  updateCompanyProfile: async (id: number, data: Partial<CompanyProfileResponse>) => {
    const response = await api.patch(`/accounts/company/${id}/`, data);
    return response.data;
  }
};
