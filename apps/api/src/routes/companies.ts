import { Router } from "express";

export const companiesRoutes = Router();

const validPlans = ["Free", "Starter", "Pro", "Premium", "Sob Medida"];
const validStatus = ["Ativa", "Inativa", "Bloqueada", "Teste"];

const companies = [
  {
    id: 1,
    name: "FlowTech",
    businessType: "Tecnologia",
    plan: "Pro",
    status: "Ativa",
  },
];

function validateCompany(body: any) {
  if (!body.name) return "Nome é obrigatório";
  if (!body.businessType) return "Ramo é obrigatório";
  if (!validPlans.includes(body.plan)) return "Plano inválido";
  if (!validStatus.includes(body.status)) return "Status inválido";

  return null;
}

companiesRoutes.get("/companies", (req, res) => {
  res.json(companies);
});

companiesRoutes.post("/companies", (req, res) => {
  const error = validateCompany(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const company = {
    id: companies.length + 1,
    name: req.body.name,
    businessType: req.body.businessType,
    plan: req.body.plan,
    status: req.body.status,
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

  const error = validateCompany(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  companies[companyIndex] = {
    id,
    name: req.body.name,
    businessType: req.body.businessType,
    plan: req.body.plan,
    status: req.body.status,
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