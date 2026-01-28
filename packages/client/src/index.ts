// Re-export all generated types and APIs
export * from "./generated/index.js";

// Import for convenience factory
import { Configuration, UsersApi, PostsApi } from "./generated/index.js";

// Factory function to create configured API clients
export function createApiClients(basePath: string = "http://localhost:3000") {
  const config = new Configuration({ basePath });

  return {
    users: new UsersApi(config),
    posts: new PostsApi(config),
  };
}

// Default client instances for convenience
export const api = createApiClients();
