import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * /books:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get all books
 *     description: Retrieve a list of all books
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   authorId:
 *                     type: integer
 *                   publishedAt:
 *                     type: string
 *                     format: date
 */

// Эндпоинт для получения всех книг
router.get("/", async (req, res) => {
  const { search } = req.query; // Получаем параметр поиска

  try {
    const books = await prisma.book.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } }, // Поиск по названию книги
              { author: { name: { contains: search, mode: "insensitive" } } }, // Поиск по имени автора
            ],
          }
        : {}, // Если параметра нет, возвращаем все книги
      include: {
        author: true, // Включить данные автора
      },
    });

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get a book by ID
 *     description: Retrieve a specific book by its ID
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *                 publishedAt:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Book not found
 */

// Эндпоинт для получения книги по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: {
        author: true,
      },
    });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     tags:
 *       - Books
 *     summary: Create a new book
 *     description: Add a new book to the database
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *                 publishedAt:
 *                   type: string
 *                   format: date
 */

// Эндпоинт для создания новой книги
router.post("/", async (req, res) => {
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

export default router;
