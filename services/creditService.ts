import api from '@/lib/api';

export interface CreditPlanResponse {
  id: number;
  company: number;
  company_name?: string; // Si el backend lo provee
  title: string;
  description: string;
  agricultural_sector: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  term_months: number;
  is_active: boolean;
  created_at: string;
}

export interface CreditApplicationResponse {
  id: number;
  producer: number;
  producer_profile?: any;
  credit_plan: number;
  credit_plan_title: string;
  status: string;
  application_date: string;
  updated_at: string;
}

export const creditService = {
  // === PLANES DE CRÉDITO ===
  getPlans: async (): Promise<CreditPlanResponse[]> => {
    const response = await api.get('/credits/plans/');
    return response.data;
  },

  // Obtener un plan por id
  getPlan: async (id: number): Promise<CreditPlanResponse> => {
    const response = await api.get(`/credits/plans/${id}/`);
    return response.data;
  },

  createPlan: async (data: Partial<CreditPlanResponse>) => {
    const response = await api.post('/credits/plans/', data);
    return response.data;
  },

  updatePlan: async (id: number, data: Partial<CreditPlanResponse>) => {
    const response = await api.patch(`/credits/plans/${id}/`, data);
    return response.data;
  },

  deletePlan: async (id: number) => {
    const response = await api.delete(`/credits/plans/${id}/`);
    return response.data;
  },

  // === SOLICITUDES DE CRÉDITO ===
  getApplications: async (): Promise<CreditApplicationResponse[]> => {
    const response = await api.get('/credits/applications/');
    return response.data;
  },

  applyForCredit: async (planId: number) => {
    const response = await api.post('/credits/applications/', { credit_plan: planId });
    return response.data;
  },

  updateApplicationStatus: async (id: number, status: string) => {
    const response = await api.patch(`/credits/applications/${id}/`, { status });
    return response.data;
  },
};
