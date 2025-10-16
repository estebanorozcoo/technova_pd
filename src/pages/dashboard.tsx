import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productsServices";
import { Product } from "@/types";

export default function TestDashboard() {
  const router = useRouter();

  // Nuevo estado para el usuario logueado
  const [user, setUser] = useState<any>(null);

  // Estados existentes
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  // Filtros de búsqueda
  const [productFilters, setProductFilters] = useState({
    title: "",
    category: "",
    sku: "",
  });

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Cargar usuario y datos al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login"); // Si no hay usuario, redirige
      return;
    }

    setUser(JSON.parse(storedUser)); // Guarda el usuario en estado
    fetchData(); // Carga productos
  }, []);

  // Determinar si el usuario es admin
  const isAdmin = user?.role === "admin";

  // Carga de datos
  const fetchData = async () => {
    setLoading(true);

    //  Construir query string para productos
    const productQuery = new URLSearchParams(
      Object.fromEntries(
        Object.entries(productFilters).filter(([_, v]) => v !== "")
      )
    ).toString();

    //  Fetch con filtros si existen
    const productsData = await getProducts(productQuery);

    setProducts(productsData);
    setLoading(false);
  };

  // CRUD PRODUCTOS
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category)
      return alert("Complete all fields");
    await createProduct(newProduct as Product);
    setNewProduct({});
    fetchData();
  };

  const handleDeleteProduct = async (sku: string) => {
    await deleteProduct(sku);
    fetchData();
  };

  const handleUpdateProduct = async () => {
    if (!editProduct) return;
    await updateProduct(editProduct.sku, editProduct);
    setEditProduct(null);
    fetchData();
  };

  // Evita renderizar si aún no cargó el usuario
  if (!user) {
    return <p className="text-center mt-10">Verifying user...</p>;
  }

  if (loading) return <p className="text-center mt-10">Loading data...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-10 relative">
      {/*  Botón cerrar sesión */}
      <button
        onClick={() => {
          localStorage.removeItem("user");
          router.push("/");
        }}
        className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        TECHNOVA
      </h1>
      <p className="text-3xl font-bold mb-6 text-center text-indigo-600">
        ({isAdmin ? "Admin" : "User"})
      </p>

      {/*  FORM PRODUCTOS */}
      <section className="mb-10 bg-white p-5 rounded-xl shadow">
        {/*  FILTROS PRODUCTOS */}
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">
          Search Product
        </h2>
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by name"
            value={productFilters.title}
            onChange={(e) =>
              setProductFilters({ ...productFilters, title: e.target.value })
            }
            className="border p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Search by category"
            value={productFilters.category}
            onChange={(e) =>
              setProductFilters({ ...productFilters, category: e.target.value })
            }
            className="border p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Product ID"
            value={productFilters.sku}
            onChange={(e) =>
              setProductFilters({ ...productFilters, sku: e.target.value })
            }
            className="border p-2 rounded w-32"
          />
          <button
            onClick={fetchData}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Search
          </button>
        </div>

        {isAdmin && (
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-700">
              Add Product
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="border p-2 rounded w-40"
              />
              <input
                type="text"
                placeholder="Brand"
                value={newProduct.brand || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand: e.target.value })
                }
                className="border p-2 rounded w-40"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newProduct.quantity || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="border p-2 rounded w-40"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseInt(e.target.value),
                  })
                }
                className="border p-2 rounded w-40"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="border p-2 rounded w-40"
              />
              <input
                type="text"
                placeholder="url_Image"
                value={newProduct.img || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, img: e.target.value })
                }
                className="border p-2 rounded w-40"
              />
              <input
                type="text"
                placeholder="Product ID"
                value={newProduct.sku || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
                className="border p-2 rounded w-40"
              />
              <select
                value={newProduct.isActive === undefined ? "" : newProduct.isActive ? "true" : "false"}
                onChange={(e) =>
                    setNewProduct({ ...newProduct, isActive: e.target.value === "true" })
                }
                className="border p-2 rounded w-40"
                >
                <option value="" disabled>Active</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
                </select>

              {/*  Solo admin puede guardar */}

              <button
                onClick={handleCreateProduct}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Save product
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((b) => (
            <div
              key={b.sku}
              className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:scale-105 transition-transform"
            >
              <img
                src={b.img}
                alt={b.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="font-bold text-lg text-indigo-700">{b.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
               Brand: {b.brand} 
              </p>
              <p className="text-sm text-gray-500 mb-2">
               Price: {b.price}  
              </p>
              <p className="text-sm text-gray-500 mb-2">
               Quantity: {b.quantity}  
              </p>
              <p className="text-sm text-gray-500 mb-2">
               Category: {b.category}  
              </p>
              <p className="text-sm text-gray-500 mb-2">
               Id: {b.sku}  
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Active: {b.isActive ? "Yes" : "No"}  
                </p>

              {/*  Solo admin puede editar/eliminar */}
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditProduct(b)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(b.sku)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/*  Modal Producto */}

      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            
            <input
                type="text"
                placeholder="Name"
                value={editProduct.name || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="text"
                placeholder="Brand"
                value={editProduct.brand || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, brand: e.target.value })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={editProduct.quantity || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={editProduct.price || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    price: parseInt(e.target.value),
                  })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={editProduct.category || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="text"
                placeholder="url_Image"
                value={editProduct.img || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, img: e.target.value })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <input
                type="text"
                placeholder="Product ID"
                value={editProduct.sku || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, sku: e.target.value })
                }
                className="border p-2 w-full mb-4 rounded"
              />
              <select
                value={newProduct.isActive === undefined ? "" : newProduct.isActive ? "true" : "false"}
                onChange={(e) =>
                    setNewProduct({ ...newProduct, isActive: e.target.value === "true" })
                }
                className="border p-2 w-full mb-4 rounded"
                >
                <option value="" disabled>Activo</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
                </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditProduct(null)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-indigo-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}