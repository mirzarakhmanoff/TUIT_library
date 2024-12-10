import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import booksRouter from "./routes/books.js";
import authorRouter from "./routes/author.js";
import borrowsRouter from "./routes/borrows.js";
import categoriesRouter from "./routes/categories.js";
import studentsRouter from "./routes/students.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/books", booksRouter);
app.use("/author", authorRouter);
app.use("/borrows", borrowsRouter);
app.use("/categories", categoriesRouter);
app.use("/students", studentsRouter);
app.use("/auth", authRouter);

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
  apis: [
    "./routes/auth.js",
    "./routes/books.js",
    "./routes/author.js",
    "./routes/borrows.js",
    "./routes/categories.js",
    "./routes/students.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
