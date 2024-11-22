import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: API for managing authors
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     tags:
 *       - Authors
 *     summary: Get all authors
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   bio:
 *                     type: string
 */

// GET запрос для получения всех авторов
router.get("/", async (req, res) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});

/**
 * @swagger
 * /authors:
 *   post:
 *     tags:
 *       - Authors
 *     summary: Add a new author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Bad Request
 */

// POST запрос для создания автора
router.post("/", async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const author = await prisma.author.create({
      data: { name, bio },
    });
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: "Failed to create author" });
  }
});

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     tags:
 *       - Authors
 *     summary: Delete an author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the author to delete
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 */

// DELETE запрос для удаления автора
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAuthor = await prisma.author.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(deletedAuthor);
  } catch (error) {
    res
      .status(404)
      .json({ error: "Failed to delete author or author not found" });
  }
});

export default router;
