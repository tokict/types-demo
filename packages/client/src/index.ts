import createClient from "openapi-fetch";
import type { paths } from "./generated/api.js";

// Re-export the generated types for consumers
export type * from "./generated/api.js";

// Create a typed API client
export function createApiClient(baseUrl: string = "http://localhost:3000") {
  return createClient<paths>({ baseUrl });
}

// Default client instance for convenience
export const apiClient = createApiClient();
