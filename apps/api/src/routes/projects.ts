import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const projectsRoutes = Router();

const validStatus = ["Ativo", "Pausado", "Concluido"];

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function validateProject(body: any) {
  if (!body.name?.trim()) {
    return "O nome do projeto é obrigatório";
  }

  if (body.name.trim().length > 150) {
    return "O nome do projeto deve ter no máximo 150 caracteres";
  }

  if (body.status && !validStatus.includes(body.status)) {
    return "Status inválido";
  }

  return null;
}

// Dashboard de projetos e tarefas
projectsRoutes.get("/projects/dashboard", async (_req, res) => {
  try {
    const [
      totalProjects,
      activeProjects,
      pausedProjects,
      completedProjects,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    ] = await Promise.all([
      prisma.project.count(),

      prisma.project.count({
        where: {
          status: "Ativo",
        },
      }),

      prisma.project.count({
        where: {
          status: "Pausado",
        },
      }),

      prisma.project.count({
        where: {
          status: "Concluido",
        },
      }),

      prisma.task.count(),

      prisma.task.count({
        where: {
          status: "Pendente",
        },
      }),

      prisma.task.count({
        where: {
          status: "Em andamento",
        },
      }),

      prisma.task.count({
        where: {
          status: "Concluida",
        },
      }),
    ]);

    return res.json({
      totalProjects,
      projectsByStatus: {
        active: activeProjects,
        paused: pausedProjects,
        completed: completedProjects,
      },
      totalTasks,
      tasksByStatus: {
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao carregar dashboard de projetos e tarefas",
    });
  }
});

// aqui entra a documentação do Swagger

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lista projetos
 *     tags:
 *       - Projetos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso
 */

// Listar projetos com paginação
projectsRoutes.get("/projects", async (req, res) => {
  try {
    const pageValue =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limitValue =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 10;

    const page =
      Number.isInteger(pageValue) && pageValue > 0
        ? pageValue
        : 1;

    const limit =
      Number.isInteger(limitValue) &&
      limitValue > 0 &&
      limitValue <= 100
        ? limitValue
        : 10;

    const sort =
  req.query.sort === "asc" || req.query.sort === "desc"
    ? req.query.sort
    : "desc";

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: sort,
        },
        include: {
          tasks: true,
        },
      }),

      prisma.project.count(),
    ]);

    return res.json({
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar projetos",
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Busca um projeto pelo ID
 *     tags:
 *       - Projetos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *       404:
 *         description: Projeto não encontrado
 */

// Buscar projeto por ID
projectsRoutes.get("/projects/:id", async (req, res) => {
  const id = req.params.id;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      message: "ID do projeto inválido",
    });
  }
  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado",
      });
    }

    return res.json(project);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar projeto",
    });
  }
});

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Cria um novo projeto
 *     tags:
 *       - Projetos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sistema FlowTwo
 *               description:
 *                 type: string
 *                 example: Sistema de gerenciamento
 *               status:
 *                 type: string
 *                 enum: [Ativo, Pausado, Concluido]
 *                 example: Ativo
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar projeto
 */

// Criar projeto
projectsRoutes.post("/projects", async (req, res) => {
  const validationError = validateProject(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: req.body.name.trim(),
        description: req.body.description?.trim() || null,
        status: req.body.status || "Ativo",
      },
    });

    return res.status(201).json({
      message: "Projeto criado com sucesso!",
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao criar projeto",
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Atualiza um projeto
 *     tags:
 *       - Projetos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Projeto atualizado
 *               description:
 *                 type: string
 *                 example: Nova descrição
 *               status:
 *                 type: string
 *                 enum: [Ativo, Pausado, Concluido]
 *     responses:
 *       200:
 *         description: Projeto atualizado com sucesso
 *       400:
 *         description: Dados ou ID inválidos
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro ao atualizar projeto
 */

// Editar projeto
projectsRoutes.put("/projects/:id", async (req, res) => {
  const id = req.params.id;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      message: "ID do projeto inválido",
    });
  }

  const validationError = validateProject(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name: req.body.name.trim(),
        description: req.body.description?.trim() || null,
        status: req.body.status || "Ativo",
      },
    });

    return res.json({
      message: "Projeto atualizado com sucesso!",
      project,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        message: "Projeto não encontrado",
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar projeto",
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Exclui um projeto
 *     tags:
 *       - Projetos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Projeto excluído com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Projeto não encontrado
 *       500:
 *         description: Erro ao excluir projeto
 */

// Excluir projeto
projectsRoutes.delete("/projects/:id", async (req, res) => {
  const id = req.params.id;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      message: "ID do projeto inválido",
    });
  }

  try {
    await prisma.project.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Projeto excluído com sucesso!",
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        message: "Projeto não encontrado",
      });
    }

    return res.status(500).json({
      message: "Erro ao excluir projeto",
    });
  }
});

export default projectsRoutes;