'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, CreditCard, Building2, Clock, Percent, Check, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { creditService, CreditPlanResponse } from '@/services/creditService';
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
  const { data: plans = [], isLoading } = useSWR<CreditPlanResponse[]>('/credits/plans/', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos');
  const [selectedPlan, setSelectedPlan] = useState<CreditPlanResponse | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const filteredPlans = plans.filter(plan => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (plan.title && plan.title.toLowerCase().includes(searchLower)) ||
      (plan.description && plan.description.toLowerCase().includes(searchLower));
    const matchesSector = selectedSector === 'Todos' || plan.agricultural_sector === selectedSector;
    return matchesSearch && matchesSector && plan.is_active;
  });

  const handleApply = (plan: CreditPlanResponse) => {
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const confirmApplication = async () => {
    if (!selectedPlan) return;
    setIsApplying(true);
    try {
      await creditService.applyForCredit(selectedPlan.id);
      toast.success('Solicitud enviada exitosamente', {
        description: 'Recibirá una notificación cuando la entidad revise su solicitud.'
      });
      setShowConfirmDialog(false);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Error al enviar la solicitud');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explorar Créditos</h1>
        <p className="text-muted-foreground">
          Encuentre el plan de financiamiento ideal para su actividad agrícola
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o descripción..."
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
              Intente ajustar los filtros de búsqueda
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
                    {plan.agricultural_sector}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    {plan.company_name || 'Empresa'}
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
                      {formatCurrency(plan.min_amount)} - {formatCurrency(plan.max_amount)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <Percent className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tasa</p>
                        <p className="font-medium text-sm">{plan.interest_rate}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <Clock className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Plazo</p>
                        <p className="font-medium text-sm">{plan.term_months} meses</p>
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
            <DialogTitle>Confirmar Solicitud de Crédito</DialogTitle>
            <DialogDescription>
              Está a punto de aplicar al siguiente plan de crédito
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <h4 className="font-semibold">{selectedPlan.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedPlan.company_name || 'Empresa'}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="font-medium">
                      {formatCurrency(selectedPlan.min_amount)} - {formatCurrency(selectedPlan.max_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tasa de Interés</p>
                    <p className="font-medium">{selectedPlan.interest_rate}% anual</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plazo</p>
                    <p className="font-medium">{selectedPlan.term_months} meses</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sector</p>
                    <p className="font-medium">{selectedPlan.agricultural_sector}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Al confirmar, su solicitud será enviada a {selectedPlan.company_name || 'la empresa'} para revisión. 
                Recibirá una notificación cuando su solicitud sea procesada.
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
