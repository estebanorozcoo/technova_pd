'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'user' | 'viewer';
}

export default function ProtectedRoute({ 
  children, 
  requireRole 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        console.log(' No autenticado, redirigiendo al login...');
        router.push('/login');
        return;
      }

      // Si requiere un rol específico, verificar
      if (requireRole && user) {
        const roleHierarchy: Record<string, number> = {
          viewer: 1,
          user: 2,
          admin: 3,
        };

        const userLevel = roleHierarchy[user.role] || 0;
        const requiredLevel = roleHierarchy[requireRole] || 0;

        if (userLevel < requiredLevel) {
          console.log(` Rol insuficiente. Requiere: ${requireRole}, Tiene: ${user.role}`);
          router.push('/dashboard'); // Redirigir al dashboard principal
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requireRole, router]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (se redirige en el useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado y tiene los permisos, renderizar children
  return <>{children}</>;
}