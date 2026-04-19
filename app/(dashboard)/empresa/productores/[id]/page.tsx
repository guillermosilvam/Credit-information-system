import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download, Tractor, MapPin, ChevronLeft, Calendar, FileText, Anchor, Layers, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockProducerProfiles, mockUsers, landTenureLabels, roadConditionLabels, formatDate } from '@/lib/mock-data';

export default async function ProductorDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const producerId = parseInt(id);
  
  const profile = mockProducerProfiles.find(p => p.id === producerId);
  if (!profile) return notFound();

  const user = mockUsers.find(u => u.id === profile.userId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Navegación arriba */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/empresa/productores" className="hover:text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Volver al Directorio
        </Link>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
            <Tractor className="w-10 h-10 text-primary" />
          </div>
          <div>
            <div className="flex gap-3 items-center mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{profile.farmName}</h1>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Verificado</Badge>
            </div>
            <p className="flex items-center gap-1.5 text-muted-foreground mt-2">
              <MapPin className="w-4 h-4" /> {profile.address}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <FileText className="w-4 h-4" /> RIF: {profile.rif}
            </p>
          </div>
        </div>
        
        {/* Descargar Datos Button */}
        <Button className="shrink-0 gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform" size="lg">
          <Download className="w-5 h-5" />
          Descargar Datos (PDF)
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Detalles Técnicos Agrícolas */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Layers className="w-5 h-5 text-primary" /> Perfil Agroproductivo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Actividad Principal</dt>
                  <dd className="text-lg font-medium">{profile.mainActivity}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Condicion de Vias</dt>
                  <dd className="text-lg font-medium">{roadConditionLabels[profile.roadCondition] || profile.roadCondition}</dd>
                </div>
                <div className="col-span-2">
                  <Separator className="my-2" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Area Total (Has)</dt>
                  <dd className="text-lg font-medium">{profile.totalArea}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Area Cultivada (Has)</dt>
                  <dd className="text-lg font-medium text-primary">{profile.cultivatedArea}</dd>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="w-5 h-5 text-primary" /> Maquinaria e Infraestructura
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-foreground leading-relaxed">
                {profile.machineryInventory}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Datos Legales y Usuario */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Anchor className="w-5 h-5 text-primary" /> Situacion Legal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Tenencia de la Tierra</dt>
                <dd className="text-base font-medium flex items-center gap-2">
                  <Badge variant="secondary">{landTenureLabels[profile.landTenure] || profile.landTenure}</Badge>
                </dd>
              </div>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Representante/Titular</dt>
                <dd className="text-base font-medium">{user?.username || 'No registrado'}</dd>
              </div>
              <Separator />
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Cedula de Identidad</dt>
                <dd className="text-base font-medium">{profile.nationalId}</dd>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">Contacto de Registro</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 test-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Telefono</span>
                <span className="font-medium">{profile.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Correo</span>
                <span className="font-medium truncate max-w-[150px]" title={user?.email}>{user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Miembro desde</span>
                <span className="font-medium">{user ? formatDate(user.createdAt) : 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
