import express from "express";
import { createDB } from "../db.js";

export const ordersRouter = express.Router();
const db = createDB();

ordersRouter.get("/", async (req, res) => {
  const allOrders = await db.getAll("orders");
  const userOrders = allOrders.filter((o) => String(o.userId) === String(req.user.id));

  res.json({ data: userOrders });
});

ordersRouter.post("/checkout", async (req, res) => {
  const cart = await db.getOne("carts", { userId: req.user.id });

  if (!cart || cart.products.length === 0) {
    return res.status(422).json({ error: "cart is empty" });
  }

  let total = 0;
  for (const product of cart.products) {
    total += product.price * product.quantity;
  }

  const order = await db.create("orders", {
    userId: req.user.id,
    products: cart.products.map((p) => ({ ...p })),
    total: total,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  await db.delete("carts", cart.id);

  return res.status(201).json({
    message: "order placed successfully",
    data: order,
  });
});
