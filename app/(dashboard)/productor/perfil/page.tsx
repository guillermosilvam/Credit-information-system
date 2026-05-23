'use client';

import { useState, useEffect } from 'react';
import { Save, User, MapPin, Tractor, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { landTenureLabels, roadConditionLabels } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { LandTenure, RoadCondition } from '@/lib/types';
import { accountService } from '@/services/accountService';

export default function PerfilProductorPage() {
  const { user, producerProfile, updateProducerProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    farmName: '',
    address: '',
    rif: '',
    nationalId: '',
    phoneNumber: '',
    totalArea: '',
    cultivatedArea: '',
    landTenure: '',
    machineryInventory: '',
    roadCondition: '',
    mainActivity: '',
  });
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    if (producerProfile) {
      setFormData({
        username: user?.username || '',
        farmName: producerProfile.farmName || '',
        address: producerProfile.address || '',
        rif: producerProfile.rif || '',
        nationalId: producerProfile.nationalId || '',
        phoneNumber: producerProfile.phoneNumber || '',
        totalArea: producerProfile.totalArea?.toString() || '',
        cultivatedArea: producerProfile.cultivatedArea?.toString() || '',
        landTenure: producerProfile.landTenure || '',
        machineryInventory: producerProfile.machineryInventory || '',
        roadCondition: producerProfile.roadCondition || '',
        mainActivity: producerProfile.mainActivity || '',
      });
    } else if (user) {
      setFormData(prev => ({ ...prev, username: user.username }));
    }
  }, [producerProfile, user]);

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
      // Primero actualizar username/email si cambió
      const currentUsername = user?.username || '';
      if (formData.username && formData.username !== currentUsername) {
        await accountService.updateUserMe({ username: formData.username });
        // actualizar local user
        const updatedUser = { ...user, username: formData.username };
        localStorage.setItem('agrifinance_user', JSON.stringify(updatedUser));
      }

      const res = await updateProducerProfile({
        farmName: formData.farmName,
        address: formData.address,
        rif: formData.rif,
        nationalId: formData.nationalId,
        phoneNumber: formData.phoneNumber,
        totalArea: formData.totalArea ? Number(formData.totalArea) : undefined,
        cultivatedArea: formData.cultivatedArea ? Number(formData.cultivatedArea) : undefined,
        landTenure: formData.landTenure as LandTenure,
        machineryInventory: formData.machineryInventory,
        roadCondition: formData.roadCondition as RoadCondition,
        mainActivity: formData.mainActivity,
      });

      if (!res || (res as any).success === false) throw new Error('Error saving');
      toast.success('Perfil actualizado correctamente');
    } catch (e:any) {
      toast.error(e.response?.data?.detail || e.message || 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Administre su información personal y de su unidad de producción
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="cuenta" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cuenta" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Cuenta</span>
            </TabsTrigger>
            <TabsTrigger value="ubicacion" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Ubicación</span>
            </TabsTrigger>
            <TabsTrigger value="produccion" className="gap-2">
              <Tractor className="w-4 h-4" />
              <span className="hidden sm:inline">Producción</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Cuenta */}
          <TabsContent value="cuenta">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
                <CardDescription>
                  Datos básicos de su cuenta de usuario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nombre de Usuario</Label>
                    <Input
                      id="username"
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
                    <p className="text-xs text-muted-foreground">
                      El nombre de usuario no puede ser modificado
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">Cédula de Identidad</Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => handleChange('nationalId', e.target.value)}
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Teléfono</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="+58 412 1234567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Ubicacion */}
          <TabsContent value="ubicacion">
            <Card>
              <CardHeader>
                <CardTitle>Ubicacion y Finca</CardTitle>
                <CardDescription>
                  Información de su unidad de producción agrícola
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Nombre de la Finca</Label>
                    <Input
                      id="farmName"
                      value={formData.farmName}
                      onChange={(e) => handleChange('farmName', e.target.value)}
                      placeholder="Hacienda Los Álamos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rif">RIF</Label>
                    <Input
                      id="rif"
                      value={formData.rif}
                      onChange={(e) => handleChange('rif', e.target.value)}
                      placeholder="V-12345678-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Sector, Municipio, Estado"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Área Total (ha)</Label>
                    <Input
                      id="totalArea"
                      type="number"
                      value={formData.totalArea}
                      onChange={(e) => handleChange('totalArea', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cultivatedArea">Área Cultivada (ha)</Label>
                    <Input
                      id="cultivatedArea"
                      type="number"
                      value={formData.cultivatedArea}
                      onChange={(e) => handleChange('cultivatedArea', e.target.value)}
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landTenure">Tenencia</Label>
                    <Select
                      value={formData.landTenure}
                      onValueChange={(value) => handleChange('landTenure', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(landTenureLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Produccion */}
          <TabsContent value="produccion">
            <Card>
              <CardHeader>
                <CardTitle>Datos Productivos</CardTitle>
                <CardDescription>
                  Información sobre su actividad agrícola
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mainActivity">Actividad Principal</Label>
                    <Input
                      id="mainActivity"
                      value={formData.mainActivity}
                      onChange={(e) => handleChange('mainActivity', e.target.value)}
                      placeholder="Cultivo de Maiz, Ganaderia, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roadCondition">Condicion de Vias</Label>
                    <Select
                      value={formData.roadCondition}
                      onValueChange={(value) => handleChange('roadCondition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roadConditionLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineryInventory">Inventario de Maquinaria</Label>
                  <Textarea
                    id="machineryInventory"
                    value={formData.machineryInventory}
                    onChange={(e) => handleChange('machineryInventory', e.target.value)}
                    placeholder="Describa los equipos y maquinarias disponibles en su finca"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6 gap-4">
          <Button type="submit" disabled={isLoading}>
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
      </form>
    </div>
  );
}
