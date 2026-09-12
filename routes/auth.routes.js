// ============================================================
// DO NOT MODIFY THIS FILE
// This file handles authentication (register, login, logout).
// ============================================================

import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginSchema } from "../schema/auth/login.schema.js";
import { registerSchema } from "../schema/auth/register.schema.js";

import { existsSync } from "node:fs";

if (existsSync(".env")) {
  process.loadEnvFile();
}
export const authRouter = express.Router();
const db = createDB();

authRouter.post("/register", validateBody(registerSchema), async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);

  const authUsers = await db.getAll("auth_users");
  const existingUser = authUsers.find((u) => u.email === req.body.email);

  if (existingUser) {
    return res.status(422).json({
      error: "email already in use",
    });
  }

  await db.create("auth_users", {
    email: req.body.email,
    username: req.body.username,
    passwordHash: passwordHash,
    role: req.body.role,
  });

  res.status(201).json({
    message: "register successful, you can now login",
  });
});

authRouter.post("/login", validateBody(loginSchema), async (req, res) => {
  const auth_users = await db.getAll("auth_users");
  const existingUser = auth_users.find((u) => u.email === req.body.email);

  if (!existingUser) {
    return res.status(422).json({
      error: "email or password are invalid",
    });
  }

  const isValid = await bcrypt.compare(
    req.body.password,
    existingUser.passwordHash,
  );

  if (!isValid) {
    return res.status(422).json({
      error: "email or password are invalid",
    });
  }

  const tokenPayload = {
    id: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
    role: existingUser.role,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

  res.cookie("node_api_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "login successful",
    data: {
      user: tokenPayload,
    },
  });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("node_api_token");
  return res.status(200).json({
    message: "logout successful",
  });
});
