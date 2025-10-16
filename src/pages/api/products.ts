import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  switch (req.method) {
    case "GET":
      try {
        const products = await Product.find();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
      }
      break;
      
    case "POST":
      try {
        const { name, brand, quantity, price, isActive, category, img, sku } = req.body;
        
        // Validación básica
        if (!name || !brand || !sku || !category) {
          return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        
        const product = new Product({
          name,
          brand,
          quantity,
          price,
          isActive,
          category,
          img,
          sku
        });
        
        await product.save();
        res.status(201).json(product);
      } catch (error: any) {
        if (error.code === 11000) {

          res.status(400).json({ message: "Error creating product", error: error.message });
        }
      }
      break;
      
    case "PUT":
      try {
        const { sku, ...updateData } = req.body;
        
        if (!sku) {
          return res.status(400).json({ message: "SKU es requerido" });
        }
        
        const updated = await Product.findOneAndUpdate(
          { sku }, 
          updateData, 
          { new: true, runValidators: true }
        );
        
        if (!updated) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.status(200).json(updated);
      } catch (error: any) {
        res.status(400).json({ message: "Error updating product", error: error.message });
      }
      break;
      
    case "DELETE":
      try {
        const { sku } = req.body;
        
        if (!sku) {
          return res.status(400).json({ message: "SKU es requerido" });
        }
        
        const deleted = await Product.findOneAndDelete({ sku });
        
        if (!deleted) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.status(200).json({ message: "Product deleted successfully" });
      } catch (error: any) {
        res.status(400).json({ message: "Error deleting product", error: error.message });
      }
      break;
      
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}