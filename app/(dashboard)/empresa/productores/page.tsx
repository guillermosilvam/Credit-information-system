import Link from 'next/link';
import { Tractor, MapPin, ChevronRight, User, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockProducerProfiles, mockUsers } from '@/lib/mock-data';

export default function ProductoresPage() {
  // Combinar los datos mock para mostrar
  const producers = mockProducerProfiles.map(profile => {
    const user = mockUsers.find(u => u.id === profile.userId);
    return { ...profile, user };
  });

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
            placeholder="Buscar por finca, municipio o rubro..." 
            className="pl-9 w-full bg-background/50"
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      {/* Lista de Productores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {producers.map((producer) => (
          <Card key={producer.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Tractor className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{producer.farmName}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate" title={producer.address}>{producer.address}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Actividad:</span>
                    <span className="text-foreground">{producer.mainActivity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Area Total:</span>
                    <span className="text-foreground">{producer.totalArea} Has</span>
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
    </div>
  );
}
