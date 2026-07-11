import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health";
import projectsRoutes from "./routes/projects";
import tasksRoutes from "./routes/tasks";
import { companiesRoutes } from "./routes/companies";
import { usersRoutes } from "./routes/users.routes";
import { authRoutes } from "./routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(healthRoutes);
app.use(projectsRoutes);
app.use(tasksRoutes);
app.use(companiesRoutes);
app.use(usersRoutes);
app.use(authRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "API FlowTwo rodando!",
  });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});