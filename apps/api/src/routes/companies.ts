import { Router } from "express";
import { prisma } from "../lib/prisma";

export const companiesRoutes = Router();

const validPlans = ["Free", "Starter", "Pro", "Premium", "Sob Medida"];
const validStatus = ["Ativa", "Inativa", "Bloqueada", "Teste"];

function validateCompany(body: any) {
  if (!body.name) return "Nome é obrigatório";
  if (!body.businessType) return "Ramo é obrigatório";
  if (!validPlans.includes(body.plan)) return "Plano inválido";
  if (!validStatus.includes(body.status)) return "Status inválido";

  return null;
}

// Listar todas
companiesRoutes.get("/companies", async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(companies);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar empresas",
    });
  }
});

// Buscar uma pelo ID
companiesRoutes.get("/companies/:id", async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "Empresa não encontrada",
      });
    }

    return res.json(company);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar empresa",
    });
  }
});

// Cadastrar
companiesRoutes.post("/companies", async (req, res) => {
  const error = validateCompany(req.body);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }

  try {
    const company = await prisma.company.create({
      data: {
        name: req.body.name,
        businessType: req.body.businessType,
        plan: req.body.plan,
        status: req.body.status,
      },
    });

    return res.status(201).json({
      message: "Empresa cadastrada com sucesso!",
      company,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar empresa",
    });
  }
});

// Editar
companiesRoutes.put("/companies/:id", async (req, res) => {
  const error = validateCompany(req.body);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }

  try {
    const company = await prisma.company.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        businessType: req.body.businessType,
        plan: req.body.plan,
        status: req.body.status,
      },
    });

    return res.json({
      message: "Empresa atualizada com sucesso!",
      company,
    });
  } catch {
    return res.status(404).json({
      message: "Empresa não encontrada",
    });
  }
});

// Desativar
companiesRoutes.patch("/companies/:id/deactivate", async (req, res) => {
  try {
    const company = await prisma.company.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "Inativa",
      },
    });

    return res.json({
      message: "Empresa desativada com sucesso!",
      company,
    });
  } catch {
    return res.status(404).json({
      message: "Empresa não encontrada",
    });
  }
});

// Reativar
companiesRoutes.patch("/companies/:id/activate", async (req, res) => {
  try {
    const company = await prisma.company.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "Ativa",
      },
    });

    return res.json({
      message: "Empresa reativada com sucesso!",
      company,
    });
  } catch {
    return res.status(404).json({
      message: "Empresa não encontrada",
    });
  }
});

// Dashboard
companiesRoutes.get("/dashboard", async (req, res) => {
  try {
    const totalCompanies = await prisma.company.count();

    const activeCompanies = await prisma.company.count({
      where: {
        status: "Ativa",
      },
    });

    const inactiveCompanies = await prisma.company.count({
      where: {
        status: "Inativa",
      },
    });

    const plans = await prisma.company.groupBy({
      by: ["plan"],
      _count: {
        plan: true,
      },
    });

    return res.json({
      totalCompanies,
      activeCompanies,
      inactiveCompanies,
      plans,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao carregar dashboard",
    });
  }
});