import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { productSchema } from "../schema/product.schema.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";

export const productsRouter = express.Router();
const db = createDB();

productsRouter.get("/", async (req, res) => {
  let products = await db.getAll("products");

  const search = req.query.search;
  if (search) {
    const term = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }

  res.json({ data: products });
});

productsRouter.get("/:id", async (req, res) => {
  const product = await db.getById("products", req.params.id);

  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }

  res.json({ data: product });
});

productsRouter.post(
  "/",
  checkAuth,
  checkRole("merchant"),
  validateBody(productSchema),
  async (req, res) => {
    const product = await db.create("products", {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image || "",
    });

    res.status(201).json({
      message: "product created successfully",
      data: product,
    });
  },
);

productsRouter.patch(
  "/:id",
  checkAuth,
  checkRole("merchant"),
  validateBody(productSchema.partial()),
  async (req, res) => {
    const product = await db.getById("products", req.params.id);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    await db.update("products", req.params.id, req.body);
    const updated = await db.getById("products", req.params.id);

    return res.status(200).json({
      message: "product updated successfully",
      data: updated,
    });
  },
);

productsRouter.delete("/:id", checkAuth, checkRole("merchant"), async (req, res) => {
  const product = await db.getById("products", req.params.id);

  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }

  await db.delete("products", req.params.id);
  return res.status(204).json();
});
