import { Router, type IRouter } from "express";
import { prisma } from "../db/index.js";
// Import generated Zod schemas for additional type-safe validation
// These are generated from the OpenAPI spec using openapi-zod-client
import { schemas } from "../generated/schemas.js";

export const postsRouter: IRouter = Router();

// GET /posts - Get all posts
postsRouter.get("/", async (req, res, next) => {
  try {
    const { published } = req.query;

    const where =
      published !== undefined ? { published: published === "true" } : {};

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /posts/:id - Get post by ID
postsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// POST /posts - Create a new post
postsRouter.post("/", async (req, res, next) => {
  try {
    // Validate request body with generated Zod schema
    const validatedData = schemas.CreatePostRequest.parse(req.body);

    const post = await prisma.post.create({
      data: validatedData,
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

// PUT /posts/:id - Update a post
postsRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate request body with generated Zod schema
    const validatedData = schemas.UpdatePostRequest.parse(req.body);

    const post = await prisma.post.update({
      where: { id },
      data: validatedData,
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// DELETE /posts/:id - Delete a post
postsRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
