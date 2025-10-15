import React from 'react';
import { Button } from '@/components';

interface EmptyStateProps {
  onCreateClick?: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <span className="text-3xl">📦</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No hay productos
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Comienza creando tu primer producto para gestionar tu inventario.
      </p>
      {onCreateClick && (
        <Button variant="primary" onClick={onCreateClick}>
          ➕ Crear Primer Producto
        </Button>
      )}
    </div>
  );
}