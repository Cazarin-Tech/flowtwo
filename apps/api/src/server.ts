import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API FlowTwo rodando!" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API FlowTwo saudável",
  })
});

app.get("/projects", (req, res) => {
  const projects = [
    {
      id: 1,
      name:"FlowTwo",
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
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});