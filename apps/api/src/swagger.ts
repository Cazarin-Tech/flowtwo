import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FlowTwo API",
      version: "1.0.0",
      description: "API para gerenciamento de projetos e tarefas",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
});