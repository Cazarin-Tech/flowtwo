import { Router } from "express";
import { prisma } from "../lib/prisma";

const projectsRoutes = Router();

const validStatus = ["Ativo", "Pausado", "Concluido"];

function validateProject(body: any) {
  if (!body.name?.trim()) {
    return "O nome do projeto é obrigatório";
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

// Listar todos os projetos
projectsRoutes.get("/projects", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tasks: true,
      },
    });

    return res.json(projects);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar projetos",
    });
  }
});

// Buscar projeto por ID
projectsRoutes.get("/projects/:id", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: req.params.id,
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

// Editar projeto
projectsRoutes.put("/projects/:id", async (req, res) => {
  const validationError = validateProject(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const project = await prisma.project.update({
      where: {
        id: req.params.id,
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

    return res.status(404).json({
      message: "Projeto não encontrado",
    });
  }
});

// Excluir projeto
projectsRoutes.delete("/projects/:id", async (req, res) => {
  try {
    await prisma.project.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.json({
      message: "Projeto excluído com sucesso!",
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Projeto não encontrado",
    });
  }
});

export default projectsRoutes;