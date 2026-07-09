import { Router } from "express";

const router = Router();

router.get("/projects", (req, res) => {
  const projects = [
    {
      id: 1,
      name: "FlowTwo",
      status: "Em desenvolvimento",
    },
    {
      id: 2,
      name: "Dashboard FlowTwo",
      status: "Planejado",
    },
  ];

  res.json(projects);
});

export default router;