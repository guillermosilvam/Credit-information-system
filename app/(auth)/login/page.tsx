'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShieldAlert, Tractor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    const result = await login(formData.username, formData.password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Bienvenido a AgriFinance');
      // Redirigir segun el rol
      const savedUser = localStorage.getItem('agrifinance_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        switch (user.role) {
          case 'producer':
            router.push('/productor');
            break;
          case 'company':
            router.push('/empresa');
            break;
          case 'admin':
            router.push('/admin');
            break;
          default:
            router.push('/');
        }
      }
    } else {
      toast.error(result.error || 'Error al iniciar sesion');
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="lg:hidden flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-inner">
              <Tractor className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">SIGEFA</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Iniciar Sesion</CardTitle>
        <CardDescription>
          Ingrese sus credenciales para acceder a la plataforma
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario o Correo Electronico</Label>
            <Input
              id="username"
              type="text"
              placeholder="usuario o correo@ejemplo.com"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contrasena</Label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button type="button" className="text-sm text-primary hover:underline bg-transparent border-0 p-0 text-left cursor-pointer">
                    Olvide mi contrasena
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-primary" />
                      Recuperacion de Credenciales
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm md:text-base text-muted-foreground pt-3 space-y-3">
                      <span>
                        Por estrictos motivos de seguridad y resguardo de su perfil tecnico agrario, el restablecimiento automatico de contrasenas se encuentra inhabilitado en la plataforma.
                      </span>
                      <span className="block mt-2">
                        Por favor, redacte un correo electronico formal al Administrador Central indicando su <strong>R.I.F</strong> y la razon de la perdida a:
                      </span>
                      <span className="block font-semibold text-foreground text-center bg-muted p-2 rounded-md mt-4">
                        soporte@sigefa.com
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogAction className="w-full sm:w-auto">Entendido, contactare a soporte</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-6 pt-2 border-t border-border/50">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            No tienes una cuenta?{' '}
            <Link href="/registro" className="text-primary font-medium hover:underline">
              Registrate aqui
            </Link>
          </div>
        </CardFooter>
      </form>

      {/* Credenciales de prueba */}
      <div className="px-6 pb-6">
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center mb-2">
            Credenciales de prueba:
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between bg-muted/50 rounded px-3 py-2">
              <span>Productor:</span>
              <span className="font-mono">productor1 / 123456</span>
            </div>
            <div className="flex justify-between bg-muted/50 rounded px-3 py-2">
              <span>Empresa:</span>
              <span className="font-mono">bancoverde / 123456</span>
            </div>
            <div className="flex justify-between bg-muted/50 rounded px-3 py-2">
              <span>Admin:</span>
              <span className="font-mono">admin / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
