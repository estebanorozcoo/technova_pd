import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { Product } from '@/types/product.types';

// GET /api/products - Listar todos los productos (con filtros opcionales)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Obtener parámetros de búsqueda
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const isActive = searchParams.get('isActive');

    // Construir filtros dinámicos
    const filters: any = {};

    if (category) {
      filters.category = category;
    }

    if (brand) {
      filters.brand = new RegExp(brand, 'i'); // Case insensitive
    }

    if (isActive !== null) {
      filters.isActive = isActive === 'true';
    }

    console.log('🔍 Filtros aplicados:', filters);

    // Buscar productos con filtros
    const products = await ProductModel.find(filters)
      .sort({ createdAt: -1 }) // Más recientes primero
      .lean(); // Mejor performance

    console.log(` ${products.length} productos encontrados`);

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
    }, { status: 200 });

  } catch (error: any) {
    console.error(' Error en GET /api/products:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener productos',
      message: error.message,
    }, { status: 500 });
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parsear body
    const body = await request.json();
    console.log(' Datos recibidos:', body);

    // Validaciones adicionales
    if (!body.sku || !body.name || !body.brand) {
      return NextResponse.json({
        success: false,
        error: 'Campos obligatorios faltantes',
        message: 'SKU, nombre y marca son obligatorios',
      }, { status: 400 });
    }

    // Verificar SKU único
    const existingProduct = await ProductModel.findOne({ 
      sku: body.sku.toUpperCase() 
    });

    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'SKU duplicado',
        message: `El SKU "${body.sku}" ya existe`,
      }, { status: 409 }); // 409 Conflict
    }

    // Validar cantidad y precio
    if (body.quantity < 0) {
      return NextResponse.json({
        success: false,
        error: 'Cantidad inválida',
        message: 'La cantidad no puede ser negativa',
      }, { status: 400 });
    }

    if (body.price <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Precio inválido',
        message: 'El precio debe ser mayor a 0',
      }, { status: 400 });
    }

    // Crear producto
    const newProduct = await ProductModel.create({
      ...body,
      sku: body.sku.toUpperCase(), // Normalizar SKU a mayúsculas
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    console.log(` Producto creado: ${newProduct.name} (SKU: ${newProduct.sku})`);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Producto creado exitosamente',
    }, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error(' Error en POST /api/products:', error);

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
      error: 'Error al crear producto',
      message: error.message,
    }, { status: 500 });
  }
}