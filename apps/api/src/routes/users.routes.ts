import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export const usersRoutes = Router();

const validRoles = [
  "Administrador",
  "Gerente",
  "Supervisor",
  "Funcionario",
  "Visualizador",
];

const validStatus = ["Ativo", "Inativo"];

function validateUser(body: any, requirePassword = true) {
  if (!body.name?.trim()) {
    return "Nome é obrigatório";
  }

  if (!body.email?.trim() || !body.email.includes("@")) {
    return "E-mail inválido";
  }

  if (requirePassword && (!body.password || body.password.length < 6)) {
    return "A senha deve ter pelo menos 6 caracteres";
  }

  if (!validRoles.includes(body.role)) {
    return "Cargo inválido";
  }

  if (!validStatus.includes(body.status)) {
    return "Status inválido";
  }

  return null;
}

// Listar usuários
usersRoutes.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao buscar usuários",
    });
  }
});

// Buscar usuário por ID
usersRoutes.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar usuário",
    });
  }
});

// Cadastrar usuário
usersRoutes.post("/users", async (req, res) => {
  const validationError = validateUser(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const email = req.body.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Já existe um usuário com este e-mail",
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: req.body.name.trim(),
        email,
        password: passwordHash,
        role: req.body.role,
        status: req.body.status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar usuário",
    });
  }
});

// Editar usuário
usersRoutes.put("/users/:id", async (req, res) => {
  const validationError = validateUser(req.body, false);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const email = req.body.email.trim().toLowerCase();

    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: req.params.id,
        },
      },
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "Este e-mail já está sendo usado",
      });
    }

    const data: {
      name: string;
      email: string;
      role: string;
      status: string;
      password?: string;
    } = {
      name: req.body.name.trim(),
      email,
      role: req.body.role,
      status: req.body.status,
    };

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          message: "A senha deve ter pelo menos 6 caracteres",
        });
      }

      data.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return res.json({
      message: "Usuário atualizado com sucesso!",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Usuário não encontrado",
    });
  }
});

// Desativar usuário
usersRoutes.patch("/users/:id/deactivate", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "Inativo",
      },
    });

    return res.json({
      message: "Usuário desativado com sucesso!",
      user,
    });
  } catch {
    return res.status(404).json({
      message: "Usuário não encontrado",
    });
  }
});

// Reativar usuário
usersRoutes.patch("/users/:id/activate", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "Ativo",
      },
    });

    return res.json({
      message: "Usuário reativado com sucesso!",
      user,
    });
  } catch {
    return res.status(404).json({
      message: "Usuário não encontrado",
    });
  }
});