import { Router } from "express";
import { prisma } from "../lib/prisma";

const tasksRoutes = Router();

const validStatus = ["Pendente", "Em andamento", "Concluida"];

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function validateTask(body: any) {
  if (!body.title?.trim()) {
    return "O título da tarefa é obrigatório";
  }
  if (body.title.trim().length > 150) {
  return "O título deve ter no máximo 150 caracteres";
  }

  if (!body.projectId?.trim()) {
    return "O ID do projeto é obrigatório";
  }

  if (!isValidUuid(body.projectId)) {
    return "O ID do projeto é inválido";
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

    const sort =
  req.query.sort === "asc" || req.query.sort === "desc"
    ? req.query.sort
    : "desc";

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
          createdAt: sort,
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
  const id = req.params.id;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      message: "ID da tarefa inválido",
    });
  }

  try {
    const task = await prisma.task.findUnique({
      where: {
        id,
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
  const id = req.params.id;

if (!isValidUuid(id)) {
  return res.status(400).json({
    message: "ID da tarefa inválido",
  });
}
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
        id: id,
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
  const id = req.params.id;

  if (!isValidUuid(id)) {
    return res.status(400).json({
      message: "ID da tarefa inválido",
    });
  }

  try {
    await prisma.task.delete({
      where: {
        id,
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