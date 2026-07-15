import { Router } from "express";
import { prisma } from "../lib/prisma";

const tasksRoutes = Router();

const validStatus = ["Pendente", "Em andamento", "Concluida"];

function validateTask(body: any) {
  if (!body.title?.trim()) {
    return "O título da tarefa é obrigatório";
  }

  if (!body.projectId?.trim()) {
    return "O ID do projeto é obrigatório";
  }

  if (body.status && !validStatus.includes(body.status)) {
    return "Status inválido";
  }

  return null;
}

// Listar tarefas com filtros, busca e paginação
tasksRoutes.get("/tasks", async (req, res) => {
  try {
    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    const projectId =
      typeof req.query.projectId === "string"
        ? req.query.projectId
        : undefined;

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

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

    const skip = (page - 1) * limit;

    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        message: "Status inválido",
      });
    }

    const where = {
      ...(status ? { status } : {}),
      ...(projectId ? { projectId } : {}),
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          project: true,
        },
      }),

      prisma.task.count({
        where,
      }),
    ]);

    return res.json({
      data: tasks,
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
      message: "Erro ao buscar tarefas",
    });
  }
});

// Buscar tarefa pelo ID
tasksRoutes.get("/tasks/:id", async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        project: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Tarefa não encontrada",
      });
    }

    return res.json(task);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar tarefa",
    });
  }
});

// Criar tarefa
tasksRoutes.post("/tasks", async (req, res) => {
  const validationError = validateTask(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: req.body.projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado",
      });
    }

    const task = await prisma.task.create({
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim() || null,
        status: req.body.status || "Pendente",
        projectId: req.body.projectId,
      },
    });

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao criar tarefa",
    });
  }
});

// Editar tarefa
tasksRoutes.put("/tasks/:id", async (req, res) => {
  const validationError = validateTask(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: req.body.projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado",
      });
    }

    const task = await prisma.task.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim() || null,
        status: req.body.status || "Pendente",
        projectId: req.body.projectId,
      },
    });

    return res.json({
      message: "Tarefa atualizada com sucesso!",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Tarefa não encontrada",
    });
  }
});

// Excluir tarefa
tasksRoutes.delete("/tasks/:id", async (req, res) => {
  try {
    await prisma.task.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.json({
      message: "Tarefa excluída com sucesso!",
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Tarefa não encontrada",
    });
  }
});

export default tasksRoutes;