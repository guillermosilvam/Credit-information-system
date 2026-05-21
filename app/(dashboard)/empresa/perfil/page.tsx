'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, Globe, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { companyTypeLabels } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { CompanyType } from '@/lib/types';

export default function PerfilEmpresaPage() {
  const { user, companyProfile, updateCompanyProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    rif: '',
    legalName: '',
    corporatePhone: '',
    website: '',
    fiscalAddress: '',
    companyType: '',
    description: '',
    responseTime: '',
  });

  useEffect(() => {
    if (companyProfile) {
      setFormData({
        companyName: companyProfile.companyName || '',
        rif: companyProfile.rif || '',
        legalName: companyProfile.legalName || '',
        corporatePhone: companyProfile.corporatePhone || '',
        website: companyProfile.website || '',
        fiscalAddress: companyProfile.fiscalAddress || '',
        companyType: companyProfile.companyType || '',
        description: companyProfile.description || '',
        responseTime: companyProfile.responseTime || '',
      });
    }
  }, [companyProfile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateCompanyProfile({
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
    
    setIsLoading(false);
    toast.success('Perfil actualizado correctamente');
  };

  const getStatusBadge = () => {
    switch (companyProfile?.status) {
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
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      placeholder="Mi Empresa C.A."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rif">RIF</Label>
                    <Input
                      id="rif"
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
                      value={formData.corporatePhone}
                      onChange={(e) => handleChange('corporatePhone', e.target.value)}
                      placeholder="+58 212 1234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      type="url"
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
                  <Input value={user?.username || ''} disabled className="bg-muted" />
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
                    companyProfile?.status === 'verified' ? 'bg-green-500' :
                    companyProfile?.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      {companyProfile?.status === 'verified' ? 'Empresa Verificada' :
                       companyProfile?.status === 'pending' ? 'Pendiente de Aprobación' : 'Rechazada'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {companyProfile?.status === 'verified' 
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
