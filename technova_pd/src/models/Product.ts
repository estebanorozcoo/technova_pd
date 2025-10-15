import mongoose, { Schema, Model } from 'mongoose';
import { Product } from '@/types/product.types';

const ProductSchema = new Schema<Product>(
  {
    sku: {
      type: String,
      required: [true, 'SKU es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Nombre es obligatorio'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Marca es obligatoria'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Cantidad es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: [true, 'Categoría es obligatoria'],
      enum: {
        values: ['laptops', 'monitors', 'peripherals', 'accessories'],
        message: '{VALUE} no es una categoría válida',
      },
    },
    imageUrl: {
      type: String,
      required: [true, 'URL de imagen es obligatoria'],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Prevenir modelo duplicado en desarrollo
const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);

export default ProductModel;