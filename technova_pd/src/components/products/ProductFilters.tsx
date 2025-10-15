'use client';

import React, { useState } from 'react';
import { ProductCategory, ProductFilters as Filters } from '@/types/product.types';
import { Button } from '@/components';

interface ProductFiltersProps {
  onFilterChange: (filters: Filters) => void;
  onSearch: (query: string) => void;
  currentFilters: Filters;
}

export default function ProductFilters({
  onFilterChange,
  onSearch,
  currentFilters,
}: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { value: ProductCategory | ''; label: string }[] = [
    { value: '', label: 'Todas las categorías' },
    { value: 'laptops', label: '💻 Laptops' },
    { value: 'monitors', label: '🖥️ Monitores' },
    { value: 'peripherals', label: '⌨️ Periféricos' },
    { value: 'accessories', label: '🎧 Accesorios' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'true', label: '✅ Activos' },
    { value: 'false', label: '🔒 Inactivos' },
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...currentFilters,
      category: category as ProductCategory | undefined,
    });
  };

  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...currentFilters,
      isActive: status === '' ? undefined : status === 'true',
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    onFilterChange({});
    onSearch('');
  };

  const hasActiveFilters = 
    currentFilters.category || 
    currentFilters.brand || 
    currentFilters.isActive !== undefined ||
    searchQuery;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Búsqueda */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, marca o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </form>

        {/* Filtro por categoría */}
        <div className="w-full lg:w-48">
          <select
            value={currentFilters.category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <div className="w-full lg:w-48">
          <select
            value={
              currentFilters.isActive === undefined
                ? ''
                : currentFilters.isActive
                ? 'true'
                : 'false'
            }
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="md"
            onClick={handleClearFilters}
          >
            🗑️ Limpiar
          </Button>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          
          {currentFilters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              📂 {categories.find(c => c.value === currentFilters.category)?.label}
            </span>
          )}
          
          {currentFilters.isActive !== undefined && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              {currentFilters.isActive ? '✅ Activos' : '🔒 Inactivos'}
            </span>
          )}
          
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              🔍 "{searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}