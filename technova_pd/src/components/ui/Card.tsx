import React from 'react';
import Image from 'next/image';
import Button from './Button';
import Badge from './Badge';
import { Product } from '@/types/product.types';

interface CardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
}

const Card: React.FC<CardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  // Mapear categoría a texto legible
  const categoryLabels: Record<string, string> = {
    laptops: 'Laptops',
    monitors: 'Monitores',
    peripherals: 'Periféricos',
    accessories: 'Accesorios',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Imagen del producto */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge de estado en la esquina superior derecha */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={product.isActive ? 'success' : 'danger'}
            size="sm"
            dot
          >
            {product.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        {/* Badge de stock bajo */}
        {product.quantity < 5 && product.isActive && (
          <div className="absolute top-2 left-2">
            <Badge variant="warning" size="sm">
              Stock Bajo
            </Badge>
          </div>
        )}
      </div>

      {/* Contenido de la card */}
      <div className="p-4">
        {/* Categoría y SKU */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="info" size="sm">
            {categoryLabels[product.category]}
          </Badge>
          <span className="text-xs text-gray-500 font-mono">
            {product.sku}
          </span>
        </div>

        {/* Nombre del producto */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Marca */}
        <p className="text-sm text-gray-600 mb-3">
          {product.brand}
        </p>

        {/* Precio y cantidad */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Stock</p>
            <p className={`text-sm font-semibold ${
              product.quantity < 5 ? 'text-red-600' : 'text-green-600'
            }`}>
              {product.quantity} unidades
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(product)}
              className="flex-1"
            >
               Editar
            </Button>
          )}
          
          {onToggleActive && (
            <Button
              variant={product.isActive ? 'secondary' : 'success'}
              size="sm"
              onClick={() => onToggleActive(product._id!, product.isActive)}
            >
              {product.isActive ? 'No' : 'Si'}
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(product._id!)}
            >
              🗑️
            </Button>
          )}
        </div>

        {/* Fecha de creación */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Creado: {new Date(product.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;