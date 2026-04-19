'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, ProducerProfile, CompanyProfile } from './types';
import { mockUsers, mockProducerProfiles, mockCompanyProfiles } from './mock-data';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  producerProfile: ProducerProfile | null;
  companyProfile: CompanyProfile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProducerProfile: (profile: Partial<ProducerProfile>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [producerProfile, setProducerProfile] = useState<ProducerProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario de localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('agrifinance_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser) as User;
      setUser(parsed);
      
      // Cargar perfil correspondiente
      if (parsed.role === 'producer') {
        const profile = mockProducerProfiles.find(p => p.userId === parsed.id);
        setProducerProfile(profile || null);
      } else if (parsed.role === 'company') {
        const profile = mockCompanyProfiles.find(c => c.userId === parsed.id);
        setCompanyProfile(profile || null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // 1. INTENTO REAL POR EL BACKEND (AXIOS)
    const apiResponse = await authService.login(username, password);
    
    if (apiResponse.success) {
      console.log('¡Conexión real a Django Exitosa! Token:', apiResponse.data?.access);
      // Aqui asimilariamos los datos del usuario devueltos por el backend
      // ej: const realUser = apiResponse.data.user;
    } else {
      console.error('El backend real falló. Detalle:', apiResponse.error);
      // En una aplicación en producción, haríamos RETURN aquí en caso de error.
      // return { success: false, error: apiResponse.error };
    }

    // 2. FALLBACK A MOCK DATA (Para mantener la tesis y UI operativas si Django está apagado o falla)
    console.warn('Usando base de datos simulada (Fallback) por motivos de interfaz...');
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (!foundUser) {
      setIsLoading(false);
      return { success: false, error: 'Usuario o contrasena incorrectos' };
    }

    if (foundUser.role === 'company') {
      const companyProfile = mockCompanyProfiles.find(c => c.userId === foundUser.id);
      if (companyProfile?.status === 'pending') {
        setIsLoading(false);
        return { success: false, error: 'Su cuenta de empresa esta pendiente de aprobacion' };
      }
      if (companyProfile?.status === 'rejected') {
        setIsLoading(false);
        return { success: false, error: 'Su cuenta de empresa ha sido rechazada' };
      }
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('agrifinance_user', JSON.stringify(userWithoutPassword));

    if (foundUser.role === 'producer') {
      const profile = mockProducerProfiles.find(p => p.userId === foundUser.id);
      setProducerProfile(profile || null);
    } else if (foundUser.role === 'company') {
      const profile = mockCompanyProfiles.find(c => c.userId === foundUser.id);
      setCompanyProfile(profile || null);
    }

    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProducerProfile(null);
    setCompanyProfile(null);
    localStorage.removeItem('agrifinance_user');
  };

  const updateProducerProfile = (updates: Partial<ProducerProfile>) => {
    if (producerProfile) {
      setProducerProfile({ ...producerProfile, ...updates });
    }
  };

  const updateCompanyProfile = (updates: Partial<CompanyProfile>) => {
    if (companyProfile) {
      setCompanyProfile({ ...companyProfile, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      producerProfile,
      companyProfile,
      isLoading,
      login,
      logout,
      updateProducerProfile,
      updateCompanyProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
