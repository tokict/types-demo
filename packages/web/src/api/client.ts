import { createApiClient } from "@types-demo/client";

// Create the API client pointing to our backend
// In development, Vite proxies /api to localhost:3000
export const api = createApiClient("http://localhost:3000");
