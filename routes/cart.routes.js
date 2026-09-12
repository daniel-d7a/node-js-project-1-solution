import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { cartAddSchema, cartUpdateSchema } from "../schema/cart.schema.js";

export const cartRouter = express.Router();
const db = createDB();

cartRouter.get("/", async (req, res) => {
  const cart = await db.getOne("carts", { userId: req.user.id });

  if (!cart) {
    return res.json({ data: { id: null, userId: req.user.id, products: [] } });
  }

  res.json({ data: cart });
});

cartRouter.post("/", validateBody(cartAddSchema), async (req, res) => {
  let cart = await db.getOne("carts", { userId: req.user.id });

  if (!cart) {
    cart = await db.create("carts", {
      userId: req.user.id,
      products: [{ ...req.body, quantity: req.body.quantity }],
    });
    return res.status(201).json({ message: "product added to cart", data: cart });
  }

  const existingIndex = cart.products.findIndex(
    (p) => String(p.id) === String(req.body.id),
  );

  if (existingIndex >= 0) {
    cart.products[existingIndex].quantity += req.body.quantity;
  } else {
    cart.products.push({ ...req.body, quantity: req.body.quantity });
  }

  await db.update("carts", cart.id, { products: cart.products });

  return res.status(201).json({ message: "product added to cart", data: cart });
});

cartRouter.patch("/:productId", validateBody(cartUpdateSchema), async (req, res) => {
  const cart = await db.getOne("carts", { userId: req.user.id });

  if (!cart) {
    return res.status(404).json({ error: "cart not found" });
  }

  const productIndex = cart.products.findIndex(
    (p) => String(p.id) === String(req.params.productId),
  );

  if (productIndex < 0) {
    return res.status(404).json({ error: "product not found in cart" });
  }

  cart.products[productIndex].quantity = req.body.quantity;
  await db.update("carts", cart.id, { products: cart.products });

  return res.status(200).json({ message: "cart updated", data: cart });
});

cartRouter.delete("/:productId", async (req, res) => {
  const cart = await db.getOne("carts", { userId: req.user.id });

  if (!cart) {
    return res.status(404).json({ error: "cart not found" });
  }

  const productIndex = cart.products.findIndex(
    (p) => String(p.id) === String(req.params.productId),
  );

  if (productIndex < 0) {
    return res.status(404).json({ error: "product not found in cart" });
  }

  cart.products.splice(productIndex, 1);
  await db.update("carts", cart.id, { products: cart.products });

  return res.status(200).json({ message: "product removed from cart" });
});
