'use client';

import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { formatCurrency, formatDate, statusLabels } from '@/lib/formatters';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { creditService } from '@/services/creditService';
import type { CreditApplicationResponse } from '@/services/creditService';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';


export default function SolicitudesEmpresaPage() {
  const { data: initialApplications = [], isLoading } = useSWR<CreditApplicationResponse[]>('/credits/applications/', fetcher);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<CreditApplicationResponse | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredApplications = initialApplications.filter(app => {
    const producerName = app.producer_profile?.user?.username || 'Productor';
    const farmName = app.producer_profile?.farm_name || 'Finca';
    const planTitle = app.credit_plan_title || `Plan #${app.credit_plan}`;

    const matchesSearch = 
      producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'under_review':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'under_review': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const updateStatus = async (appId: number, status: string) => {
    setIsUpdating(true);
    try {
      await creditService.updateApplicationStatus(appId, status);
      mutate('/credits/applications/');
      toast.success('Estado actualizado');
      setShowDetailDialog(false);
    } catch (e: any) {
      toast.error('Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApprove = (appId: number) => updateStatus(appId, 'approved');
  const handleReject = (appId: number) => updateStatus(appId, 'rejected');
  const handleMarkUnderReview = (appId: number) => updateStatus(appId, 'under_review');

  const viewDetails = (app: CreditApplicationResponse) => {
    setSelectedApplication(app);
    setShowDetailDialog(true);
  };

  // Stats
  const stats = {
    total: initialApplications.length,
    pending: initialApplications.filter(a => a.status === 'pending').length,
    underReview: initialApplications.filter(a => a.status === 'under_review').length,
    approved: initialApplications.filter(a => a.status === 'approved').length,
    rejected: initialApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Solicitudes Recibidas</h1>
        <p className="text-muted-foreground">
          Revise y gestione las solicitudes de credito de los productores
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              En Revision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.underReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Rechazados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por productor, finca o plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="under_review">En Revision</SelectItem>
                <SelectItem value="approved">Aprobados</SelectItem>
                <SelectItem value="rejected">Rechazados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Solicitudes</CardTitle>
          <CardDescription>
            {filteredApplications.length} solicitudes encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No se encontraron solicitudes</h3>
              <p className="text-muted-foreground">
                {initialApplications.length === 0 
                  ? 'Aun no ha recibido solicitudes de credito'
                  : 'Intente ajustar los filtros de busqueda'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Productor</TableHead>
                    <TableHead>Finca</TableHead>
                    <TableHead>Plan de Credito</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.producer_profile?.user?.username || 'Productor'}
                      </TableCell>
                      <TableCell>{application.producer_profile?.farm_name || 'Finca'}</TableCell>
                      <TableCell>
                        <span className="text-sm">{application.credit_plan_title || `Plan #${application.credit_plan}`}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(application.application_date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <Badge variant={getStatusVariant(application.status)}>
                            {statusLabels[application.status]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewDetails(application)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
            <DialogDescription>
              Revise la información del productor y tome una decisión
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6 py-4">
              {/* Producer Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Información del Productor</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span>{selectedApplication.producer_profile?.user?.username || 'Productor'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Finca:</span>
                      <span>{selectedApplication.producer_profile?.farm_name || 'Finca'}</span>
                    </div>
                    {selectedApplication.producer_profile && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Área Total:</span>
                          <span>{selectedApplication.producer_profile.total_area || 0} ha</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Área Cultivada:</span>
                          <span>{selectedApplication.producer_profile.cultivated_area || 0} ha</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Actividad:</span>
                          <span>{selectedApplication.producer_profile.main_activity || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Plan de Credito Solicitado</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span>{selectedApplication.credit_plan_title || `Plan #${selectedApplication.credit_plan}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha Solicitud:</span>
                      <span>{formatDate(selectedApplication.application_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado Actual:</span>
                      <Badge variant={getStatusVariant(selectedApplication.status)}>
                        {statusLabels[selectedApplication.status]}
                      </Badge>
                    </div>
                    {selectedApplication.updated_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha Revision:</span>
                        <span>{formatDate(selectedApplication.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedApplication && (selectedApplication.status === 'pending' || selectedApplication.status === 'under_review') && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => handleMarkUnderReview(selectedApplication.id)}
                  disabled={selectedApplication.status === 'under_review' || isUpdating}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Marcar en Revision
                </Button>
                <Button 
                  variant="destructive"
                  disabled={isUpdating}
                  onClick={() => handleReject(selectedApplication.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar
                </Button>
                <Button disabled={isUpdating} onClick={() => handleApprove(selectedApplication.id)}>
                  {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Aprobar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
}
