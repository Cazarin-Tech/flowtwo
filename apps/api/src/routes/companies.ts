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

companiesRoutes.put("/companies/:id", (req, res) => {
  const id = Number(req.params.id);

  const companyIndex = companies.findIndex((company) => company.id === id);

  if (companyIndex === -1) {
    return res.status(404).json({ message: "Empresa não encontrada" });
  }

  companies[companyIndex] = {
    ...companies[companyIndex],
    ...req.body,
  };

  res.json({
    message: "Empresa atualizada com sucesso!",
    company: companies[companyIndex],
  });
});

companiesRoutes.delete("/companies/:id", (req, res) => {
  const id = Number(req.params.id);

  const companyIndex = companies.findIndex((company) => company.id === id);

  if (companyIndex === -1) {
    return res.status(404).json({ message: "Empresa não encontrada" });
  }

  const deletedCompany = companies.splice(companyIndex, 1);

  res.json({
    message: "Empresa excluída com sucesso!",
    company: deletedCompany[0],
  });
});