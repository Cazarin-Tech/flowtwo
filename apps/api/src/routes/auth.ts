import { Router } from "express";

export const authRoutes = Router();

authRoutes.post("/login", (_req, res) => {
  return res.json({
    message: "Rota de login funcionando!",
  });
});