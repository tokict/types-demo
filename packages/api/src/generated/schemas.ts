import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const User = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1).max(100),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const CreateUserRequest = z
  .object({ email: z.string().email(), name: z.string().min(1).max(100) })
  .passthrough();
const ErrorResponse = z
  .object({ message: z.string(), code: z.string().optional() })
  .passthrough();
const UpdateUserRequest = z
  .object({ email: z.string().email(), name: z.string().min(1).max(100) })
  .partial()
  .passthrough();
const Post = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1).max(200),
    content: z.string(),
    published: z.boolean(),
    authorId: z.string().uuid(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const CreatePostRequest = z
  .object({
    title: z.string().min(1).max(200),
    content: z.string(),
    published: z.boolean().optional().default(false),
    authorId: z.string().uuid(),
  })
  .passthrough();
const UpdatePostRequest = z
  .object({
    title: z.string().min(1).max(200),
    content: z.string(),
    published: z.boolean(),
  })
  .partial()
  .passthrough();

export const schemas = {
  User,
  CreateUserRequest,
  ErrorResponse,
  UpdateUserRequest,
  Post,
  CreatePostRequest,
  UpdatePostRequest,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/posts",
    alias: "getPosts",
    requestFormat: "json",
    parameters: [
      {
        name: "published",
        type: "Query",
        schema: z.boolean().optional(),
      },
    ],
    response: z.array(Post),
  },
  {
    method: "post",
    path: "/posts",
    alias: "createPost",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreatePostRequest,
      },
    ],
    response: Post,
    errors: [
      {
        status: 400,
        description: `Invalid request body`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/posts/:id",
    alias: "getPostById",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Post,
    errors: [
      {
        status: 404,
        description: `Post not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/posts/:id",
    alias: "updatePost",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdatePostRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Post,
    errors: [
      {
        status: 404,
        description: `Post not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/posts/:id",
    alias: "deletePost",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Post not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/users",
    alias: "getUsers",
    requestFormat: "json",
    response: z.array(User),
  },
  {
    method: "post",
    path: "/users",
    alias: "createUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateUserRequest,
      },
    ],
    response: User,
    errors: [
      {
        status: 400,
        description: `Invalid request body`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/users/:id",
    alias: "getUserById",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: User,
    errors: [
      {
        status: 404,
        description: `User not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/users/:id",
    alias: "updateUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateUserRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: User,
    errors: [
      {
        status: 404,
        description: `User not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/users/:id",
    alias: "deleteUser",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `User not found`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/users/:userId/posts",
    alias: "getUserPosts",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.array(Post),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
