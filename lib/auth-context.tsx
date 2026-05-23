'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, ProducerProfile, CompanyProfile } from './types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  producerProfile: ProducerProfile | null;
  companyProfile: CompanyProfile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProducerProfile: (profile: Partial<ProducerProfile>) => Promise<{ success: boolean; error?: string } | undefined>;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => Promise<{ success: boolean; error?: string } | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función sencilla para leer el contenido del token localmente por si Django no devuelve "user"
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [producerProfile, setProducerProfile] = useState<ProducerProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const meResponse = await authService.getMe();
      if (meResponse.success && meResponse.data) {
        const fullUser = meResponse.data;
        // Permitir que un usuario tenga ambos perfiles y setearlos independientemente
        if (fullUser.is_producer && fullUser.profile) {
          const p = fullUser.profile;
          setProducerProfile({
            id: p.id,
            userId: currentUser.id,
            farmName: p.farm_name,
            address: p.address,
            rif: p.rif,
            nationalId: p.national_id,
            phoneNumber: p.phone_number,
            totalArea: p.total_area ? Number(p.total_area) : undefined,
            cultivatedArea: p.cultivated_area ? Number(p.cultivated_area) : undefined,
            landTenure: p.land_tenure as any,
            machineryInventory: p.machinery_inventory,
            roadCondition: p.road_condition as any,
            mainActivity: p.main_activity,
          });
        }
        if (fullUser.is_company && fullUser.profile) {
          const c = fullUser.profile;
          setCompanyProfile({
            id: c.id,
            userId: currentUser.id,
            companyName: c.company_name,
            rif: c.rif,
            legalName: c.legal_name,
            corporatePhone: c.corporate_phone,
            website: c.website,
            fiscalAddress: c.fiscal_address,
            companyType: c.company_type as any,
            description: c.description,
            responseTime: c.response_time,
            status: c.status as any,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching profile', e);
    }
  };

  // Cargar usuario persistido en Production de localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('agrifinance_user');
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setUser(parsed);
        // Recuperar perfil desde el backend
        fetchProfile(parsed);
      } catch (e) {
        console.error('Error parseando sesion:', e);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Si existe token pero no hay usuario persistido, intentar obtener perfil desde el backend
    if (accessToken) {
      (async () => {
        try {
          setIsLoading(true);
          const meResponse = await authService.getMe();
          if (meResponse.success && meResponse.data) {
            const fullUser = meResponse.data;
            // Construimos un usuario básico si el backend no devuelve el objecto user completo
            const parsedUser: User = {
              id: Number(fullUser.id || fullUser.user?.id || Date.now()),
              username: fullUser.username || fullUser.user?.username || 'user',
              email: fullUser.email || fullUser.user?.email || '',
              role: fullUser.is_company ? 'company' : (fullUser.is_producer ? 'producer' : 'producer'),
              createdAt: new Date().toISOString(),
            };

            setUser(parsedUser);
            localStorage.setItem('agrifinance_user', JSON.stringify(parsedUser));
            await fetchProfile(parsedUser);
          }
        } catch (e) {
          console.error('Error recuperando perfil desde token:', e);
        } finally {
          setIsLoading(false);
        }
      })();
      return;
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // --- INTENTO UNICO Y REAL POR EL BACKEND (AXIOS) ---
    const apiResponse = await authService.login(username, password);
    
    if (apiResponse.success && apiResponse.data) {
      const { access, user: backendUser } = apiResponse.data;
      
      // Si SimpleJWT ya te modificaste para devolver el objeto User, lo usamos.
      // Si no, decodificamos el JWT para tratar de adivinar sus permisos de forma inteligente local
      let parsedUser: User;

      if (backendUser) {
        parsedUser = backendUser;
      } else {
        const decoded = parseJwt(access);
        const autoRole = username.toLowerCase().includes('admin') 
                            ? 'admin' 
                            : (username.toLowerCase().includes('empresa') ? 'company' : 'producer');
        
        parsedUser = {
          id: Number(decoded?.user_id || Date.now()),
          username: username,
          email: username.includes('@') ? username : `${username}@sigefa.com`,
          role: autoRole,
          createdAt: new Date().toISOString()
        };
      }

      setUser(parsedUser);
      localStorage.setItem('agrifinance_user', JSON.stringify(parsedUser));
      
      // Fetch profile to populate producerProfile or companyProfile
      await fetchProfile(parsedUser);
      
      setIsLoading(false);
      return { success: true };
    } 

    // FALLARON LAS CREDENCIALES O EL BACKEND RECHAZÓ
    setIsLoading(false);
    return { success: false, error: apiResponse.error || 'Credenciales rechazadas por el Servidor' };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProducerProfile(null);
    setCompanyProfile(null);
  };

  const updateProducerProfile = async (updates: Partial<ProducerProfile>) => {
    if (!producerProfile) return { success: false, error: 'No producer profile' };
    try {
      // Persistir en backend
      const payload: any = {
        farm_name: updates.farmName,
        address: updates.address,
        rif: updates.rif,
        national_id: updates.nationalId,
        phone_number: updates.phoneNumber,
        total_area: updates.totalArea,
        cultivated_area: updates.cultivatedArea,
        land_tenure: updates.landTenure,
        machinery_inventory: updates.machineryInventory,
        road_condition: updates.roadCondition,
        main_activity: updates.mainActivity,
      };

      await (await import('@/services/accountService')).accountService.updateProducerProfile(producerProfile.id, payload);

      // Si actualiza username/email, actualizamos user también (caller should include those via updateUserMe separately)
      setProducerProfile({ ...producerProfile, ...updates });
      localStorage.setItem('agrifinance_user', JSON.stringify(user));
      return { success: true };
    } catch (e:any) {
      console.error('Error updating producer profile', e);
      return { success: false, error: 'Error updating producer profile' };
    }
  };

  const updateCompanyProfile = async (updates: Partial<CompanyProfile>) => {
    if (!companyProfile) return { success: false, error: 'No company profile' };
    try {
      const payload: any = {
        company_name: updates.companyName,
        rif: updates.rif,
        legal_name: updates.legalName,
        corporate_phone: updates.corporatePhone,
        website: updates.website,
        fiscal_address: updates.fiscalAddress,
        company_type: updates.companyType,
        description: updates.description,
        response_time: updates.responseTime,
      };

      await (await import('@/services/accountService')).accountService.updateCompanyProfile(companyProfile.id, payload);
      setCompanyProfile({ ...companyProfile, ...updates });
      localStorage.setItem('agrifinance_user', JSON.stringify(user));
      return { success: true };
    } catch (e:any) {
      console.error('Error updating company profile', e);
      return { success: false, error: 'Error updating company profile' };
    }
  };

  useEffect(() => {
    // Poll profile periodically for company accounts so verification status updates in real time
    if (!user || user.role !== 'company') return;
    const iv = setInterval(async () => {
      try {
        await fetchProfile(user);
      } catch (e) {
        // ignore errors
      }
    }, 30000); // 30s
    return () => clearInterval(iv);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, producerProfile, companyProfile, isLoading, login, logout, 
      updateProducerProfile, updateCompanyProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}
