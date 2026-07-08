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
})

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});