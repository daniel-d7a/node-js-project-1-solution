import z from "zod";

export const cartAddSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number().int().positive(),
});

export const cartUpdateSchema = z.object({
  quantity: z.number().int().positive(),
});
