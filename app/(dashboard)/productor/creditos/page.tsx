'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, CreditCard, Building2, Clock, Percent, Check, Eye } from 'lucide-react';
import { mockCreditPlans, formatCurrency } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const sectors = ['Todos', 'General', 'Cerealero', 'Avicola', 'Horticola'];

export default function ExplorarCreditosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [selectedPlan, setSelectedPlan] = useState<typeof mockCreditPlans[0] | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const filteredPlans = mockCreditPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'Todos' || plan.agriculturalSector === selectedSector;
    return matchesSearch && matchesSector && plan.isActive;
  });

  const handleApply = (plan: typeof mockCreditPlans[0]) => {
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const confirmApplication = async () => {
    setIsApplying(true);
    // Simular envio de solicitud
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsApplying(false);
    setShowConfirmDialog(false);
    toast.success('Solicitud enviada exitosamente', {
      description: 'Recibira una notificacion cuando la entidad revise su solicitud.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explorar Creditos</h1>
        <p className="text-muted-foreground">
          Encuentre el plan de financiamiento ideal para su actividad agricola
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o descripcion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sector" />
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

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredPlans.length} {filteredPlans.length === 1 ? 'plan encontrado' : 'planes encontrados'}
        </p>
      </div>

      {/* Credit Plans Grid */}
      {filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No se encontraron planes</h3>
            <p className="text-muted-foreground">
              Intente ajustar los filtros de busqueda
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-primary/5">
                    {plan.agriculturalSector}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    {plan.companyName}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{plan.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Monto</span>
                    </div>
                    <span className="font-semibold text-sm">
                      {formatCurrency(plan.minAmount)} - {formatCurrency(plan.maxAmount)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <Percent className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tasa</p>
                        <p className="font-medium text-sm">{plan.interestRate}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <Clock className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Plazo</p>
                        <p className="font-medium text-sm">{plan.termMonths} meses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 gap-2">
                <Link href={`/productor/creditos/${plan.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                </Link>
                <Button 
                  className="flex-1" 
                  onClick={() => handleApply(plan)}
                >
                  Aplicar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Solicitud de Credito</DialogTitle>
            <DialogDescription>
              Esta a punto de aplicar al siguiente plan de credito
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <h4 className="font-semibold">{selectedPlan.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedPlan.companyName}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="font-medium">
                      {formatCurrency(selectedPlan.minAmount)} - {formatCurrency(selectedPlan.maxAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tasa de Interes</p>
                    <p className="font-medium">{selectedPlan.interestRate}% anual</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plazo</p>
                    <p className="font-medium">{selectedPlan.termMonths} meses</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sector</p>
                    <p className="font-medium">{selectedPlan.agriculturalSector}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Al confirmar, su solicitud sera enviada a {selectedPlan.companyName} para revision. 
                Recibira una notificacion cuando su solicitud sea procesada.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isApplying}>
              Cancelar
            </Button>
            <Button onClick={confirmApplication} disabled={isApplying}>
              {isApplying ? (
                'Enviando...'
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Solicitud
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
