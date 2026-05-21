'use client';

import Link from 'next/link';
import { Tractor, MapPin, ChevronRight, User, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { ProducerProfileResponse } from '@/services/accountService';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ProductoresPage() {
  const { data: producers = [], isLoading } = useSWR<ProducerProfileResponse[]>('/accounts/producer/', fetcher);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducers = producers.filter(producer => 
    (producer.farm_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (producer.main_activity?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Directorio de Productores</h1>
          <p className="text-muted-foreground mt-1">Explora los perfiles agricolas disponibles para financiamiento.</p>
        </div>
      </div>

      {/* Buscador y Filtros básicos */}
      <div className="flex gap-4 items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por finca o rubro..." 
            className="pl-9 w-full bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
      <>
      {/* Lista de Productores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducers.map((producer) => (
          <Card key={producer.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Tractor className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{producer.farm_name || 'Finca Sin Nombre'}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate" title={producer.address}>{producer.address || 'Sin Dirección'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Actividad:</span>
                    <span className="text-foreground">{producer.main_activity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Area Total:</span>
                    <span className="text-foreground">{producer.total_area || 0} Has</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <span className="font-medium inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Titular:
                    </span>
                    <span className="text-foreground truncate max-w-[120px]">{producer.user?.username || 'Desconocido'}</span>
                  </div>
                </div>
                
                <Link href={`/empresa/productores/${producer.id}`} className="block">
                  <Button className="w-full gap-2 transition-all group-hover:bg-primary/90">
                    Ver Perfil Completo
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </>
      )}
    </div>
  );
}
