'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  CreditCard, 
  FileText, 
  Home, 
  LogOut, 
  Settings, 
  Tractor, 
  User,
  Users,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { SessionTimeoutProvider } from '@/lib/session-timeout';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

const producerNavItems = [
  { title: 'Inicio', href: '/productor', icon: Home },
  { title: 'Explorar Créditos', href: '/productor/creditos', icon: CreditCard },
  { title: 'Mis Solicitudes', href: '/productor/solicitudes', icon: FileText },
  { title: 'Mi Perfil', href: '/productor/perfil', icon: User },
];

const companyNavItems = [
  { title: 'Inicio', href: '/empresa', icon: Home },
  { title: 'Mis Planes', href: '/empresa/planes', icon: CreditCard },
  { title: 'Solicitudes', href: '/empresa/solicitudes', icon: FileText },
  { title: 'Mi Perfil', href: '/empresa/perfil', icon: Building2 },
];

const adminNavItems = [
  { title: 'Inicio', href: '/admin', icon: Home },
  { title: 'Empresas', href: '/admin/empresas', icon: Building2 },
  { title: 'Productores', href: '/admin/productores', icon: Tractor },
  { title: 'Estadísticas', href: '/admin/estadisticas', icon: BarChart3 },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = user.role === 'producer' 
    ? producerNavItems 
    : user.role === 'company' 
    ? companyNavItems 
    : adminNavItems;

  const roleLabel = user.role === 'producer' 
    ? 'Productor' 
    : user.role === 'company' 
    ? 'Empresa' 
    : 'Administrador';

  const roleIcon = user.role === 'producer' 
    ? Tractor 
    : user.role === 'company' 
    ? Building2 
    : ShieldCheck;

  const RoleIcon = roleIcon;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shadow-inner">
              <Tractor className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground tracking-wide">SIGEFA</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <RoleIcon className="w-4 h-4" />
              {roleLabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium text-sidebar-foreground">{user.username}</span>
                  <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.role !== 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href={`/${user.role === 'producer' ? 'productor' : 'empresa'}/perfil`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionTimeoutProvider>
        <DashboardContent>{children}</DashboardContent>
      </SessionTimeoutProvider>
    </AuthProvider>
  );
}
