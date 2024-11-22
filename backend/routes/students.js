import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing students
 */

/**
 * @swagger
 * /students:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create a new student
 *     description: Add a new student to the database
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
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Successfully created a student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to create student
 */

// Эндпоинт для создания нового студента
router.post("/", async (req, res) => {
  const { name, email } = req.body;

  // Проверка входных данных
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const student = await prisma.student.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Get a student by ID
 *     description: Retrieve a specific student by their ID
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Student not found
 *       500:
 *         description: Failed to fetch student
 */

// Эндпоинт для получения студента по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Проверка валидности ID
  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: parsedId },
    });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

export default router;
