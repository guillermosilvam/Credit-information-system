'use client';

import { useState } from 'react';
import { Search, Eye, Tractor, MapPin } from 'lucide-react';
import { mockProducerProfiles, mockUsers, landTenureLabels, roadConditionLabels } from '@/lib/mock-data';
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
import type { ProducerProfile } from '@/lib/types';

export default function AdminProductoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducer, setSelectedProducer] = useState<ProducerProfile | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const producers = mockProducerProfiles;

  const filteredProducers = producers.filter(producer => {
    const user = mockUsers.find(u => u.id === producer.userId);
    return (
      producer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getUser = (userId: number) => {
    return mockUsers.find(u => u.id === userId);
  };

  const viewDetails = (producer: ProducerProfile) => {
    setSelectedProducer(producer);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Productores Registrados</h1>
        <p className="text-muted-foreground">
          Listado de todos los productores agricolas en la plataforma
        </p>
      </div>

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
            <CardTitle className="text-sm font-medium">Area Total Registrada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {producers.reduce((acc, p) => acc + (p.totalArea || 0), 0)} ha
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Area Cultivada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {producers.reduce((acc, p) => acc + (p.cultivatedArea || 0), 0)} ha
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
                Intente ajustar el termino de busqueda
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
                    <TableHead>Area</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducers.map((producer) => {
                    const user = getUser(producer.userId);
                    return (
                      <TableRow key={producer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{producer.farmName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-40">{producer.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">{producer.cultivatedArea || 0}</span>
                            <span className="text-muted-foreground"> / {producer.totalArea || 0} ha</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {producer.mainActivity ? (
                            <Badge variant="outline">{producer.mainActivity}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => viewDetails(producer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Productor</DialogTitle>
            <DialogDescription>
              Informacion completa del productor y su finca
            </DialogDescription>
          </DialogHeader>
          
          {selectedProducer && (
            <div className="space-y-6 py-4">
              {(() => {
                const user = getUser(selectedProducer.userId);
                return (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-3">Datos del Usuario</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Usuario:</span>
                            <span>{user?.username}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{user?.email}</span>
                          </div>
                          {selectedProducer.nationalId && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cedula:</span>
                              <span>{selectedProducer.nationalId}</span>
                            </div>
                          )}
                          {selectedProducer.phoneNumber && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Telefono:</span>
                              <span>{selectedProducer.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-3">Informacion de Finca</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nombre:</span>
                            <span>{selectedProducer.farmName}</span>
                          </div>
                          {selectedProducer.rif && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">RIF:</span>
                              <span>{selectedProducer.rif}</span>
                            </div>
                          )}
                          {selectedProducer.landTenure && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tenencia:</span>
                              <span>{landTenureLabels[selectedProducer.landTenure]}</span>
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
                        <p className="text-2xl font-bold text-primary">{selectedProducer.totalArea || 0}</p>
                        <p className="text-sm text-muted-foreground">Hectareas Totales</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 text-center">
                        <p className="text-2xl font-bold text-primary">{selectedProducer.cultivatedArea || 0}</p>
                        <p className="text-sm text-muted-foreground">Hectareas Cultivadas</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-lg font-medium">
                          {selectedProducer.roadCondition 
                            ? roadConditionLabels[selectedProducer.roadCondition] 
                            : 'No especificado'}
                        </p>
                        <p className="text-sm text-muted-foreground">Condicion de Vias</p>
                      </div>
                    </div>

                    {selectedProducer.mainActivity && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Actividad Principal</h4>
                        <Badge variant="outline">{selectedProducer.mainActivity}</Badge>
                      </div>
                    )}

                    {selectedProducer.machineryInventory && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Inventario de Maquinaria</h4>
                        <p className="text-sm">{selectedProducer.machineryInventory}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
