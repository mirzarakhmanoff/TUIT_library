import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3002" }));
app.use(express.json());

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
  apis: ["./index.js"], // Путь к файлу с документацией (в данном случае тот же файл)
};

const swaggerSpec = swaggerJsdoc(options);

// Подключение Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Эндпоинт для получения всех авторов
/**
 * @swagger
 * /authors:
 *   get:
 *     description: Get all authors
 *     responses:
 *       200:
 *         description: A list of authors
 */
app.get("/authors", async (req, res) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});

// Эндпоинт для получения всех книг
/**
 * @swagger
 * /books:
 *   get:
 *     description: Get all books
 *     responses:
 *       200:
 *         description: A list of books
 */
app.get("/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Эндпоинт для получения всех записей о заимствованиях
/**
 * @swagger
 * /borrows:
 *   get:
 *     description: Get all borrow records
 *     responses:
 *       200:
 *         description: A list of borrow records
 */
app.get("/borrows", async (req, res) => {
  try {
    const borrows = await prisma.borrow.findMany();
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch borrow records" });
  }
});

// Эндпоинт для получения студента по ID
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     description: Get a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The student's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single student record
 *       404:
 *         description: Student not found
 */
app.get("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
    });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

// Эндпоинт для получения книги по ID
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     description: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single book record
 *       404:
 *         description: Book not found
 */
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
    });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// Эндпоинт для получения записи о заимствовании по ID
/**
 * @swagger
 * /borrows/{id}:
 *   get:
 *     description: Get a borrow record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The borrow record's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single borrow record
 *       404:
 *         description: Borrow record not found
 */
app.get("/borrows/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const borrow = await prisma.borrow.findUnique({
      where: { id: Number(id) },
    });
    if (borrow) {
      res.json(borrow);
    } else {
      res.status(404).json({ error: "Borrow record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch borrow record" });
  }
});

// Эндпоинт для создания нового заимствования
/**
 * @swagger
 * /borrows:
 *   post:
 *     description: Create a new borrow record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *               borrowedAt:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Successfully created a borrow record
 */
app.post("/borrows", async (req, res) => {
  const { studentId, bookId, borrowedAt } = req.body;
  try {
    const borrow = await prisma.borrow.create({
      data: {
        studentId,
        bookId,
        borrowedAt,
        returnedAt: null, // Возврат книги пока не произошел
      },
    });
    res.status(201).json(borrow);
  } catch (error) {
    res.status(500).json({ error: "Failed to create borrow record" });
  }
});

// Эндпоинт для создания нового студента
/**
 * @swagger
 * /students:
 *   post:
 *     description: Create a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created a student
 */
app.post("/students", async (req, res) => {
  const { name, email } = req.body;
  try {
    const student = await prisma.student.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to create student" });
  }
});

// Эндпоинт для создания новой книги
/**
 * @swagger
 * /books:
 *   post:
 *     description: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               publishedAt:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Successfully created a book
 */
app.post("/books", async (req, res) => {
  const { title, authorId, publishedAt } = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        title,
        authorId,
        publishedAt,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
});

// Получить все категории
app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Добавить новую категорию
app.post("/categories", async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Получить категорию по ID
app.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// Обновить категорию по ID
app.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Удалить категорию по ID
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
});
