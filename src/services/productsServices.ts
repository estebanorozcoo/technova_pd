import axios from "axios";
import { Product } from "@/types";

const API_URL = "/api/products";

export const getProducts = async (query: string = ""): Promise<Product[]> => {
  try {
    const url = query ? `${API_URL}?${query}` : API_URL;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};


export const createProduct = async (product: Product): Promise<Product> => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (sku: string, data: Partial<Product>): Promise<Product> => {
  const response = await axios.put(API_URL, { sku, ...data });
  return response.data;
};

export const deleteProduct = async (sku: string): Promise<void> => {
  await axios.delete(API_URL, { data: { sku } });
};