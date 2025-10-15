'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context';
import { productService } from '@/services';
import StatsCard from '@/components/dashboard/StatsCard';
import { Button } from '@/components';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Obtener todos los productos
      const products = await productService.getProducts();
      
      // Calcular estadísticas
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.isActive).length;
      const lowStockProducts = products.filter(p => p.quantity < 5 && p.isActive).length;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

      setStats({
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalValue,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener saludo según hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Buenos días';
    if (hour < 18) return '☀️ Buenas tardes';
    return '🌙 Buenas noches';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {user?.username}! 👋
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu inventario
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Productos"
          value={stats.totalProducts}
          icon="📦"
          description="Productos en catálogo"
        />
        
        <StatsCard
          title="Productos Activos"
          value={stats.activeProducts}
          icon="✅"
          description="Disponibles para venta"
        />
        
        <StatsCard
          title="Stock Bajo"
          value={stats.lowStockProducts}
          icon="⚠️"
          description="Menos de 5 unidades"
        />
        
        <StatsCard
          title="Valor Total"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon="💰"
          description="Inventario valorizado"
        />
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🚀 Acciones Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/products">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center">
              <span className="text-3xl mb-2 block">📦</span>
              <h3 className="font-semibold text-gray-900 mb-1">
                Ver Productos
              </h3>
              <p className="text-sm text-gray-600">
                Gestiona tu inventario
              </p>
            </div>
          </Link>

          <Link href="/dashboard/products?action=create">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer text-center">
              <span className="text-3xl mb-2 block">➕</span>
              <h3 className="font-semibold text-gray-900 mb-1">
                Agregar Producto
              </h3>
              <p className="text-sm text-gray-600">
                Crear nuevo producto
              </p>
            </div>
          </Link>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 opacity-50 cursor-not-allowed text-center">
            <span className="text-3xl mb-2 block">📊</span>
            <h3 className="font-semibold text-gray-900 mb-1">
              Ver Reportes
            </h3>
            <p className="text-sm text-gray-600">
              Próximamente
            </p>
          </div>
        </div>
      </div>

      {/* Alertas si hay stock bajo */}
      {stats.lowStockProducts > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-yellow-600 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                Alerta de Stock Bajo
              </h3>
              <p className="text-sm text-yellow-700">
                Tienes {stats.lowStockProducts} producto(s) con menos de 5 unidades.
                Considera reabastecer pronto.
              </p>
              <Link href="/dashboard/products?filter=lowstock">
                <Button variant="outline" size="sm" className="mt-3">
                  Ver Productos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}