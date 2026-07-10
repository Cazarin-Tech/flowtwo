import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health";
import projectsRoutes from "./routes/projects";
import tasksRoutes from "./routes/tasks";
import usersRoutes from "./routes/users";
import { companiesRoutes } from "./routes/companies";

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use(healthRoutes);
app.use(projectsRoutes);
app.use(tasksRoutes);
app.use(usersRoutes);
app.use(companiesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API FlowTwo rodando!" });
});


app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});