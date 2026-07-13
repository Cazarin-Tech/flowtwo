import { Router } from "express";

const router = Router();

router.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Giovani", role: "Frontend" },
    { id: 2, name: "Matheus", role: "Backend" },
  ]);
});

export default router;