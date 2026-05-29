// Tipos de usuario
export type UserRole = 'producer' | 'company' | 'admin' | 'staff';
export type CompanyType = 'BANK' | 'PRIVATE_FUND' | 'COOPERATIVE' | 'INVESTOR';
export type CompanyStatus = 'pending' | 'verified' | 'rejected';
export type LandTenure = 'OWNED' | 'RENTED' | 'AWARDED';
export type RoadCondition = 'OPTIMAL' | 'REGULAR' | 'DIFFICULT';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Usuario base
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Perfil de Productor
export interface ProducerProfile {
  id: number;
  userId: number;
  farmName: string;
  address: string;
  rif?: string;
  nationalId?: string;
  phoneNumber?: string;
  totalArea?: number;
  cultivatedArea?: number;
  landTenure?: LandTenure;
  machineryInventory?: string;
  roadCondition?: RoadCondition;
  mainActivity?: string;
}

// Perfil de Empresa
export interface CompanyProfile {
  id: number;
  userId: number;
  companyName: string;
  rif: string;
  legalName?: string;
  corporatePhone?: string;
  website?: string;
  fiscalAddress?: string;
  companyType?: CompanyType;
  description?: string;
  responseTime?: string;
  status: CompanyStatus;
}

// Plan de Credito
export interface CreditPlan {
  id: number;
  companyId: number;
  companyName: string;
  title: string;
  description: string;
  agriculturalSector: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  termMonths: number;
  isActive: boolean;
  createdAt: string;
}

// Solicitud de Credito
export interface CreditApplication {
  id: number;
  creditPlanId: number;
  creditPlanTitle: string;
  producerId: number;
  producerName: string;
  farmName: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
}

// Formularios de registro
export interface ProducerRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  farmName: string;
  address: string;
  rif?: string;
  nationalId?: string;
  phoneNumber?: string;
  totalArea?: number;
  cultivatedArea?: number;
  landTenure?: LandTenure;
  machineryInventory?: string;
  roadCondition?: RoadCondition;
  mainActivity?: string;
}

export interface CompanyRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  rif: string;
  legalName?: string;
  corporatePhone?: string;
  website?: string;
  fiscalAddress?: string;
  companyType?: CompanyType;
  description?: string;
  responseTime?: string;
}

// Estadisticas del dashboard admin
export interface AdminStats {
  totalProducers: number;
  totalCompanies: number;
  pendingCompanies: number;
  totalCreditPlans: number;
  totalApplications: number;
}
