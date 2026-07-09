import { Router } from "express";

export const companiesRoutes = Router();

const companies = [
  {
    id: 1,
    name: "FlowTech",
    businessType: "Tecnologia",
    plan: "Pro",
    status: "Ativa",
  },
];

companiesRoutes.get("/companies", (req, res) => {
  res.json(companies);
});

companiesRoutes.post("/companies", (req, res) => {
  const company = {
    id: companies.length + 1,
    ...req.body,
  };

  companies.push(company);

  res.status(201).json({
    message: "Empresa cadastrada com sucesso!",
    company,
  });
});