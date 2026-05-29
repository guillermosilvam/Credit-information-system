'use client';

import { useState } from 'react';
import { Search, Eye, Tractor, MapPin, Loader2, Trash2 } from 'lucide-react';
import { landTenureLabels, roadConditionLabels } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { accountService, type ProducerProfileResponse } from '@/services/accountService';
import type { CreditApplicationResponse } from '@/services/creditService';
import { toast } from 'sonner';

const toNumber = (value: number | string | null | undefined) => Number(value || 0);
const formatHectares = (value: number) => value.toLocaleString('es-VE', {
  maximumFractionDigits: 2,
});

export default function AdminProductoresPage() {
  const { data: producers = [], isLoading } = useSWR<ProducerProfileResponse[]>('/accounts/producer/', fetcher);
  const { data: applications = [], isLoading: isLoadingApplications } = useSWR<CreditApplicationResponse[]>('/credits/applications/', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducer, setSelectedProducer] = useState<ProducerProfileResponse | null>(null);
  const [producerToDelete, setProducerToDelete] = useState<ProducerProfileResponse | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducers = producers.filter(producer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (producer.farm_name && producer.farm_name.toLowerCase().includes(searchLower)) ||
      (producer.address && producer.address.toLowerCase().includes(searchLower)) ||
      (producer.user?.username && producer.user.username.toLowerCase().includes(searchLower)) ||
      (producer.user?.email && producer.user.email.toLowerCase().includes(searchLower))
    );
  });

  const approvedProducerIds = new Set(
    applications
      .filter(application => application.status === 'approved')
      .map(application => application.producer)
  );
  const totalArea = producers.reduce((acc, p) => acc + toNumber(p.total_area), 0);
  const approvedCultivatedArea = producers
    .filter(producer => approvedProducerIds.has(producer.id))
    .reduce((acc, p) => acc + toNumber(p.cultivated_area), 0);

  const viewDetails = (producer: ProducerProfileResponse) => {
    setSelectedProducer(producer);
    setShowDetailDialog(true);
  };

  const handleDelete = async () => {
    if (!producerToDelete) return;
    setIsDeleting(true);
    try {
      await accountService.deleteProducer(producerToDelete.id);
      toast.success('Productor eliminado exitosamente');
      mutate('/accounts/producer/');
      if (selectedProducer?.id === producerToDelete.id) {
        setShowDetailDialog(false);
        setSelectedProducer(null);
      }
      setProducerToDelete(null);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Error al eliminar el productor');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Productores Registrados</h1>
        <p className="text-muted-foreground">
          Listado de todos los productores agrícolas en la plataforma
        </p>
      </div>

      {isLoading || isLoadingApplications ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Productores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{producers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Área Total Registrada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatHectares(totalArea)} ha
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Área Cultivada Aprobada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatHectares(approvedCultivatedArea)} ha
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, finca o ubicacion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Producers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Productores</CardTitle>
          <CardDescription>
            {filteredProducers.length} productores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducers.length === 0 ? (
            <div className="text-center py-12">
              <Tractor className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No se encontraron productores</h3>
              <p className="text-muted-foreground">
                Intente ajustar el término de búsqueda
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Productor</TableHead>
                    <TableHead>Finca</TableHead>
                    <TableHead>Ubicacion</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducers.map((producer) => {
                    return (
                      <TableRow key={producer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{producer.user?.username || 'Usuario'}</p>
                            <p className="text-sm text-muted-foreground">{producer.user?.email || 'Sin email'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{producer.farm_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-40">{producer.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">{producer.cultivated_area || 0}</span>
                            <span className="text-muted-foreground"> / {producer.total_area || 0} ha</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {producer.main_activity ? (
                            <Badge variant="outline">{producer.main_activity}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewDetails(producer)}
                              aria-label="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setProducerToDelete(producer)}
                              aria-label="Eliminar productor"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="w-full max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Productor</DialogTitle>
            <DialogDescription>
              Información completa del productor y su finca
            </DialogDescription>
          </DialogHeader>
          
          {selectedProducer && (
            <div className="space-y-6 py-4">
              {(() => {
                return (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-3">Datos del Usuario</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Usuario:</span>
                            <span>{selectedProducer.user?.username}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground whitespace-nowrap">Email:</span>
                            <span className="break-all text-right">{selectedProducer.user?.email}</span>
                          </div>
                          {selectedProducer.national_id && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cédula:</span>
                              <span>{selectedProducer.national_id}</span>
                            </div>
                          )}
                          {selectedProducer.phone_number && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Teléfono:</span>
                              <span className="break-all text-right">{selectedProducer.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-3">Información de Finca</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nombre:</span>
                            <span>{selectedProducer.farm_name}</span>
                          </div>
                          {selectedProducer.rif && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">RIF:</span>
                              <span>{selectedProducer.rif}</span>
                            </div>
                          )}
                          {selectedProducer.land_tenure && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tenencia:</span>
                              <span>{landTenureLabels[selectedProducer.land_tenure] || selectedProducer.land_tenure}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">Ubicacion</h4>
                      <p className="text-sm">{selectedProducer.address}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 rounded-lg bg-primary/5 text-center">
                        <p className="text-2xl font-bold text-primary">{selectedProducer.total_area || 0}</p>
                        <p className="text-sm text-muted-foreground">Hectareas Totales</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 text-center">
                        <p className="text-2xl font-bold text-primary">{selectedProducer.cultivated_area || 0}</p>
                        <p className="text-sm text-muted-foreground">Hectareas Cultivadas</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-lg font-medium">
                          {selectedProducer.road_condition 
                            ? (roadConditionLabels[selectedProducer.road_condition] || selectedProducer.road_condition)
                            : 'No especificado'}
                        </p>
                        <p className="text-sm text-muted-foreground">Condición de Vías</p>
                      </div>
                    </div>

                    {selectedProducer.main_activity && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Actividad Principal</h4>
                        <Badge variant="outline">{selectedProducer.main_activity}</Badge>
                      </div>
                    )}

                    {selectedProducer.machinery_inventory && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Inventario de Maquinaria</h4>
                        <p className="text-sm">{selectedProducer.machinery_inventory}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!producerToDelete} onOpenChange={(open) => !open && setProducerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar productor</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara la cuenta de {producerToDelete?.user?.username || producerToDelete?.farm_name} y sus datos asociados. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
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
