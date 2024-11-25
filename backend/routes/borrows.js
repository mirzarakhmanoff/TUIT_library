import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Borrows
 *   description: API for managing borrow records
 */

/**
 * @swagger
 * /borrows:
 *   get:
 *     tags:
 *       - Borrows
 *     description: Get all borrow records
 *     responses:
 *       200:
 *         description: A list of borrow records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   studentId:
 *                     type: integer
 *                   bookId:
 *                     type: integer
 *                   borrowedAt:
 *                     type: string
 *                     format: date
 *                   returnedAt:
 *                     type: string
 *                     format: date
 */
router.get("/", async (req, res) => {
  try {
    const borrows = await prisma.borrow.findMany();
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch borrow records" });
  }
});

/**
 * @swagger
 * /borrows/{id}:
 *   get:
 *     tags:
 *       - Borrows
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 studentId:
 *                   type: integer
 *                 bookId:
 *                   type: integer
 *                 borrowedAt:
 *                   type: string
 *                   format: date
 *                 returnedAt:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Borrow record not found
 */
router.get("/:id", async (req, res) => {
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

/**
 * @swagger
 * /borrows:
 *   post:
 *     tags:
 *       - Borrows
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
 *             required:
 *               - studentId
 *               - bookId
 *               - borrowedAt
 *     responses:
 *       201:
 *         description: Successfully created a borrow record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 studentId:
 *                   type: integer
 *                 bookId:
 *                   type: integer
 *                 borrowedAt:
 *                   type: string
 *                   format: date
 *                 returnedAt:
 *                   type: string
 *                   format: date
 */
router.post("/", async (req, res) => {
  const { studentId, bookId, borrowedAt } = req.body;

  try {
    const borrowedDate = new Date(borrowedAt);
    const today = new Date();
    const daysBorrowed = Math.ceil(
      (today - borrowedDate) / (1000 * 60 * 60 * 24)
    );

    // Создаем запись о заимствовании с добавленным полем durationDays
    const borrow = await prisma.borrow.create({
      data: {
        studentId,
        bookId,
        borrowedAt,
        returnedAt: null,
        durationDays: daysBorrowed, // Добавляем вычисленное поле durationDays
      },
      include: {
        student: true,
      },
    });

    res.status(201).json({
      borrow,
      student: borrow.student,
      daysBorrowed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create borrow record" });
  }
});

export default router;
