import { Router } from "express";

const router = Router();

router.get("/tasks", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Criar landing page",
      status: "concluído",
      projectId: 1,
    },
    {
      id: 2,
      title: "Conectar frontend com backend",
      status: "em andamento",
      projectId: 1,
    },
  ]);
});

export default router;