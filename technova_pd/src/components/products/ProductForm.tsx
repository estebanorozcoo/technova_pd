'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductFormData, ProductCategory } from '@/types/product.types';
import { productService } from '@/services';
import { Button } from '@/components';
import toast from 'react-hot-toast';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: Product;
  productId?: string;
}

export default function ProductForm({ 
  mode, 
  initialData, 
  productId 
}: ProductFormProps) {
  const router = useRouter();

  // Estado del formulario
  const [formData, setFormData] = useState<ProductFormData>({
    sku: initialData?.sku || '',
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    quantity: initialData?.quantity || 0,
    price: initialData?.price || 0,
    category: initialData?.category || 'laptops',
    imageUrl: initialData?.imageUrl || '',
  });

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [generalError, setGeneralError] = useState('');

  // Opciones de categorías
  const categories: { value: ProductCategory; label: string; icon: string }[] = [
    { value: 'laptops', label: 'Laptops', icon: '💻' },
    { value: 'monitors', label: 'Monitores', icon: '🖥️' },
    { value: 'peripherals', label: 'Periféricos', icon: '⌨️' },
    { value: 'accessories', label: 'Accesorios', icon: '🎧' },
  ];

  /**
   * Validar campo individual
   */
  const validateField = (name: keyof ProductFormData, value: any): string => {
    switch (name) {
      case 'sku':
        if (!value.trim()) return 'El SKU es obligatorio';
        if (value.length < 3) return 'El SKU debe tener al menos 3 caracteres';
        if (!/^[A-Z0-9-]+$/i.test(value)) return 'El SKU solo puede contener letras, números y guiones';
        return '';

      case 'name':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        return '';

      case 'brand':
        if (!value.trim()) return 'La marca es obligatoria';
        return '';

      case 'quantity':
        if (value < 0) return 'La cantidad no puede ser negativa';
        if (!Number.isInteger(Number(value))) return 'La cantidad debe ser un número entero';
        return '';

      case 'price':
        if (value <= 0) return 'El precio debe ser mayor a 0';
        if (isNaN(value)) return 'El precio debe ser un número válido';
        return '';

      case 'imageUrl':
        if (!value.trim()) return 'La URL de imagen es obligatoria';
        try {
          new URL(value);
          return '';
        } catch {
          return 'La URL de imagen no es válida';
        }

      default:
        return '';
    }
  };

  /**
   * Validar todo el formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    (Object.keys(formData) as Array<keyof ProductFormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Convertir a número si es necesario
    const finalValue = 
      type === 'number' ? 
      (value === '' ? 0 : Number(value)) : 
      value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    // Validar campo en tiempo real
    const error = validateField(name as keyof ProductFormData, finalValue);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));

    // Limpiar error general
    if (generalError) setGeneralError('');
  };

  /**
   * Manejar submit del formulario
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');

    // Validar formulario
    if (!validateForm()) {
      setGeneralError('Por favor corrige los errores antes de continuar');
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === 'create') {
        // Crear nuevo producto
        const newProduct = await productService.createProduct(formData);
        console.log('✅ Producto creado:', newProduct._id);
        toast.success('¡Producto creado exitosamente!');
      } else if (mode === 'edit' && productId) {
        // Actualizar producto existente
        const updatedProduct = await productService.updateProduct(productId, formData);
        console.log('✅ Producto actualizado:', updatedProduct._id);
        toast.success('¡Producto actualizado exitosamente!');
      }

      // Redireccionar a la lista de productos
      router.push('/dashboard/products');
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el producto');
      setGeneralError(error.message || 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cancelar y volver
   */
  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
      router.push('/dashboard/products');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error general */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-red-600 text-xl mr-2">⚠️</span>
            <p className="text-sm text-red-800">{generalError}</p>
          </div>
        </div>
      )}

      {/* Grid de campos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            value={formData.sku}
            onChange={handleChange}
            disabled={mode === 'edit'} // SKU no editable
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.sku ? 'border-red-500' : 'border-gray-300'
            } ${mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Ej: LAP001"
          />
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
          )}
          {mode === 'edit' && (
            <p className="mt-1 text-xs text-gray-500">El SKU no se puede modificar</p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Laptop Dell XPS 15"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Marca */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Marca <span className="text-red-500">*</span>
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.brand ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Dell"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad <span className="text-red-500">*</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Precio (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
      </div>

      {/* URL de imagen (campo completo) */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL de Imagen <span className="text-red-500">*</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            errors.imageUrl ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          💡 Tip: Puedes usar imágenes de{' '}
          <a 
            href="https://unsplash.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Unsplash
          </a>
        </p>
        
        {/* Preview de imagen */}
        {formData.imageUrl && !errors.imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="relative h-40 w-full bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setErrors(prev => ({ ...prev, imageUrl: 'No se pudo cargar la imagen' }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creando...'
              : 'Guardando...'
            : mode === 'create'
            ? '✅ Crear Producto'
            : '💾 Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}