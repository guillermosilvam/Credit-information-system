'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Building2, Globe, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { companyTypeLabels } from '@/lib/formatters';
import { accountService } from '@/services/accountService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { CompanyType, CompanyProfile } from '@/lib/types';

function mapApiProfileToCompany(apiProfile: any, userId: number): CompanyProfile {
  return {
    id: apiProfile.id,
    userId,
    companyName: apiProfile.company_name || '',
    rif: apiProfile.rif || '',
    legalName: apiProfile.legal_name || '',
    corporatePhone: apiProfile.corporate_phone || '',
    website: apiProfile.website || '',
    fiscalAddress: apiProfile.fiscal_address || '',
    companyType: apiProfile.company_type as CompanyType | undefined,
    description: apiProfile.description || '',
    responseTime: apiProfile.response_time || '',
    status: apiProfile.status || 'pending',
  };
}

export default function PerfilEmpresaPage() {
  const { user, companyProfile: contextProfile, updateCompanyProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [localProfile, setLocalProfile] = useState<CompanyProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(!contextProfile);

  const activeProfile = localProfile || contextProfile;

  const [formData, setFormData] = useState(() => ({
    username: user?.username || '',
    companyName: activeProfile?.companyName || '',
    rif: activeProfile?.rif || '',
    legalName: activeProfile?.legalName || '',
    corporatePhone: activeProfile?.corporatePhone || '',
    website: activeProfile?.website || '',
    fiscalAddress: activeProfile?.fiscalAddress || '',
    companyType: activeProfile?.companyType || '',
    description: activeProfile?.description || '',
    responseTime: activeProfile?.responseTime || '',
  }));
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const syncFormWithProfile = useCallback((profile: CompanyProfile, usr: typeof user) => {
    setFormData({
      username: usr?.username || '',
      companyName: profile.companyName || '',
      rif: profile.rif || '',
      legalName: profile.legalName || '',
      corporatePhone: profile.corporatePhone || '',
      website: profile.website || '',
      fiscalAddress: profile.fiscalAddress || '',
      companyType: profile.companyType || '',
      description: profile.description || '',
      responseTime: profile.responseTime || '',
    });
  }, []);

  useEffect(() => {
    if (contextProfile) {
      setLocalProfile(contextProfile);
      setPageLoading(false);
      return;
    }

    if (!user) return;

    const loadProfile = async () => {
      try {
        const res = await authService.getMe();
        if (res.success && res.data) {
          const fullUser = res.data;
          if (fullUser.is_company && fullUser.profile) {
            const mapped = mapApiProfileToCompany(fullUser.profile, user.id);
            setLocalProfile(mapped);
          }
        }
      } catch (e) {
        console.error('Error loading company profile', e);
      } finally {
        setPageLoading(false);
      }
    };
    loadProfile();
  }, [contextProfile, user]);

  useEffect(() => {
    if (activeProfile) {
      syncFormWithProfile(activeProfile, user);
    }
  }, [activeProfile, user, syncFormWithProfile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) {
      toast.error('Por favor corrija el nombre de usuario');
      return;
    }

    setIsLoading(true);
    try {
      const currentUsername = user?.username || '';
      if (formData.username && formData.username !== currentUsername) {
        await accountService.updateUserMe({ username: formData.username });
        const updatedUser = { ...user, username: formData.username };
        localStorage.setItem('agrifinance_user', JSON.stringify(updatedUser));
      }

      const res = await updateCompanyProfile({
        companyName: formData.companyName,
        rif: formData.rif,
        legalName: formData.legalName,
        corporatePhone: formData.corporatePhone,
        website: formData.website,
        fiscalAddress: formData.fiscalAddress,
        companyType: formData.companyType as CompanyType,
        description: formData.description,
        responseTime: formData.responseTime,
      });

      if (!res || (res as any).success === false) throw new Error('Error saving');
      toast.success('Perfil actualizado correctamente');
    } catch (e:any) {
      toast.error(e.response?.data?.detail || e.message || 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (activeProfile?.status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verificado</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return null;
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Perfil de Empresa</h1>
          <p className="text-muted-foreground">
            Administre la información de su entidad financiera
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Información de la Empresa
                </CardTitle>
                <CardDescription>
                  Datos legales y comerciales de su entidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre Comercial</Label>
                    <Input
                      id="companyName"
                      maxLength={80}
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      placeholder="Mi Empresa C.A."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rif">RIF</Label>
                    <Input
                      id="rif"
                      maxLength={12}
                      value={formData.rif}
                      onChange={(e) => handleChange('rif', e.target.value)}
                      placeholder="J-12345678-9"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Razon Social</Label>
                    <Input
                      id="legalName"
                      maxLength={80}
                      value={formData.legalName}
                      onChange={(e) => handleChange('legalName', e.target.value)}
                      placeholder="Nombre legal completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Tipo de Entidad</Label>
                    <Select
                      value={formData.companyType}
                      onValueChange={(value) => handleChange('companyType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(companyTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalAddress">Dirección Fiscal</Label>
                  <Textarea
                    id="fiscalAddress"
                    maxLength={200}
                    value={formData.fiscalAddress}
                    onChange={(e) => handleChange('fiscalAddress', e.target.value)}
                    placeholder="Dirección completa de la sede principal"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripcion de la Empresa</Label>
                  <Textarea
                    id="description"
                    maxLength={255}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Breve descripcion de su empresa y servicios"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contacto
                </CardTitle>
                <CardDescription>
                  Información de contacto corporativo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="corporatePhone">Teléfono Corporativo</Label>
                    <Input
                      id="corporatePhone"
                      inputMode="tel"
                      maxLength={12}
                      value={formData.corporatePhone}
                      onChange={(e) => handleChange('corporatePhone', e.target.value)}
                      placeholder="212-1234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      type="url"
                      maxLength={200}
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://miempresa.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responseTime">Tiempo de Respuesta</Label>
                  <Input
                    id="responseTime"
                    maxLength={40}
                    value={formData.responseTime}
                    onChange={(e) => handleChange('responseTime', e.target.value)}
                    placeholder="Ej: 3 a 5 dias habiles"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tiempo estimado para responder solicitudes de credito
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Usuario</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    onBlur={async () => {
                      const current = user?.username || '';
                      if (formData.username && formData.username !== current) {
                        try {
                          const res = await accountService.checkUsernameAvailability(formData.username);
                          if (!res.available) setUsernameError('Nombre de usuario no disponible');
                          else setUsernameError(null);
                        } catch (e) {
                          // ignore
                        }
                      } else {
                        setUsernameError(null);
                      }
                    }}
                    className={usernameError ? 'border border-destructive' : ''}
                  />
                  {usernameError && <p className="text-xs text-destructive mt-1">{usernameError}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <Input value={user?.email || ''} disabled className="bg-muted" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Verificacion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activeProfile?.status === 'verified' ? 'bg-green-500' :
                    activeProfile?.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      {activeProfile?.status === 'verified' ? 'Empresa Verificada' :
                       activeProfile?.status === 'pending' ? 'Pendiente de Aprobación' : 'Rechazada'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activeProfile?.status === 'verified' 
                        ? 'Su empresa está autorizada para publicar planes de crédito'
                        : 'Un administrador revisará su solicitud'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
