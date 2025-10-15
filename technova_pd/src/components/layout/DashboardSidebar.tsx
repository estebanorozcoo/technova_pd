'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Productos',
    href: '/dashboard/products',
    icon: '📦',
  },
  {
    label: 'Usuarios',
    href: '/dashboard/users',
    icon: '👥',
    badge: 'Próximamente',
  },
  {
    label: 'Pedidos',
    href: '/dashboard/orders',
    icon: '🛒',
    badge: 'Próximamente',
  },
  {
    label: 'Reportes',
    href: '/dashboard/reports',
    icon: '📈',
    badge: 'Próximamente',
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${active
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              
              {item.badge && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Información adicional */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-700 mb-1">
             Tip del día
          </p>
          <p className="text-xs text-gray-600">
            Usa los filtros para encontrar productos más rápido
          </p>
        </div>
      </div>
    </aside>
  );
}