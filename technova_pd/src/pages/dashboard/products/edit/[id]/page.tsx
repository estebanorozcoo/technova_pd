'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/types/product.types';
import { productService } from '@/services';
import ProductForm from '@/components/products/ProductForm';
import { Badge } from '@/components';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const data = await productService.getProductById(productId);
      setProduct(data);
      
      console.log('✅ Producto cargado:', data.name);
    } catch (error: any) {
      console.error('Error cargando producto:', error);
      setError(error.message || 'Error al cargar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <span className="text-red-600 text-2xl mr-3">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error al cargar producto
              </h3>
              <p className="text-red-700 mb-4">{error || 'Producto no encontrado'}</p>
              <Link
                href="/dashboard/products"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                ← Volver a productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/dashboard/products" className="hover:text-blue-600">
              Productos
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Editar Producto</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ✏️ Editar Producto
            </h1>
            <p className="text-gray-600">
              Actualiza la información del producto
            </p>
          </div>
          
          <Badge
            variant={product.isActive ? 'success' : 'danger'}
            size="md"
            dot
          >
            {product.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </div>

      {/* Información del producto */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">SKU</p>
            <p className="font-mono font-semibold text-gray-900">{product.sku}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Creado</p>
            <p className="font-semibold text-gray-900">
              {new Date(product.createdAt).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Stock Actual</p>
            <p className={`font-semibold ${product.quantity < 5 ? 'text-red-600' : 'text-green-600'}`}>
              {product.quantity} unidades
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Precio Actual</p>
            <p className="font-semibold text-gray-900">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario en card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <ProductForm 
          mode="edit" 
          initialData={product} 
          productId={productId}
        />
      </div>
    </div>
  );
}