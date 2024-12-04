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
        borrows: true,
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
 *               author:
 *                 type: object   // объект автора
 *                 properties:
 *                   name:
 *                     type: string
 *                   bio:
 *                     type: string
 *               image:
 *                 type: string   // ссылка на изображение
 *               publishedAt:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string   // описание книги
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
 *                 author:
 *                   type: object   // автор теперь объект
 *                   properties:
 *                     name:
 *                       type: string
 *                     bio:
 *                       type: string
 *                 image:
 *                   type: string   // добавлено поле image
 *                 publishedAt:
 *                   type: string
 *                   format: date
 *                 description:
 *                   type: string   // добавлено описание книги
 */

// Эндпоинт для создания новой книги
router.post("/", async (req, res) => {
  const { title, author, categoryId, image, publishedAt, description } =
    req.body;

  try {
    // Ищем автора в базе данных
    let authorRecord = await prisma.author.findFirst({
      where: {
        name: author.name, // Ищем по имени автора
      },
    });

    // Если автор не найден, создаём нового автора
    if (!authorRecord) {
      authorRecord = await prisma.author.create({
        data: {
          name: author.name,
          bio: author.bio,
        },
      });
    }

    // Ищем категорию книги, если она передана
    let categoryRecord = null;
    if (categoryId) {
      categoryRecord = await prisma.category.findUnique({
        where: { id: categoryId },
      });
    }

    // Создаём книгу и связываем её с найденными или созданными автором и категорией
    const book = await prisma.book.create({
      data: {
        title,
        author: {
          connect: { id: authorRecord.id }, // Связываем с автором по ID
        },
        category: categoryRecord
          ? { connect: { id: categoryRecord.id } }
          : undefined, // Если категория найдена, связываем её с книгой
        image, // Убедитесь, что передаёте правильный URL изображения
        publishedAt: new Date(publishedAt), // Преобразуем строку в Date
        description, // Описание книги
      },
    });

    // Отправляем успешный ответ
    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res
      .status(500)
      .json({ error: "Failed to create book", details: error.message });
  }
});

/**
 * @swagger
 * /books/{id}/toggle-like:
 *   post:
 *     tags:
 *       - Books
 *     summary: Toggle like status of a book
 *     description: Add or remove a book from the wishlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully toggled like status
 *       404:
 *         description: Book not found
 */

router.post("/:id/toggle-like", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({ where: { id: Number(id) } });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Переключаем статус лайка
    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: { liked: !book.liked },
    });

    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to toggle like status" });
  }
});

export default router;
