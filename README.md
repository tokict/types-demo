# Types Demo

A demonstration of end-to-end type safety from database to UI using a spec-first approach.

## Why This Approach?

**One OpenAPI spec file guarantees frontend and backend speak the same language.**

By generating both the API validation (Zod schemas) and the frontend client from the same `openapi/spec.yaml` file:

- **Frontend can't send wrong data** - TypeScript errors at compile time if request body doesn't match the schema
- **Backend can't return wrong data** - Runtime validation rejects responses that don't match the contract
- **No more "works on my machine"** - Both sides are derived from the same source, so they're always in sync
- **Catch breaking changes early** - Regenerate types after spec changes and TypeScript shows all affected code

```
                    ┌─────────────────┐
                    │  OpenAPI Spec   │  ← Single source of truth
                    │  (spec.yaml)    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │  Generated Zod  │           │ Generated Client│
    │    Schemas      │           │     Types       │
    └────────┬────────┘           └────────┬────────┘
             │                             │
             ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │   Express API   │           │  React Frontend │
    │ (validates I/O) │           │ (typed requests)│
    └─────────────────┘           └─────────────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
                   Both enforce the
                    SAME contract
```

## Keeping Clients in Sync

### Auto-Update on Install

Each time a consuming application runs `npm install`, it should fetch the latest version of the generated client package. This ensures clients are always up-to-date with the API contract:

```bash
# In consumer's package.json, use latest or a version range
"dependencies": {
  "@your-org/api-client": "latest"  # Always get newest
  # or
  "@your-org/api-client": "^1.0.0"  # Get latest compatible
}
```

### Preventing Breaking Change Disasters

When the API pushes changes to the OpenAPI spec, **breaking changes can cause runtime failures for clients still using old versions**. To prevent this:

1. **Version the client package** - Bump major version for breaking changes (semver)
2. **Scan before deploy** - Check if any consumers are using incompatible versions
3. **Block deployment** - Stop API deploy if breaking change would affect active clients

```
┌─────────────────────────────────────────────────────────────────┐
│                    API Deployment Pipeline                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │  Detect spec changes   │
                 │  (breaking vs. safe)   │
                 └───────────┬────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     [Breaking Change]              [Non-Breaking]
              │                             │
              ▼                             ▼
   ┌─────────────────────┐        ┌─────────────────┐
   │  Scan client repos  │        │  Deploy safely  │
   │  & running pods     │        └─────────────────┘
   └──────────┬──────────┘
              │
   ┌──────────┴──────────┐
   │                     │
[Old clients found]  [All updated]
   │                     │
   ▼                     ▼
┌──────────────┐   ┌─────────────────┐
│ BLOCK DEPLOY │   │  Deploy safely  │
│ Notify teams │   └─────────────────┘
└──────────────┘
```

### Implementation Strategies

**Option 1: Repository Scanning**
- Scan all frontend repos for `package.json` dependencies
- Check which client version each repo uses
- Alert teams with outdated versions before deploying breaking changes

**Option 2: Runtime Version Header**
- Clients send their version in request headers: `X-Client-Version: 1.2.3`
- API logs which versions are actively hitting endpoints
- Deployment checks if any active clients would break

**Option 3: Kubernetes Pod Scanning**
- Query running pods for their client version (via labels or endpoints)
- Block deploy if pods with old clients are still running
- Integrate with ArgoCD/Flux for GitOps workflows

```yaml
# Example: GitHub Action to check client versions before API deploy
- name: Check for breaking changes
  run: |
    # Compare current spec with previous version
    npx openapi-diff previous-spec.yaml openapi/spec.yaml
    
- name: Scan consumer repos
  run: |
    # Query GitHub API for repos using @your-org/api-client
    # Check their package.json for version compatibility
    
- name: Block if incompatible clients exist
  run: |
    if [ "$BREAKING_CHANGE" = "true" ] && [ "$OLD_CLIENTS_EXIST" = "true" ]; then
      echo "Cannot deploy: breaking change with active old clients"
      exit 1
    fi
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OpenAPI Spec (Source of Truth)                   │
│                           openapi/spec.yaml                             │
└─────────────────────────────────────────────────────────────────────────┘
                    │                              │
                    ▼                              ▼
     ┌──────────────────────────┐    ┌──────────────────────────┐
     │   Generated Zod Schemas  │    │   Generated TypeScript   │
     │   (openapi-zod-client)   │    │   (openapi-typescript)   │
     └──────────────────────────┘    └──────────────────────────┘
                    │                              │
                    ▼                              ▼
     ┌──────────────────────────┐    ┌──────────────────────────┐
     │      Express API         │    │     React Frontend       │
     │  (request validation)    │    │   (typed API client)     │
     └──────────────────────────┘    └──────────────────────────┘
                    │
                    ▼
     ┌──────────────────────────┐
     │   PostgreSQL + Prisma    │
     │   (database operations)  │
     └──────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Database | PostgreSQL + Prisma | Type-safe database operations |
| Source of Truth | OpenAPI Spec (YAML) | Single source for API contracts |
| API Framework | Express + TypeScript | Node.js web framework |
| Zod Generation | openapi-zod-client | Generate Zod schemas from OpenAPI |
| API Validation | express-openapi-validator | Runtime request/response validation |
| Client Generation | openapi-typescript + openapi-fetch | Type-safe API client |
| Frontend | React + Vite | Modern React app |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Setup the database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push
```

### 4. Generate types from OpenAPI spec

```bash
# Generate Zod schemas for API validation
pnpm generate:zod

# Generate TypeScript client
pnpm generate:client
```

### 5. Start development servers

```bash
pnpm dev
```

This starts:
- API server at http://localhost:3000
- Web app at http://localhost:5173

## Project Structure

```
types-demo/
├── openapi/
│   └── spec.yaml               # OpenAPI spec (SOURCE OF TRUTH)
├── packages/
│   ├── api/                    # Express API server
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   └── src/
│   │       ├── db/             # Prisma client
│   │       ├── generated/      # Generated Zod schemas
│   │       ├── routes/         # Express routes
│   │       └── index.ts        # Server entry
│   ├── client/                 # Generated API client (publishable npm package)
│   │   └── src/
│   │       ├── generated/      # Generated TypeScript types
│   │       └── index.ts        # Client factory
│   └── web/                    # React frontend
│       └── src/
│           ├── api/            # API client instance
│           └── App.tsx         # Main component
├── docker-compose.yaml         # PostgreSQL container
├── turbo.json                  # Turborepo config
└── package.json                # Root package.json
```

## How It Works

### 1. OpenAPI Spec (Source of Truth)

The `openapi/spec.yaml` file defines all API endpoints, request/response schemas, and validation rules. This is the single source of truth.

```yaml
components:
  schemas:
    CreateUserRequest:
      type: object
      required:
        - email
        - name
      properties:
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
          maxLength: 100
```

### 2. Generated Zod Schemas

Running `pnpm generate:zod` creates Zod schemas from the OpenAPI spec:

```typescript
export const schemas = {
  CreateUserRequest: z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
  }),
};
```

### 3. Express API Validation

The API uses both `express-openapi-validator` (runtime validation against OpenAPI spec) and generated Zod schemas for additional type-safe validation:

```typescript
usersRouter.post("/", async (req, res, next) => {
  // Validate with generated Zod schema
  const validatedData = schemas.CreateUserRequest.parse(req.body);
  
  // Use with Prisma (type-safe!)
  const user = await prisma.user.create({
    data: validatedData,
  });
  
  res.status(201).json(user);
});
```

### 4. Generated TypeScript Client

Running `pnpm generate:client` creates fully typed API methods:

```typescript
// All paths, methods, request/response types are generated
const { data, error } = await api.POST("/users", {
  body: {
    name: "John",     // ✅ Required
    email: "j@x.com", // ✅ Required, must be email
    // age: 25,       // ❌ TypeScript error!
  },
});

// Response is fully typed
console.log(data.id);        // ✅ string
console.log(data.createdAt); // ✅ string
```

### 5. React Frontend

The frontend imports types from the generated client:

```typescript
import type { components } from "@types-demo/client";

type User = components["schemas"]["User"];

// Full autocomplete and type checking!
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages |
| `pnpm generate:zod` | Generate Zod schemas from OpenAPI |
| `pnpm generate:client` | Generate TypeScript client from OpenAPI |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push Prisma schema to database |

## Publishing the Client Package

The `@types-demo/client` package is designed to be published to npm and installed by consumers of your API. This allows any frontend application to get type-safe API access.

### Preparing for Publication

1. Update `packages/client/package.json` with your package name and version:

```json
{
  "name": "@your-org/api-client",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

2. Build the client package:

```bash
pnpm --filter @types-demo/client build
```

3. Publish to npm:

```bash
cd packages/client
npm publish --access public
```

### Consuming the Published Client

Once published, consumers can install and use your typed client:

```bash
npm install @your-org/api-client
```

```typescript
import { createApiClient } from "@your-org/api-client";
import type { components } from "@your-org/api-client";

// Create a typed client pointing to your API
const api = createApiClient("https://api.example.com");

// Full type safety!
type User = components["schemas"]["User"];

const { data } = await api.GET("/users");
// data is typed as User[]
```

### CI/CD Integration

Automate client generation and publishing in your CI pipeline:

```yaml
# .github/workflows/publish-client.yml
on:
  push:
    paths:
      - 'openapi/spec.yaml'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm generate:client
      - run: pnpm --filter @types-demo/client build
      - run: npm publish
        working-directory: packages/client
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Benefits of This Approach

1. **Single Source of Truth**: OpenAPI spec defines the contract once
2. **Type Safety Everywhere**: From database to UI, all types are derived and consistent
3. **Runtime Validation**: express-openapi-validator ensures API contract compliance
4. **Developer Experience**: Full autocomplete and error checking in IDEs
5. **API Documentation**: OpenAPI spec serves as living documentation
6. **Client Generation**: Frontend clients are always in sync with the API
7. **Distributable Client**: Publish typed clients for external consumers
