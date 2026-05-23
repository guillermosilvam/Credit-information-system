'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { authService } from '@/services/authService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SESSION_CHECK_INTERVAL = 30_000;
const SESSION_DURATION = 55 * 60 * 1000;
const WARNING_DURATION = 5 * 60 * 1000;

interface SessionTimeoutContextType {
  extendSession: () => Promise<void>;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType | undefined>(undefined);

export function useSessionTimeout() {
  const ctx = useContext(SessionTimeoutContext);
  if (!ctx) throw new Error('useSessionTimeout must be used within SessionTimeoutProvider');
  return ctx;
}

export function SessionTimeoutProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const warningStartedAt = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dialogIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasShownRef = useRef(false);
  const isExtendingRef = useRef(false);

  const getSessionStart = (): number => {
    const stored = localStorage.getItem('session_start');
    if (stored) return Number(stored);
    const now = Date.now();
    localStorage.setItem('session_start', String(now));
    return now;
  };

  const doLogout = useCallback(() => {
    localStorage.removeItem('session_start');
    setShowDialog(false);
    hasShownRef.current = false;
    warningStartedAt.current = null;
    logout();
    router.push('/login');
  }, [logout, router]);

  const extendSession = useCallback(async () => {
    if (isExtendingRef.current) return;
    isExtendingRef.current = true;
    const res = await authService.refreshToken();
    if (res.success) {
      localStorage.setItem('session_start', String(Date.now()));
      setShowDialog(false);
      hasShownRef.current = false;
      warningStartedAt.current = null;
      setSecondsLeft(0);
    }
    isExtendingRef.current = false;
  }, []);

  const updateSecondsLeft = useCallback(() => {
    if (!warningStartedAt.current) return;
    const elapsedWarning = Date.now() - warningStartedAt.current;
    const remaining = Math.max(0, Math.ceil((WARNING_DURATION - elapsedWarning) / 1000));
    setSecondsLeft(remaining);
    if (elapsedWarning >= WARNING_DURATION) {
      doLogout();
    }
  }, [doLogout]);

  useEffect(() => {
    const sessionStart = getSessionStart();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - Number(localStorage.getItem('session_start') || sessionStart);
      const hasRefreshToken = !!localStorage.getItem('refresh_token');

      if (!hasRefreshToken) return;

      if (!hasShownRef.current && elapsed >= SESSION_DURATION) {
        warningStartedAt.current = Date.now();
        hasShownRef.current = true;
        setSecondsLeft(WARNING_DURATION / 1000);
        setShowDialog(true);
      }
    }, SESSION_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showDialog) {
      if (dialogIntervalRef.current) {
        clearInterval(dialogIntervalRef.current);
        dialogIntervalRef.current = null;
      }
      return;
    }

    updateSecondsLeft();
    dialogIntervalRef.current = setInterval(updateSecondsLeft, 1000);

    return () => {
      if (dialogIntervalRef.current) clearInterval(dialogIntervalRef.current);
    };
  }, [showDialog, updateSecondsLeft]);

  useEffect(() => {
    const handleActivity = () => {
      const hasRefreshToken = !!localStorage.getItem('refresh_token');
      if (!hasRefreshToken) return;

      const elapsed = Date.now() - Number(localStorage.getItem('session_start') || 0);

      if (elapsed < SESSION_DURATION && showDialog) {
        setShowDialog(false);
        hasShownRef.current = false;
        warningStartedAt.current = null;
        setSecondsLeft(0);
      }
    };

    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [showDialog]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'session_start' || e.key === 'access_token' || e.key === 'refresh_token') {
        if (!localStorage.getItem('refresh_token')) {
          setShowDialog(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SessionTimeoutContext.Provider value={{ extendSession }}>
      {children}

      <AlertDialog open={showDialog} onOpenChange={(open) => { if (!open && !isExtendingRef.current) { doLogout(); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tu sesión está por expirar</AlertDialogTitle>
            <AlertDialogDescription>
              Tu sesión se cerrará en <strong>{formatTime(secondsLeft)}</strong> minutos por inactividad.
              ¿Deseas extenderla?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={doLogout}>Cerrar sesión</AlertDialogCancel>
            <AlertDialogAction onClick={extendSession}>Extender sesión</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SessionTimeoutContext.Provider>
  );
}
