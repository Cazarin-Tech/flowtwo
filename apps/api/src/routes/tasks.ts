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

// Listar todas as tarefas
tasksRoutes.get("/tasks", async (_req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    });

    return res.json(tasks);
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