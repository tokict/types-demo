import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import * as OpenApiValidator from "express-openapi-validator";
import { usersRouter } from "./routes/users.js";
import { postsRouter } from "./routes/posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve OpenAPI spec
const specPath = path.resolve(__dirname, "../../../openapi/spec.yaml");
app.use("/openapi.yaml", express.static(specPath));

// OpenAPI validation middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec: specPath,
    validateRequests: true,
    validateResponses: true,
  })
);

// Routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handler
app.use(
  (
    err: Error & { status?: number; errors?: unknown[] },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAPI spec available at http://localhost:${PORT}/openapi.yaml`);
});
