'use client';

import React from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <DashboardHeader />

        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Contenido principal */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}