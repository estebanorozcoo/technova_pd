'use client';

import React from 'react';
import Link from 'next/link';
import ProductForm from '@/components/products/ProductForm';

export default function CreateProductPage() {
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
          <li className="text-gray-900 font-medium">Crear Producto</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ➕ Crear Nuevo Producto
        </h1>
        <p className="text-gray-600">
          Completa el formulario para agregar un nuevo producto al catálogo
        </p>
      </div>

      {/* Formulario en card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <ProductForm mode="create" />
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-blue-600 text-xl mr-3">💡</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Tips para crear productos:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>El SKU debe ser único y no se podrá modificar después</li>
              <li>Usa nombres descriptivos para facilitar las búsquedas</li>
              <li>Las imágenes mejoran la presentación del catálogo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}