export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0';
  
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'Fecha no disponible';
  try {
    return new Intl.DateTimeFormat('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
}

export const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  under_review: 'En Revisión',
  verified: 'Verificado'
};

export const landTenureLabels: Record<string, string> = {
  OWNED: 'Propia',
  RENTED: 'Alquilada',
  AWARDED: 'Adjudicada'
};

export const roadConditionLabels: Record<string, string> = {
  OPTIMAL: 'Óptimo',
  REGULAR: 'Regular',
  DIFFICULT: 'Difícil'
};

export const companyTypeLabels: Record<string, string> = {
  BANK: 'Banco',
  PRIVATE_FUND: 'Fondo Privado',
  COOPERATIVE: 'Cooperativa',
  INVESTOR: 'Inversionista'
};

