'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import type { CompanyRegisterForm, CompanyType } from '@/lib/types';
import { authService } from '@/services/authService';

export default function RegistroEmpresaPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyRegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    rif: '',
    legalName: '',
    corporatePhone: '',
    website: '',
    fiscalAddress: '',
    companyType: undefined,
    description: '',
    responseTime: ''
  });

  const updateFormData = (field: keyof CompanyRegisterForm, value: string | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Complete todos los campos de la cuenta');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (!formData.companyName || !formData.rif) {
      toast.error('El nombre de empresa y RIF son obligatorios');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const response = await authService.registerCompany({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      company_name: formData.companyName,
      rif: formData.rif,
      legal_name: formData.legalName || undefined,
      corporate_phone: formData.corporatePhone || undefined,
      website: formData.website || undefined,
      fiscal_address: formData.fiscalAddress || undefined,
      company_type: formData.companyType,
      description: formData.description || undefined,
      response_time: formData.responseTime || undefined
    });
    
    setIsLoading(false);
    
    if (response.success) {
      toast.success('Solicitud enviada. Un administrador revisara su cuenta.');
      router.push('/login');
    } else {
      toast.error(response.error || 'Error al enviar solicitud de registro');
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Button asChild variant="ghost" size="sm" className="gap-1 px-2">
            <Link href="/registro">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
          </Button>
        </div>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-secondary" />
          Registro de Empresa
        </CardTitle>
        <CardDescription>
          Complete el formulario para solicitar una cuenta empresarial
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <Alert className="bg-secondary/10 border-secondary/20">
            <AlertDescription className="text-sm">
              Las cuentas empresariales requieren aprobacion por un administrador. 
              Recibira una notificacion cuando su cuenta sea verificada.
            </AlertDescription>
          </Alert>

          {/* Datos de la Cuenta */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Datos de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario *</Label>
                <Input
                  id="username"
                  placeholder="usuario_empresa"
                  value={formData.username}
                  onChange={(e) => updateFormData('username', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita la contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Datos de la Empresa */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Datos de la Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nombre Comercial *</Label>
                <Input
                  id="companyName"
                  placeholder="Mi Empresa C.A."
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rif">RIF *</Label>
                <Input
                  id="rif"
                  placeholder="J-12345678-9"
                  value={formData.rif}
                  onChange={(e) => updateFormData('rif', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalName">Razon Social</Label>
                <Input
                  id="legalName"
                  placeholder="Nombre legal completo"
                  value={formData.legalName}
                  onChange={(e) => updateFormData('legalName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyType">Tipo de Entidad</Label>
                <Select
                  value={formData.companyType}
                  onValueChange={(value) => updateFormData('companyType', value as CompanyType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK">Banco</SelectItem>
                    <SelectItem value="PRIVATE_FUND">Fondo Privado</SelectItem>
                    <SelectItem value="COOPERATIVE">Cooperativa</SelectItem>
                    <SelectItem value="INVESTOR">Inversionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corporatePhone">Teléfono Corporativo</Label>
                <Input
                  id="corporatePhone"
                  placeholder="+58 212 1234567"
                  value={formData.corporatePhone}
                  onChange={(e) => updateFormData('corporatePhone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://miempresa.com"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalAddress">Dirección Fiscal</Label>
              <Textarea
                id="fiscalAddress"
                placeholder="Dirección completa de la sede"
                value={formData.fiscalAddress}
                onChange={(e) => updateFormData('fiscalAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripcion de la Empresa</Label>
              <Textarea
                id="description"
                placeholder="Breve descripcion de la empresa y sus servicios"
                rows={3}
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responseTime">Tiempo de Respuesta</Label>
              <Input
                id="responseTime"
                placeholder="Ej: 3 a 5 dias habiles"
                value={formData.responseTime}
                onChange={(e) => updateFormData('responseTime', e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-6 mt-4 pb-6">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando solicitud...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Enviar Solicitud de Registro
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Al registrarse, acepta nuestros términos de servicio y política de privacidad
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
