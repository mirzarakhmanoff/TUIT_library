import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     description: Get all categories
 *     responses:
 *       200:
 *         description: A list of categories
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
 */
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - Categories
 *     description: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Successfully created a category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 */
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }
  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     description: Get a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Category not found
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     description: Update a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category's ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Category not found
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id, 10) },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     description: Delete a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category's ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Category not found
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
