'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context';
import { Button, Badge } from '@/components';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
    }
  };

  // Mapear roles a colores
  const roleColors: Record<string, 'success' | 'info' > = {
    admin: 'success',
    user: 'info',
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    user: 'Usuario',
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">TechNova</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center space-x-4">
            {/* Información del usuario */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Badge 
                variant={roleColors[user?.role || 'user']} 
                size="sm"
              >
                {roleLabels[user?.role || 'user']}
              </Badge>
            </div>

            {/* Botón de usuario (mobile) */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="text-lg">👤</span>
              </button>

              {/* Menú desplegable mobile */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Botón de logout (desktop) */}
            <div className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                 Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}