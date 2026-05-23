'use client';

import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, Building2, Loader2 } from 'lucide-react';
import { companyTypeLabels, statusLabels } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { accountService, CompanyProfileResponse } from '@/services/accountService';
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
import type { CompanyProfile } from '@/lib/types';

export default function AdminEmpresasPage() {
  const { data: companies = [], isLoading } = useSWR<CompanyProfileResponse[]>('/accounts/company/', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfileResponse | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredCompanies = companies.filter(company => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (company.company_name && company.company_name.toLowerCase().includes(searchLower)) ||
      (company.rif && company.rif.toLowerCase().includes(searchLower));
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'verified': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleApprove = async (companyId: number) => {
    setIsUpdating(true);
    try {
      await accountService.reviewCompany(companyId, 'verified');
      toast.success('Empresa aprobada exitosamente');
      mutate('/accounts/company/');
      setShowDetailDialog(false);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Error al aprobar la empresa');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (companyId: number) => {
    setIsUpdating(true);
    try {
      await accountService.reviewCompany(companyId, 'rejected');
      toast.success('Empresa rechazada');
      mutate('/accounts/company/');
      setShowDetailDialog(false);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Error al rechazar la empresa');
    } finally {
      setIsUpdating(false);
    }
  };

  const viewDetails = (company: CompanyProfileResponse) => {
    setSelectedCompany(company);
    setShowDetailDialog(true);
  };

  // Stats
  const stats = {
    total: companies.length,
    pending: companies.filter(c => c.status === 'pending').length,
    verified: companies.filter(c => c.status === 'verified').length,
    rejected: companies.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestión de Empresas</h1>
        <p className="text-muted-foreground">
          Administre y apruebe las entidades financieras registradas
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
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
              <Clock className="w-4 h-4 text-amber-500" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Verificadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Rechazadas
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
                placeholder="Buscar por nombre o RIF..."
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
                <SelectItem value="verified">Verificadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Empresas</CardTitle>
          <CardDescription>
            {filteredCompanies.length} empresas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No se encontraron empresas</h3>
              <p className="text-muted-foreground">
                Intente ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>RIF</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{company.company_name}</p>
                          {company.legal_name && (
                            <p className="text-sm text-muted-foreground">{company.legal_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{company.rif}</TableCell>
                      <TableCell>
                        {company.company_type ? (
                          <Badge variant="outline">
                            {companyTypeLabels[company.company_type] || company.company_type}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(company.status)}
                          <Badge variant={getStatusVariant(company.status)}>
                            {statusLabels[company.status]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewDetails(company)}
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
        <DialogContent className="w-full max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Empresa</DialogTitle>
            <DialogDescription>
              Revise la información y tome una decisión
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span>{selectedCompany.company_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RIF:</span>
                      <span>{selectedCompany.rif}</span>
                    </div>
                    {selectedCompany.legal_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Razón Social:</span>
                        <span>{selectedCompany.legal_name}</span>
                      </div>
                    )}
                    {selectedCompany.company_type && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span>{companyTypeLabels[selectedCompany.company_type] || selectedCompany.company_type}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Contacto</h4>
                  <div className="space-y-2 text-sm">
                    {selectedCompany.corporate_phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teléfono:</span>
                        <span className="break-all text-right">{selectedCompany.corporate_phone}</span>
                      </div>
                    )}
                    {selectedCompany.website && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Web:</span>
                        <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-right inline-block max-w-[60%]">
                          {selectedCompany.website}
                        </a>
                      </div>
                    )}
                    {selectedCompany.response_time && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiempo Resp.:</span>
                        <span>{selectedCompany.response_time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedCompany.fiscal_address && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Dirección Fiscal</h4>
                  <p className="text-sm">{selectedCompany.fiscal_address}</p>
                </div>
              )}

              {selectedCompany.description && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Descripcion</h4>
                  <p className="text-sm">{selectedCompany.description}</p>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <span className="text-sm text-muted-foreground">Estado actual:</span>
                <Badge variant={getStatusVariant(selectedCompany.status)}>
                  {statusLabels[selectedCompany.status]}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedCompany && selectedCompany.status === 'pending' && (
              <>
                <Button 
                  variant="destructive"
                  disabled={isUpdating}
                  onClick={() => handleReject(selectedCompany.id)}
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                  Rechazar
                </Button>
                <Button disabled={isUpdating} onClick={() => handleApprove(selectedCompany.id)}>
                  {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Aprobar Empresa
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
