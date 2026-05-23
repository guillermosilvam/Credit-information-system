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
import { Skeleton } from '@/components/ui/skeleton';
import type { LandTenure, RoadCondition } from '@/lib/types';
import { accountService } from '@/services/accountService';
import { authService } from '@/services/authService';

export default function PerfilProductorPage() {
  const { user, updateProducerProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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
    let cancelled = false;
    const load = async () => {
      try {
        const res = await authService.getMe();
        if (cancelled) return;
        if (res.success && res.data) {
          const u = res.data;
          const p = u.is_producer && u.profile ? u.profile : null;
          setFormData({
            username: user?.username || u.username || '',
            farmName: p?.farm_name || '',
            address: p?.address || '',
            rif: p?.rif || '',
            nationalId: p?.national_id || '',
            phoneNumber: p?.phone_number || '',
            totalArea: p?.total_area ? String(p.total_area) : '',
            cultivatedArea: p?.cultivated_area ? String(p.cultivated_area) : '',
            landTenure: p?.land_tenure || '',
            machineryInventory: p?.machinery_inventory || '',
            roadCondition: p?.road_condition || '',
            mainActivity: p?.main_activity || '',
          });
        }
      } catch (e) {
        console.error('Error al cargar perfil productor', e);
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) {
      toast.error('Por favor corrija el nombre de usuario');
      return;
    }
    setIsSaving(true);
    try {
      const currentUsername = user?.username || '';
      if (formData.username && formData.username !== currentUsername) {
        await accountService.updateUserMe({ username: formData.username });
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
    } catch (e: any) {
      toast.error(e.response?.data?.detail || e.message || 'Error al actualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-40" /><Skeleton className="h-4 w-72 mt-2" /></div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">Administre su información personal y de su unidad de producción</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="cuenta" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cuenta" className="gap-2">
              <User className="w-4 h-4" /><span className="hidden sm:inline">Cuenta</span>
            </TabsTrigger>
            <TabsTrigger value="ubicacion" className="gap-2">
              <MapPin className="w-4 h-4" /><span className="hidden sm:inline">Ubicación</span>
            </TabsTrigger>
            <TabsTrigger value="produccion" className="gap-2">
              <Tractor className="w-4 h-4" /><span className="hidden sm:inline">Producción</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cuenta">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
                <CardDescription>Datos básicos de su cuenta de usuario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nombre de Usuario</Label>
                    <Input id="username" maxLength={30} value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      onBlur={async () => {
                        const current = user?.username || '';
                        if (formData.username && formData.username !== current) {
                          try {
                            const res = await accountService.checkUsernameAvailability(formData.username);
                            if (!res.available) setUsernameError('Nombre de usuario no disponible');
                            else setUsernameError(null);
                          } catch (e) { /* ignore */ }
                        } else { setUsernameError(null); }
                      }}
                      className={usernameError ? 'border border-destructive' : ''}
                    />
                    {usernameError && <p className="text-xs text-destructive mt-1">{usernameError}</p>}
                    <p className="text-xs text-muted-foreground">El nombre de usuario no puede ser modificado</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled className="bg-muted" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">Cédula de Identidad</Label>
                    <Input id="nationalId" inputMode="numeric" pattern="\d*" maxLength={8}
                      value={formData.nationalId}
                      onChange={(e) => handleChange('nationalId', e.target.value)}
                      placeholder="12345678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Teléfono</Label>
                    <Input id="phoneNumber" inputMode="tel" maxLength={12}
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder="412-1234567" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ubicacion">
            <Card>
              <CardHeader>
                <CardTitle>Ubicacion y Finca</CardTitle>
                <CardDescription>Información de su unidad de producción agrícola</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Nombre de la Finca</Label>
                    <Input id="farmName" maxLength={80} value={formData.farmName}
                      onChange={(e) => handleChange('farmName', e.target.value)}
                      placeholder="Hacienda Los Álamos" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rif">RIF</Label>
                    <Input id="rif" maxLength={12} value={formData.rif}
                      onChange={(e) => handleChange('rif', e.target.value)}
                      placeholder="V-12345678-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea id="address" maxLength={200} value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Sector, Municipio, Estado" rows={3} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Área Total (ha)</Label>
                    <Input id="totalArea" type="number" value={formData.totalArea}
                      onChange={(e) => handleChange('totalArea', e.target.value)}
                      placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cultivatedArea">Área Cultivada (ha)</Label>
                    <Input id="cultivatedArea" type="number" value={formData.cultivatedArea}
                      onChange={(e) => handleChange('cultivatedArea', e.target.value)}
                      placeholder="80" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landTenure">Tenencia</Label>
                    <Select value={formData.landTenure}
                      onValueChange={(value) => handleChange('landTenure', value)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
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

          <TabsContent value="produccion">
            <Card>
              <CardHeader>
                <CardTitle>Datos Productivos</CardTitle>
                <CardDescription>Información sobre su actividad agrícola</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mainActivity">Actividad Principal</Label>
                    <Input id="mainActivity" maxLength={100} value={formData.mainActivity}
                      onChange={(e) => handleChange('mainActivity', e.target.value)}
                      placeholder="Cultivo de Maiz, Ganaderia, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roadCondition">Condicion de Vias</Label>
                    <Select value={formData.roadCondition}
                      onValueChange={(value) => handleChange('roadCondition', value)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
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
                  <Textarea id="machineryInventory" maxLength={255} value={formData.machineryInventory}
                    onChange={(e) => handleChange('machineryInventory', e.target.value)}
                    placeholder="Describa los equipos y maquinarias disponibles en su finca" rows={4} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6 gap-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>)
              : (<><Save className="w-4 h-4 mr-2" />Guardar Cambios</>)}
          </Button>
        </div>
      </form>
    </div>
  );
}
