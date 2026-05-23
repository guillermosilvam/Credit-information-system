'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { ProducerRegisterForm, LandTenure, RoadCondition } from '@/lib/types';
import { authService } from '@/services/authService';

const steps = [
  { id: 1, title: 'Cuenta', description: 'Datos de acceso' },
  { id: 2, title: 'Ubicación', description: 'Datos de la finca' },
  { id: 3, title: 'Producción', description: 'Actividad agrícola' }
];

export default function RegistroProductorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProducerRegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    address: '',
    rif: '',
    nationalId: '',
    phoneNumber: '',
    totalArea: undefined,
    cultivatedArea: undefined,
    landTenure: undefined,
    machineryInventory: '',
    roadCondition: undefined,
    mainActivity: ''
  });

  const updateFormData = (field: keyof ProducerRegisterForm, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          toast.error('Complete todos los campos obligatorios');
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
        return true;
      case 2:
        if (!formData.farmName || !formData.address) {
          toast.error('Ingrese el nombre y dirección de la finca');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    
    const response = await authService.registerProducer({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      farm_name: formData.farmName,
      address: formData.address,
      rif: formData.rif || undefined,
      national_id: formData.nationalId || undefined,
      phone_number: formData.phoneNumber || undefined,
      total_area: formData.totalArea,
      cultivated_area: formData.cultivatedArea,
      land_tenure: formData.landTenure,
      machinery_inventory: formData.machineryInventory || undefined,
      road_condition: formData.roadCondition,
      main_activity: formData.mainActivity || undefined
    });
    
    setIsLoading(false);
    
    if (response.success) {
      toast.success('Cuenta creada exitosamente');
      router.push('/login');
    } else {
      toast.error(response.error || 'Error al crear cuenta');
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
        <CardTitle className="text-2xl font-bold">Registro de Productor</CardTitle>
        <CardDescription>
          Complete el formulario para crear su cuenta
        </CardDescription>
      </CardHeader>

      {/* Stepper */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <CardContent className="space-y-4">
        {/* Paso 1: Datos de la Cuenta */}
        {currentStep === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario *</Label>
              <Input
                id="username"
                placeholder="usuario123"
                maxLength={16}
                value={formData.username}
                onChange={(e) => updateFormData('username', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                maxLength={80}
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
              />
            </div>
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
                  className="absolute right-0 top-0 h-full px-3 z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita la contraseña"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Paso 2: Ubicacion y Finca */}
        {currentStep === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="farmName">Nombre de la Finca *</Label>
              <Input
                id="farmName"
                placeholder="Hacienda Los Alamos"
                maxLength={40}
                value={formData.farmName}
                onChange={(e) => updateFormData('farmName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Textarea
                id="address"
                placeholder="Sector, Municipio, Estado"
                maxLength={200}
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rif">RIF (Opcional)</Label>
                <Input
                  id="rif"
                  placeholder="V-12345678-9"
                  maxLength={12}
                  value={formData.rif}
                  onChange={(e) => updateFormData('rif', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">Cédula</Label>
                <Input
                  id="nationalId"
                  placeholder="12345678"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={8}
                  value={formData.nationalId}
                  onChange={(e) => updateFormData('nationalId', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Input
                id="phoneNumber"
                placeholder="412-1234567"
                inputMode="tel"
                maxLength={12}
                value={formData.phoneNumber}
                onChange={(e) => updateFormData('phoneNumber', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalArea">Área Total (ha)</Label>
                <Input
                  id="totalArea"
                  type="number"
                  placeholder="100"
                  value={formData.totalArea || ''}
                  onChange={(e) => updateFormData('totalArea', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cultivatedArea">Área Cultivada (ha)</Label>
                <Input
                  id="cultivatedArea"
                  type="number"
                  placeholder="80"
                  value={formData.cultivatedArea || ''}
                  onChange={(e) => updateFormData('cultivatedArea', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="landTenure">Tenencia de la Tierra</Label>
              <Select
                value={formData.landTenure}
                onValueChange={(value) => updateFormData('landTenure', value as LandTenure)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNED">Propia</SelectItem>
                  <SelectItem value="RENTED">Alquilada</SelectItem>
                  <SelectItem value="AWARDED">Adjudicada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Paso 3: Datos Productivos */}
        {currentStep === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="mainActivity">Actividad Principal</Label>
              <Input
                id="mainActivity"
                placeholder="Ej: Cultivo de Maiz, Ganaderia"
                value={formData.mainActivity}
                onChange={(e) => updateFormData('mainActivity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machineryInventory">Inventario de Maquinaria</Label>
              <Textarea
                id="machineryInventory"
                placeholder="Describa los equipos y maquinarias disponibles"
                value={formData.machineryInventory}
                onChange={(e) => updateFormData('machineryInventory', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roadCondition">Condicion de Vias de Acceso</Label>
              <Select
                value={formData.roadCondition}
                onValueChange={(value) => updateFormData('roadCondition', value as RoadCondition)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPTIMAL">Optimo</SelectItem>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="DIFFICULT">Dificil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2">Resumen del Registro</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium">Usuario:</span> {formData.username}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Finca:</span> {formData.farmName}</p>
                <p><span className="font-medium">Ubicacion:</span> {formData.address}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-6 mt-4">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        ) : (
          <div />
        )}
        
        {currentStep < 3 ? (
          <Button onClick={nextStep}>
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Crear Cuenta
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
