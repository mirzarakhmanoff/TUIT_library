import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import booksRouter from "./routes/books.js";
import authorRouter from "./routes/author.js";
import borrowsRouter from "./routes/borrows.js";
import categoriesRouter from "./routes/categories.js";
import studentsRouter from "./routes/students.js";

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/books", booksRouter);
app.use("/author", authorRouter);
app.use("/borrows", borrowsRouter);
app.use("/categories", categoriesRouter);
app.use("/students", studentsRouter);

// Swagger настройки
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "API for managing books, authors, students, and borrows",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
  },
  apis: ["./routes/*.js"], // Путь к файлу с документацией (в данном случае тот же файл)
};

const swaggerSpec = swaggerJsdoc(options);

// Подключение Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
