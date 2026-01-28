import { Router, type IRouter } from "express";
import { prisma } from "../db/index.js";
// Import generated Zod schemas for additional type-safe validation
// These are generated from the OpenAPI spec using openapi-zod-client
import { schemas } from "../generated/schemas.js";

export const usersRouter: IRouter = Router();

// GET /users - Get all users
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Get user by ID
usersRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /users - Create a new user
usersRouter.post("/", async (req, res, next) => {
  try {
    // Validate request body with generated Zod schema
    const validatedData = schemas.CreateUserRequest.parse(req.body);

    const user = await prisma.user.create({
      data: validatedData,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update a user
usersRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate request body with generated Zod schema
    const validatedData = schemas.UpdateUserRequest.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete a user
usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /users/:userId/posts - Get all posts by a user
usersRouter.get("/:userId/posts", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
});
