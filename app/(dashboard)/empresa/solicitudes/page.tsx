'use client';

import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { mockCreditApplications, mockCreditPlans, mockProducerProfiles, formatDate, statusLabels } from '@/lib/mock-data';
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
import type { CreditApplication } from '@/lib/types';

export default function SolicitudesEmpresaPage() {
  const companyPlans = mockCreditPlans.filter(p => p.companyId === 1);
  const initialApplications = mockCreditApplications.filter(app => 
    companyPlans.some(plan => plan.id === app.creditPlanId)
  );
  
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<CreditApplication | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.creditPlanTitle.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleApprove = (appId: number) => {
    setApplications(applications.map(app =>
      app.id === appId ? { ...app, status: 'approved' as const, reviewedAt: new Date().toISOString() } : app
    ));
    toast.success('Solicitud aprobada');
    setShowDetailDialog(false);
  };

  const handleReject = (appId: number) => {
    setApplications(applications.map(app =>
      app.id === appId ? { ...app, status: 'rejected' as const, reviewedAt: new Date().toISOString() } : app
    ));
    toast.success('Solicitud rechazada');
    setShowDetailDialog(false);
  };

  const handleMarkUnderReview = (appId: number) => {
    setApplications(applications.map(app =>
      app.id === appId ? { ...app, status: 'under_review' as const } : app
    ));
    toast.success('Solicitud marcada en revision');
    setShowDetailDialog(false);
  };

  const viewDetails = (app: CreditApplication) => {
    setSelectedApplication(app);
    setShowDetailDialog(true);
  };

  const getProducerProfile = (producerId: number) => {
    return mockProducerProfiles.find(p => p.userId === producerId);
  };

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
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
                {applications.length === 0 
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
                        {application.producerName}
                      </TableCell>
                      <TableCell>{application.farmName}</TableCell>
                      <TableCell>
                        <span className="text-sm">{application.creditPlanTitle}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(application.appliedAt)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
            <DialogDescription>
              Revise la informacion del productor y tome una decision
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6 py-4">
              {/* Producer Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Informacion del Productor</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span>{selectedApplication.producerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Finca:</span>
                      <span>{selectedApplication.farmName}</span>
                    </div>
                    {(() => {
                      const profile = getProducerProfile(selectedApplication.producerId);
                      return profile ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Area Total:</span>
                            <span>{profile.totalArea} ha</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Area Cultivada:</span>
                            <span>{profile.cultivatedArea} ha</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Actividad:</span>
                            <span>{profile.mainActivity}</span>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Plan de Credito Solicitado</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span>{selectedApplication.creditPlanTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha Solicitud:</span>
                      <span>{formatDate(selectedApplication.appliedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado Actual:</span>
                      <Badge variant={getStatusVariant(selectedApplication.status)}>
                        {statusLabels[selectedApplication.status]}
                      </Badge>
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha Revision:</span>
                        <span>{formatDate(selectedApplication.reviewedAt)}</span>
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
                  disabled={selectedApplication.status === 'under_review'}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Marcar en Revision
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleReject(selectedApplication.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar
                </Button>
                <Button onClick={() => handleApprove(selectedApplication.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
