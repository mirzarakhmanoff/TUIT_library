import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3002" }));
app.use(express.json());

// Эндпоинт для получения всех авторов
app.get("/authors", async (req, res) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});

// Эндпоинт для получения всех книг
app.get("/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Эндпоинт для получения всех записей о заимствованиях
app.get("/borrows", async (req, res) => {
  try {
    const borrows = await prisma.borrow.findMany();
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch borrow records" });
  }
});

// Эндпоинт для получения студента по ID
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

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
