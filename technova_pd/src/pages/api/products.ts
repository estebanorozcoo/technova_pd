// /pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const { brand, category } = req.query;
      const filter: any = {};
      if (brand) filter.brand = brand;
      if (category) filter.category = category;
      const products = await Product.find(filter).lean();
      return res.status(200).json({ ok: true, data: products });
    }

    if (req.method === "POST") {
      const { sku, name, brand, quantity, price, isActive, category, imageUrl } = req.body;
      // Validaciones básicas:
      if (!sku || !name || !brand || !category || price === undefined) {
        return res.status(400).json({ ok: false, message: "Campos requeridos faltantes" });
      }
      const exists = await Product.findOne({ sku });
      if (exists) {
        return res.status(409).json({ ok: false, message: "SKU ya existe" });
      }
      const newProduct = await Product.create({
        sku, name, brand, quantity: quantity ?? 0, price, isActive: isActive ?? true, category, imageUrl, createdAt: Date.now()
      });
      return res.status(201).json({ ok: true, data: newProduct });
    }

    if (req.method === "PUT") {
      const { _id, sku, ...rest } = req.body;
      if (!_id) return res.status(400).json({ ok: false, message: "_id is required" });

      // If changing sku, ensure uniqueness:
      if (sku) {
        const other = await Product.findOne({ sku, _id: { $ne: _id } });
        if (other) return res.status(409).json({ ok: false, message: "SKU ya existe" });
      }

      const updated = await Product.findByIdAndUpdate(_id, { sku, ...rest }, { new: true });
      return res.status(200).json({ ok: true, data: updated });
    }

    if (req.method === "DELETE") {
      const { _id } = req.body;
      if (!_id) return res.status(400).json({ ok: false, message: "_id is required" });
      await Product.findByIdAndDelete(_id);
      return res.status(200).json({ ok: true, message: "Producto eliminado" });
    }

    return res.setHeader("Allow", "GET,POST,PUT,DELETE").status(405).end();
  } catch (error: any) {
    console.error("API /api/products error:", error);
    return res.status(500).json({ ok: false, message: error.message || "Server error" });
  }
}
