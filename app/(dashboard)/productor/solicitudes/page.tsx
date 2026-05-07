'use client';

import Link from 'next/link';
import { FileText, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, statusLabels } from '@/lib/formatters';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { CreditApplicationResponse, CreditPlanResponse } from '@/services/creditService';
import { Loader2 } from 'lucide-react';
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

export default function MisSolicitudesPage() {
  const { data: userApplications = [], isLoading: loadingApps } = useSWR<CreditApplicationResponse[]>('/credits/applications/', fetcher);
  const { data: plans = [], isLoading: loadingPlans } = useSWR<CreditPlanResponse[]>('/credits/plans/', fetcher);

  const isLoading = loadingApps || loadingPlans;

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

  const getPlanDetails = (planId: number) => {
    return plans.find((plan) => plan.id === planId);
  };

  // Estadisticas
  const stats = {
    total: userApplications.length,
    pending: userApplications.filter(a => a.status === 'pending').length,
    underReview: userApplications.filter(a => a.status === 'under_review').length,
    approved: userApplications.filter(a => a.status === 'approved').length,
    rejected: userApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis Solicitudes</h1>
        <p className="text-muted-foreground">
          Historial y estado de sus solicitudes de credito
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending + stats.underReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Solicitudes</CardTitle>
          <CardDescription>
            Todas las solicitudes de credito que ha realizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No tiene solicitudes</h3>
              <p className="text-muted-foreground mb-4">
                Explore los planes de credito disponibles y aplique al que mejor se adapte a sus necesidades
              </p>
              <Link href="/productor/creditos">
                <Button>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Explorar Creditos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan de Credito</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha de Solicitud</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Revision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userApplications.map((application) => {
                    const plan = getPlanDetails(application.credit_plan);
                    return (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{application.credit_plan_title || `Plan #${application.credit_plan}`}</p>
                            <p className="text-sm text-muted-foreground">
                              {plan?.company_name || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {plan ? (
                            <span>
                              {formatCurrency(plan.min_amount)} - {formatCurrency(plan.max_amount)}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(application.applied_at)}
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
                          {application.updated_at ? formatDate(application.updated_at) : '-'}
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

      {/* Info Card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sobre el proceso de solicitud</h3>
              <p className="text-sm text-muted-foreground">
                Una vez enviada su solicitud, la entidad financiera revisara su perfil y la informacion 
                de su finca. El tiempo de respuesta varia segun la entidad. Mantendra su perfil actualizado 
                para agilizar el proceso de aprobacion.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}
