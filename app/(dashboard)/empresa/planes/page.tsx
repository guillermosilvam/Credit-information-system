'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { creditService, CreditPlanResponse } from '@/services/creditService';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function MisPlanesPage() {
  const { companyProfile } = useAuth();
  const router = useRouter();
  const { data: allPlans = [], isLoading } = useSWR<CreditPlanResponse[]>('/credits/plans/', fetcher);
  
  // Filtrar solo los planes de esta empresa
  const plans = allPlans.filter(p => p.company === companyProfile?.id);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleActive = async (plan: CreditPlanResponse) => {
    setIsUpdating(true);
    try {
      await creditService.updatePlan(plan.id, { is_active: !plan.is_active });
      mutate('/credits/plans/');
      toast.success(plan.is_active ? 'Plan pausado' : 'Plan activado');
    } catch (e: any) {
      toast.error('Error al actualizar el estado del plan');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (selectedPlanId) {
      setIsUpdating(true);
      try {
        await creditService.deletePlan(selectedPlanId);
        mutate('/credits/plans/');
        toast.success('Plan eliminado correctamente');
      } catch (e: any) {
        toast.error('Error al eliminar el plan');
      } finally {
        setIsUpdating(false);
        setDeleteDialogOpen(false);
        setSelectedPlanId(null);
      }
    }
  };

  const confirmDelete = (planId: number) => {
    setSelectedPlanId(planId);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Planes de Crédito</h1>
          <p className="text-muted-foreground">
            Gestione los planes de credito que ofrece a los productores
          </p>
        </div>
        <Link href="/empresa/planes/nuevo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Plan
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Planes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {plans.filter(p => p.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Planes Pausados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {plans.filter(p => !p.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Planes</CardTitle>
          <CardDescription>
            Todos los planes de credito creados por su empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No tiene planes de credito</h3>
              <p className="text-muted-foreground mb-4">
                Cree su primer plan de credito para que los productores puedan aplicar
              </p>
              <Link href="/empresa/planes/nuevo">
                <Button>Crear Primer Plan</Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titulo</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Tasa</TableHead>
                    <TableHead>Plazo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="font-medium">{plan.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.agricultural_sector}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatCurrency(plan.min_amount)} - {formatCurrency(plan.max_amount)}
                        </span>
                      </TableCell>
                      <TableCell>{plan.interest_rate}%</TableCell>
                      <TableCell>{plan.term_months} meses</TableCell>
                      <TableCell>
                        <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                          {plan.is_active ? 'Activo' : 'Pausado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(plan.created_at || (plan as any).createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/empresa/planes/nuevo?edit=${plan.id}`)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={isUpdating} onClick={() => handleToggleActive(plan)}>
                              {plan.is_active ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Pausar
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => confirmDelete(plan.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Plan de Credito</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El plan sera eliminado permanentemente
              y los productores no podran aplicar a el.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={isUpdating} onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
      )}
    </div>
  );
}
