import type { 
  User, 
  ProducerProfile, 
  CompanyProfile, 
  CreditPlan, 
  CreditApplication,
  AdminStats 
} from './types';

// Usuarios de prueba
export const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    username: 'productor1',
    email: 'juan.perez@email.com',
    role: 'producer',
    password: '123456',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    username: 'productor2',
    email: 'maria.garcia@email.com',
    role: 'producer',
    password: '123456',
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: 3,
    username: 'bancoverde',
    email: 'contacto@bancoverde.com',
    role: 'company',
    password: '123456',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 4,
    username: 'agrobank',
    email: 'info@agrobank.com',
    role: 'company',
    password: '123456',
    createdAt: '2024-03-01T11:00:00Z'
  },
  {
    id: 5,
    username: 'admin',
    email: 'admin@agrifinance.com',
    role: 'admin',
    password: 'admin123',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Perfiles de productores
export const mockProducerProfiles: ProducerProfile[] = [
  {
    id: 1,
    userId: 1,
    farmName: 'Hacienda Los Alamos',
    address: 'Sector El Milagro, Municipio Paez, Estado Portuguesa',
    rif: 'V-12345678-9',
    nationalId: '12345678',
    phoneNumber: '+58 412 1234567',
    totalArea: 150,
    cultivatedArea: 120,
    landTenure: 'OWNED',
    machineryInventory: '2 tractores John Deere, 1 cosechadora, sistema de riego por goteo',
    roadCondition: 'REGULAR',
    mainActivity: 'Cultivo de Maiz y Sorgo'
  },
  {
    id: 2,
    userId: 2,
    farmName: 'Finca Santa Maria',
    address: 'Via principal, Municipio Guanare, Estado Portuguesa',
    rif: 'V-87654321-0',
    nationalId: '87654321',
    phoneNumber: '+58 414 7654321',
    totalArea: 80,
    cultivatedArea: 65,
    landTenure: 'RENTED',
    machineryInventory: '1 tractor, herramientas manuales',
    roadCondition: 'DIFFICULT',
    mainActivity: 'Ganaderia Bovina y Cultivo de Pasto'
  }
];

// Perfiles de empresas
export const mockCompanyProfiles: CompanyProfile[] = [
  {
    id: 1,
    userId: 3,
    companyName: 'Banco Verde',
    rif: 'J-12345678-9',
    legalName: 'Banco Verde C.A.',
    corporatePhone: '+58 212 1234567',
    website: 'https://bancoverde.com',
    fiscalAddress: 'Av. Principal, Torre Banco Verde, Caracas',
    companyType: 'BANK',
    description: 'Institucion financiera especializada en creditos para el sector agricola venezolano con mas de 20 anos de experiencia.',
    responseTime: '3 a 5 dias habiles',
    status: 'verified'
  },
  {
    id: 2,
    userId: 4,
    companyName: 'AgroBank',
    rif: 'J-98765432-1',
    legalName: 'AgroBank Inversiones C.A.',
    corporatePhone: '+58 212 9876543',
    website: 'https://agrobank.com.ve',
    fiscalAddress: 'Centro Empresarial, Piso 5, Valencia',
    companyType: 'PRIVATE_FUND',
    description: 'Fondo de inversion privado dedicado al financiamiento de proyectos agricolas sustentables.',
    responseTime: '5 a 7 dias habiles',
    status: 'pending'
  }
];

// Planes de credito
export const mockCreditPlans: CreditPlan[] = [
  {
    id: 1,
    companyId: 1,
    companyName: 'Banco Verde',
    title: 'Microcredito Semillas Maiz 2026',
    description: 'Financiamiento para la adquisicion de semillas certificadas de maiz. Incluye asesoria tecnica gratuita durante todo el ciclo de cultivo. Tasa preferencial para productores con historial crediticio.',
    agriculturalSector: 'Cerealero',
    minAmount: 500,
    maxAmount: 5000,
    interestRate: 12.5,
    termMonths: 12,
    isActive: true,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    companyId: 1,
    companyName: 'Banco Verde',
    title: 'Credito Maquinaria Agricola',
    description: 'Financiamiento para la compra de tractores, cosechadoras y equipos agricolas. Hasta 60 meses para pagar con periodo de gracia de 6 meses.',
    agriculturalSector: 'General',
    minAmount: 10000,
    maxAmount: 100000,
    interestRate: 15.0,
    termMonths: 60,
    isActive: true,
    createdAt: '2024-02-15T14:00:00Z'
  },
  {
    id: 3,
    companyId: 1,
    companyName: 'Banco Verde',
    title: 'Financiamiento Sistema de Riego',
    description: 'Credito especial para instalacion de sistemas de riego por goteo o aspersion. Apoyo tecnico incluido para optimizar el uso del agua.',
    agriculturalSector: 'General',
    minAmount: 2000,
    maxAmount: 25000,
    interestRate: 10.0,
    termMonths: 36,
    isActive: true,
    createdAt: '2024-03-01T09:00:00Z'
  },
  {
    id: 4,
    companyId: 1,
    companyName: 'Banco Verde',
    title: 'Credito Avicola Integral',
    description: 'Financiamiento completo para proyectos avicolas: construccion de galpones, compra de aves, alimento y equipos. Ideal para nuevos emprendedores.',
    agriculturalSector: 'Avicola',
    minAmount: 5000,
    maxAmount: 50000,
    interestRate: 14.0,
    termMonths: 48,
    isActive: true,
    createdAt: '2024-03-10T11:00:00Z'
  },
  {
    id: 5,
    companyId: 1,
    companyName: 'Banco Verde',
    title: 'Microcredito Hortalizas',
    description: 'Pequeno credito para productores de hortalizas. Rapida aprobacion y desembolso en 48 horas. Sin garantias para montos menores a $1,000.',
    agriculturalSector: 'Horticola',
    minAmount: 200,
    maxAmount: 3000,
    interestRate: 11.0,
    termMonths: 6,
    isActive: true,
    createdAt: '2024-03-15T16:00:00Z'
  }
];

// Solicitudes de credito
export const mockCreditApplications: CreditApplication[] = [
  {
    id: 1,
    creditPlanId: 1,
    creditPlanTitle: 'Microcredito Semillas Maiz 2026',
    producerId: 1,
    producerName: 'Juan Perez',
    farmName: 'Hacienda Los Alamos',
    status: 'approved',
    appliedAt: '2024-02-01T10:00:00Z',
    reviewedAt: '2024-02-05T14:00:00Z'
  },
  {
    id: 2,
    creditPlanId: 3,
    creditPlanTitle: 'Financiamiento Sistema de Riego',
    producerId: 1,
    producerName: 'Juan Perez',
    farmName: 'Hacienda Los Alamos',
    status: 'pending',
    appliedAt: '2024-03-20T09:00:00Z'
  },
  {
    id: 3,
    creditPlanId: 2,
    creditPlanTitle: 'Credito Maquinaria Agricola',
    producerId: 2,
    producerName: 'Maria Garcia',
    farmName: 'Finca Santa Maria',
    status: 'under_review',
    appliedAt: '2024-03-18T11:00:00Z'
  }
];

// Estadisticas del admin
export const mockAdminStats: AdminStats = {
  totalProducers: 2,
  totalCompanies: 2,
  pendingCompanies: 1,
  totalCreditPlans: 5,
  totalApplications: 3
};

// Funcion auxiliar para formatear moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Funcion auxiliar para formatear fecha
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
}

// Mapeo de estados a espanol
export const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  under_review: 'En Revision',
  verified: 'Verificado'
};

export const landTenureLabels: Record<string, string> = {
  OWNED: 'Propia',
  RENTED: 'Alquilada',
  AWARDED: 'Adjudicada'
};

export const roadConditionLabels: Record<string, string> = {
  OPTIMAL: 'Optimo',
  REGULAR: 'Regular',
  DIFFICULT: 'Dificil'
};

export const companyTypeLabels: Record<string, string> = {
  BANK: 'Banco',
  PRIVATE_FUND: 'Fondo Privado',
  COOPERATIVE: 'Cooperativa',
  INVESTOR: 'Inversionista'
};
