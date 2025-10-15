'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, ProductFilters as Filters } from '@/types/product.types';
import { productService } from '@/services';
import { Button } from '@/components';
import ProductList from '@/components/products/ProductList';
import ProductFilters from '@/components/products/ProductFilters';
import EmptyState from '@/components/products/EmptyState';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

  /**
   * Cargar productos desde la API
   */
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const data = await productService.getProducts();
      setProducts(data);
      
      console.log(`✅ ${data.length} productos cargados`);
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      setError(error.message || 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Aplicar filtros y búsqueda
   */
  const applyFilters = () => {
    let filtered = [...products];

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Filtro por estado
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(p => p.isActive === filters.isActive);
    }

    // Filtro por marca
    if (filters.brand) {
      filtered = filtered.filter(p =>
        p.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    // Búsqueda por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    // Filtro especial para stock bajo (desde URL)
    if (searchParams.get('filter') === 'lowstock') {
      filtered = filtered.filter(p => p.quantity < 5 && p.isActive);
    }

    setFilteredProducts(filtered);
  };

  /**
   * Manejar edición de producto
   */
  const handleEdit = (product: Product) => {
    console.log('Editar producto:', product._id);
    router.push(`/dashboard/products/edit/${product._id}`);
  };

  /**
   * Manejar eliminación de producto
   */
  const handleDelete = async (id: string) => {
    const product = products.find(p => p._id === id);
    
    if (!confirm(`¿Estás seguro de eliminar "${product?.name}"?`)) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      
      // Actualizar lista local
      setProducts(prev => prev.filter(p => p._id !== id));
      
      if (product) {
        toast.success(`Producto "${product.name}" eliminado`);
      } else {
        toast.success('Producto eliminado');
      }
      
      // Mostrar notificación (puedes mejorar esto con un toast)
      alert('Producto eliminado exitosamente');
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      toast.error(error.message || 'Error al eliminar producto');
    }
  };

  /**
   * Manejar activar/desactivar producto
   */
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const updatedProduct = await productService.toggleProductStatus(id, isActive);
      
      // Actualizar lista local
      setProducts(prev =>
        prev.map(p => (p._id === id ? updatedProduct : p))
      );
      
      const action = isActive ? 'desactivado' : 'activado';
      toast.success(`Producto ${action} exitosamente`);
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar estado');
      alert(error.message || 'Error al cambiar estado del producto');
    }
  };

  /**
   * Navegar a crear producto
   */
  const handleCreateProduct = () => {
    router.push('/dashboard/products/create');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <span className="text-red-600 text-2xl mr-3">⚠️</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar productos
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button variant="danger" onClick={loadProducts}>
              🔄 Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📦 Gestión de Productos
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} de {products.length} productos
          </p>
        </div>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleCreateProduct}
        >
          ➕ Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <ProductFilters
        onFilterChange={setFilters}
        onSearch={setSearchQuery}
        currentFilters={filters}
      />

      {/* Lista de productos o estado vacío */}
      {products.length === 0 ? (
        <EmptyState onCreateClick={handleCreateProduct} />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar los filtros o realizar otra búsqueda
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({});
              setSearchQuery('');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <ProductList
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* Botón flotante para móvil */}
      <button
        onClick={handleCreateProduct}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-2xl"
        aria-label="Crear producto"
      >
        ➕
      </button>
    </div>
  );
}