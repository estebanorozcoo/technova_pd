'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState } from '@/types/user.types';
import { authService } from '@/services';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Crear contexto con valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Inicialmente true mientras verificamos sesión
  });

  // Verificar sesión al montar el componente
  useEffect(() => {
    checkUserSession();
  }, []);

  /**
   * Verificar si hay una sesión activa
   */
  const checkUserSession = async () => {
    try {
      console.log(' Verificando sesión...');
      
      const user = authService.checkSession();
      
      if (user) {
        console.log(' Sesión activa encontrada:', user.username);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log(' No hay sesión activa');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(' Error verificando sesión:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  /**
   * Iniciar sesión
   */
  const login = async (username: string, password: string) => {
    try {
      console.log(' Iniciando login...');
      
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Llamar al servicio de autenticación
      const user = await authService.login({ username, password });

      // Guardar en estado
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Guardar en localStorage (persistencia)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      console.log(' Login exitoso, redirigiendo...');
      
      // Redireccionar al dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error(' Error en login:', error);
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Re-lanzar error para que el componente lo maneje
      throw error;
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    console.log(' Cerrando sesión...');

    // Limpiar estado
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }

    // Llamar al servicio
    authService.logout();

    // Redireccionar al login
    router.push('/login');
  };

  /**
   * Actualizar información del usuario
   */
  const updateUser = (updatedUser: User) => {
    console.log(' Actualizando usuario:', updatedUser.username);

    setAuthState(prev => ({
      ...prev,
      user: updatedUser,
    }));

    // Actualizar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};