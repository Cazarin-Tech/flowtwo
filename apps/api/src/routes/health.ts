import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API FlowTwo saudável",
  });
});

export default router;