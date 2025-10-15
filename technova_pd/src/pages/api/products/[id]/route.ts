import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';

// GET /api/products/[id] - Obtener un producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Validar formato de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID inválido',
        message: 'El ID proporcionado no es válido',
      }, { status: 400 });
    }

    // Buscar producto
    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Producto no encontrado',
        message: `No existe producto con ID ${id}`,
      }, { status: 404 });
    }

    console.log(` Producto encontrado: ${product.name}`);

    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 200 });

  } catch (error: any) {
    console.error(` Error en GET /api/products/${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener producto',
      message: error.message,
    }, { status: 500 });
  }
}

// PUT /api/products/[id] - Actualizar producto completo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    console.log(` Actualizando producto ${id}:`, body);

    // Validar formato de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID inválido',
        message: 'El ID proporcionado no es válido',
      }, { status: 400 });
    }

    // Si se está cambiando el SKU, verificar que sea único
    if (body.sku) {
      const existingProduct = await ProductModel.findOne({
        sku: body.sku.toUpperCase(),
        _id: { $ne: id }, // Excluir el producto actual
      });

      if (existingProduct) {
        return NextResponse.json({
          success: false,
          error: 'SKU duplicado',
          message: `El SKU "${body.sku}" ya existe en otro producto`,
        }, { status: 409 });
      }

      // Normalizar SKU
      body.sku = body.sku.toUpperCase();
    }

    // Validaciones
    if (body.quantity !== undefined && body.quantity < 0) {
      return NextResponse.json({
        success: false,
        error: 'Cantidad inválida',
        message: 'La cantidad no puede ser negativa',
      }, { status: 400 });
    }

    if (body.price !== undefined && body.price <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Precio inválido',
        message: 'El precio debe ser mayor a 0',
      }, { status: 400 });
    }

    // Actualizar producto
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { $set: body },
      { 
        new: true, // Retornar documento actualizado
        runValidators: true, // Ejecutar validaciones de Mongoose
      }
    );

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Producto no encontrado',
        message: `No existe producto con ID ${id}`,
      }, { status: 404 });
    }

    console.log(` Producto actualizado: ${updatedProduct.name}`);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Producto actualizado exitosamente',
    }, { status: 200 });

  } catch (error: any) {
    console.error(` Error en PUT /api/products/${params.id}:`, error);

    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({
        success: false,
        error: 'Error de validación',
        message: messages.join(', '),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error al actualizar producto',
      message: error.message,
    }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    console.log(` Eliminando producto ${id}`);

    // Validar formato de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID inválido',
        message: 'El ID proporcionado no es válido',
      }, { status: 400 });
    }

    // Eliminar producto
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Producto no encontrado',
        message: `No existe producto con ID ${id}`,
      }, { status: 404 });
    }

    console.log(` Producto eliminado: ${deletedProduct.name} (SKU: ${deletedProduct.sku})`);

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'Producto eliminado exitosamente',
    }, { status: 200 });

  } catch (error: any) {
    console.error(` Error en DELETE /api/products/${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al eliminar producto',
      message: error.message,
    }, { status: 500 });
  }
}

// PATCH /api/products/[id] - Actualización parcial (alternativa a PUT)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    console.log(` Actualizando parcialmente producto ${id}:`, body);

    // Validar formato de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID inválido',
        message: 'El ID proporcionado no es válido',
      }, { status: 400 });
    }

    // Actualización parcial (solo campos enviados)
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { $set: body },
      { 
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Producto no encontrado',
        message: `No existe producto con ID ${id}`,
      }, { status: 404 });
    }

    console.log(` Producto actualizado parcialmente: ${updatedProduct.name}`);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Producto actualizado exitosamente',
    }, { status: 200 });

  } catch (error: any) {
    console.error(` Error en PATCH /api/products/${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al actualizar producto',
      message: error.message,
    }, { status: 500 });
  }
}