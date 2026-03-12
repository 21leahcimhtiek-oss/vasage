# GitHub Copilot Instructions for Vasage (Vercel Clone)

## Project Overview

Vasage is a Vercel-like deployment platform that allows users to deploy web applications from GitHub repositories. It features automatic framework detection, build pipelines, deployment management, edge functions, analytics, and scheduled functions.

### Tech Stack

- **Frontend**: React 19 with TypeScript, Vite, Tailwind CSS v4, shadcn/ui components
- **Backend**: Express.js with tRPC for type-safe APIs
- **Database**: MySQL with Drizzle ORM
- **Storage**: AWS S3 for deployment artifacts
- **Routing**: wouter for client-side routing
- **Auth**: JWT-based authentication with jose library

## Project Structure

```
vasage/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── pages/          # Route-based page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions and tRPC client
├── server/                 # Backend Express application
│   ├── _core/              # Core server utilities (tRPC, auth)
│   ├── routers/            # tRPC routers
│   │   ├── projects.ts     # Project management
│   │   ├── github.ts       # GitHub integration
│   │   ├── deployments.ts  # Deployment management
│   │   ├── edgeFunctions.ts # Serverless edge functions
│   │   ├── analytics.ts    # Traffic analytics
│   │   └── scheduledFunctions.ts # Cron jobs
│   ├── db.ts               # Database query functions
│   └── storage.ts          # S3 storage operations
├── drizzle/                # Database schema definitions
│   └── schema.ts           # Drizzle schema
└── shared/                 # Shared types and constants
```

## Database Schema

### Core Tables

- **users**: User accounts with OAuth authentication
- **projects**: Projects connected to GitHub repositories
  - Framework detection (next, react, vue, svelte, etc.)
  - Build/install commands
  - Output directory configuration
- **deployments**: Deployment records with status tracking
  - Status: pending, building, success, failed, cancelled
  - Git commit information
  - Deployment URLs
- **buildLogs**: Real-time build logs
- **environmentVariables**: Project environment variables
- **edgeFunctions**: Serverless function definitions
- **analytics**: Traffic and usage analytics
- **scheduledFunctions**: Cron job definitions

## Key Features

### GitHub Integration
- OAuth flow for repository access
- Repository listing and import
- Branch management
- Webhook handling for push events

### Build Pipeline
- Automatic framework detection
- Framework-specific build commands
- Isolated build environments
- Real-time log streaming
- Build timeout and error handling

### Deployment System
- Unique deployment URLs
- Static file serving
- Deployment history tracking
- Rollback functionality
- Environment variable injection

### Premium Features
- Edge Functions (serverless compute)
- Analytics dashboard
- Scheduled functions (cron jobs)
- Preview deployments

## Backend Patterns

### tRPC Router Pattern

```typescript
// server/routers/projects.ts
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const projectsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getProjectsByUserId(ctx.user.id);
  }),
  
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      githubRepoUrl: z.string().url(),
      framework: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return createProject({ userId: ctx.user.id, ...input });
    }),
});
```

### Main Router Export

```typescript
// server/routers.ts
import { router } from "./_core/trpc";
import { projectsRouter } from "./routers/projects";
import { githubRouter } from "./routers/github";
import { deploymentsRouter } from "./routers/deployments";
import { edgeFunctionsRouter } from "./routers/edgeFunctions";
import { analyticsRouter } from "./routers/analytics";
import { scheduledFunctionsRouter } from "./routers/scheduledFunctions";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  projects: projectsRouter,
  github: githubRouter,
  deployments: deploymentsRouter,
  edgeFunctions: edgeFunctionsRouter,
  analytics: analyticsRouter,
  scheduledFunctions: scheduledFunctionsRouter,
});
```

## Environment Variables

- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET` - S3 storage

## Commands

```bash
pnpm dev        # Start development server with hot reload
pnpm build      # Build for production (Vite + esbuild)
pnpm start      # Start production server
pnpm test       # Run tests with Vitest
pnpm db:push    # Generate and run Drizzle migrations
pnpm check      # TypeScript type checking
pnpm format     # Format code with Prettier
```

## Framework Detection

The platform automatically detects frameworks:
- Next.js
- React (Vite, CRA)
- Vue (Nuxt, Vite)
- Svelte (SvelteKit)
- Static HTML

## Code Style Guidelines

1. **TypeScript**: Use strict typing; avoid `any` when possible
2. **Imports**: Use `@/` alias for client src imports, `@shared/` for shared code
3. **Components**: Follow shadcn/ui patterns; use Radix primitives
4. **APIs**: All API routes go through tRPC routers
5. **Database**: Use Drizzle ORM; avoid raw SQL
6. **Error Handling**: Use HTTPException for API errors

## Testing

Tests are written with Vitest:

```bash
pnpm test
```

## Notes for Copilot

1. When adding new endpoints, create them in `server/routers/` using tRPC
2. When adding new database tables, define them in `drizzle/schema.ts` and run `pnpm db:push`
3. GitHub integration is handled through the github router
4. Build pipeline runs in isolated environments per deployment
5. Edge functions are serverless functions that run at edge locations
6. Use `protectedProcedure` for authenticated routes, `publicProcedure` for public routes
7. Deployment URLs are unique per deployment, enabling rollback functionality