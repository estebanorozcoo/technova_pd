import api from './api';
import { Product, ProductFormData, ProductFilters } from '@/types/product.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';

class ProductService {
  private endpoint = '/products';

  /**
   * Obtener todos los productos con filtros opcionales
   */
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      // Construir query params
      const params = new URLSearchParams();
      
      if (filters?.category) {
        params.append('category', filters.category);
      }
      
      if (filters?.brand) {
        params.append('brand', filters.brand);
      }
      
      if (filters?.isActive !== undefined) {
        params.append('isActive', String(filters.isActive));
      }

      const queryString = params.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;

      const response = await api.get<ApiResponse<Product[]>>(url);
      
      return response.data.data || [];
    } catch (error: any) {
      console.error(' Error obteniendo productos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener productos');
    }
  }

  /**
   * Obtener un producto por ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(`${this.endpoint}/${id}`);
      
      if (!response.data.data) {
        throw new Error('Producto no encontrado');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error(` Error obteniendo producto ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener producto');
    }
  }

  /**
   * Crear nuevo producto
   */
  async createProduct(productData: ProductFormData): Promise<Product> {
    try {
      // Validaciones del lado del cliente
      this.validateProductData(productData);

      const response = await api.post<ApiResponse<Product>>(
        this.endpoint,
        {
          ...productData,
          isActive: true, // Por defecto activo
        }
      );

      if (!response.data.data) {
        throw new Error('Error al crear producto');
      }

      console.log(' Producto creado:', response.data.data.name);
      return response.data.data;
    } catch (error: any) {
      console.error(' Error creando producto:', error);
      
      // Extraer mensaje de error específico
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Error al crear producto';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualizar producto existente
   */
  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<Product> {
    try {
      // Validar datos si están presentes
      if (productData.quantity !== undefined && productData.quantity < 0) {
        throw new Error('La cantidad no puede ser negativa');
      }

      if (productData.price !== undefined && productData.price <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      const response = await api.put<ApiResponse<Product>>(
        `${this.endpoint}/${id}`,
        productData
      );

      if (!response.data.data) {
        throw new Error('Error al actualizar producto');
      }

      console.log(' Producto actualizado:', response.data.data.name);
      return response.data.data;
    } catch (error: any) {
      console.error(` Error actualizando producto ${id}:`, error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          'Error al actualizar producto';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualización parcial de producto (PATCH)
   */
  async patchProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const response = await api.patch<ApiResponse<Product>>(
        `${this.endpoint}/${id}`,
        updates
      );

      if (!response.data.data) {
        throw new Error('Error al actualizar producto');
      }

      console.log(' Producto actualizado parcialmente:', response.data.data.name);
      return response.data.data;
    } catch (error: any) {
      console.error(` Error en actualización parcial de producto ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar producto');
    }
  }

  /**
   * Eliminar producto
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
      console.log(` Producto ${id} eliminado`);
    } catch (error: any) {
      console.error(` Error eliminando producto ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar producto');
    }
  }

  /**
   * Activar/Desactivar producto
   */
  async toggleProductStatus(id: string, isActive: boolean): Promise<Product> {
    try {
      return await this.patchProduct(id, { isActive: !isActive });
    } catch (error: any) {
      console.error(` Error cambiando estado del producto ${id}:`, error);
      throw new Error(error.message || 'Error al cambiar estado del producto');
    }
  }

  /**
   * Validar datos del producto (cliente)
   */
  private validateProductData(data: ProductFormData): void {
    if (!data.sku || data.sku.trim() === '') {
      throw new Error('El SKU es obligatorio');
    }

    if (!data.name || data.name.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }

    if (!data.brand || data.brand.trim() === '') {
      throw new Error('La marca es obligatoria');
    }

    if (data.quantity < 0) {
      throw new Error('La cantidad no puede ser negativa');
    }

    if (data.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (!data.category) {
      throw new Error('La categoría es obligatoria');
    }

    if (!data.imageUrl || data.imageUrl.trim() === '') {
      throw new Error('La URL de imagen es obligatoria');
    }

    // Validar formato de URL (básico)
    try {
      new URL(data.imageUrl);
    } catch {
      throw new Error('La URL de imagen no es válida');
    }
  }
}

// Exportar instancia singleton
export const productService = new ProductService();