'use client';

import Link from 'next/link';
import { ArrowRight, Building2, CreditCard, FileText, Tractor, Users, AlertCircle } from 'lucide-react';
import { mockAdminStats, mockCompanyProfiles, mockCreditApplications, mockCreditPlans, formatDate, statusLabels } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const pendingCompanies = mockCompanyProfiles.filter(c => c.status === 'pending');
  const recentApplications = mockCreditApplications.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Administracion</h1>
        <p className="text-muted-foreground">
          Bienvenido al centro de control de AgriFinance
        </p>
      </div>

      {/* Alert for pending companies */}
      {pendingCompanies.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  {pendingCompanies.length} {pendingCompanies.length === 1 ? 'empresa requiere' : 'empresas requieren'} aprobacion
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Revise las solicitudes de registro pendientes
                </p>
              </div>
              <Link href="/admin/empresas">
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300">
                  Revisar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productores</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.totalProducers}</div>
            <p className="text-xs text-muted-foreground">
              Productores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-600 font-medium">{mockAdminStats.pendingCompanies}</span> pendientes de aprobacion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Planes de Credito</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.totalCreditPlans}</div>
            <p className="text-xs text-muted-foreground">
              Planes publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAdminStats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Total de solicitudes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rapidas</CardTitle>
          <CardDescription>
            Acceda a las funciones de administracion principales
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/admin/empresas">
            <Button className="gap-2">
              <Building2 className="w-4 h-4" />
              Gestionar Empresas
              {pendingCompanies.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-800">
                  {pendingCompanies.length}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/admin/productores">
            <Button variant="outline" className="gap-2">
              <Tractor className="w-4 h-4" />
              Ver Productores
            </Button>
          </Link>
          <Link href="/admin/estadisticas">
            <Button variant="outline" className="gap-2">
              <Users className="w-4 h-4" />
              Estadisticas
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Pending Companies */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Empresas Pendientes de Aprobacion</CardTitle>
            <CardDescription>
              Solicitudes de registro que requieren revision
            </CardDescription>
          </div>
          <Link href="/admin/empresas">
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {pendingCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay empresas pendientes de aprobacion</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{company.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      RIF: {company.rif} | Tipo: {company.companyType || 'No especificado'}
                    </p>
                  </div>
                  <Badge variant="secondary">Pendiente</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Ultimas solicitudes de credito en la plataforma
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <p className="font-medium">{application.producerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.creditPlanTitle} - {formatDate(application.appliedAt)}
                  </p>
                </div>
                <Badge variant={
                  application.status === 'approved' ? 'default' :
                  application.status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {statusLabels[application.status]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
