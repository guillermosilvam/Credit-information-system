'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { creditService } from '@/services/creditService';

const sectors = [
  'General',
  'Cerealero',
  'Avicola',
  'Horticola',
  'Ganadero',
  'Fruticultura',
  'Cafetalero',
  'Cacaotero'
];

export default function NuevoPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agriculturalSector: '',
    minAmount: '',
    maxAmount: '',
    interestRate: '',
    termMonths: '',
    isActive: true
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const editId = searchParams?.get('edit');
    if (editId) {
      const idNum = Number(editId);
      if (!Number.isNaN(idNum)) {
        (async () => {
          try {
            setIsLoading(true);
            const plan = await creditService.getPlan(idNum);
            setFormData({
              title: plan.title,
              description: plan.description,
              agriculturalSector: plan.agricultural_sector,
              minAmount: String(plan.min_amount),
              maxAmount: String(plan.max_amount),
              interestRate: String(plan.interest_rate),
              termMonths: String(plan.term_months),
              isActive: plan.is_active
            });
            setIsEditing(true);
            setEditingPlanId(idNum);
          } catch (e:any) {
            toast.error('No se pudo cargar el plan para editar');
          } finally {
            setIsLoading(false);
          }
        })();
      }
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    if (!formData.title || !formData.description || !formData.agriculturalSector) {
      toast.error('Complete todos los campos obligatorios');
      return false;
    }
    if (!formData.minAmount || !formData.maxAmount || !formData.interestRate || !formData.termMonths) {
      toast.error('Complete todos los campos numericos');
      return false;
    }
    if (Number(formData.minAmount) >= Number(formData.maxAmount)) {
      toast.error('El monto minimo debe ser menor al monto maximo');
      return false;
    }
    if (Number(formData.minAmount) <= 0) {
      toast.error('El monto minimo debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        agricultural_sector: formData.agriculturalSector,
        min_amount: Number(formData.minAmount),
        max_amount: Number(formData.maxAmount),
        interest_rate: Number(formData.interestRate),
        term_months: Number(formData.termMonths),
        is_active: formData.isActive
      };

      if (isEditing && editingPlanId) {
        await creditService.updatePlan(editingPlanId, payload);
        toast.success('Plan de credito actualizado');
      } else {
        await creditService.createPlan(payload);
        toast.success('Plan de credito creado exitosamente');
      }

      router.push('/empresa/planes');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al guardar el plan de credito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/empresa/planes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Crear Plan de Credito</h1>
          <p className="text-muted-foreground">
            Defina los términos y condiciones de su nuevo plan de financiamiento
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>
                  Datos básicos del plan de crédito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titulo del Plan *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Microcredito Semillas Maiz 2026"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripcion *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describa las condiciones, beneficios y requisitos del plan"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector Agricola *</Label>
                  <Select
                    value={formData.agriculturalSector}
                    onValueChange={(value) => handleChange('agriculturalSector', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Condiciones Financieras</CardTitle>
                <CardDescription>
                  Montos, tasas y plazos del credito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Monto Minimo (USD) *</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      placeholder="500"
                      min="0"
                      value={formData.minAmount}
                      onChange={(e) => handleChange('minAmount', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Monto Maximo (USD) *</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      placeholder="10000"
                      min="0"
                      value={formData.maxAmount}
                      onChange={(e) => handleChange('maxAmount', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Tasa de Interes Anual (%) *</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      placeholder="12.5"
                      min="0"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => handleChange('interestRate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termMonths">Plazo (Meses) *</Label>
                    <Input
                      id="termMonths"
                      type="number"
                      placeholder="12"
                      min="1"
                      value={formData.termMonths}
                      onChange={(e) => handleChange('termMonths', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publicacion</CardTitle>
                <CardDescription>
                  Controle la visibilidad del plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Plan Activo</Label>
                    <p className="text-sm text-muted-foreground">
                      Los productores podran aplicar
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange('isActive', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.title ? (
                  <>
                    <h4 className="font-semibold">{formData.title}</h4>
                    {formData.agriculturalSector && (
                      <p className="text-xs text-muted-foreground">
                        Sector: {formData.agriculturalSector}
                      </p>
                    )}
                    {formData.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.description}
                      </p>
                    )}
                    <div className="pt-2 space-y-1 text-sm">
                      {formData.minAmount && formData.maxAmount && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monto:</span>
                          <span>${formData.minAmount} - ${formData.maxAmount}</span>
                        </div>
                      )}
                      {formData.interestRate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tasa:</span>
                          <span>{formData.interestRate}% anual</span>
                        </div>
                      )}
                      {formData.termMonths && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plazo:</span>
                          <span>{formData.termMonths} meses</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Complete el formulario para ver la vista previa
                  </p>
                )}
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
                  Publicar Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
