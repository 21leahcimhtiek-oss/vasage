# vasage

## Overview
Briefly describe the purpose and scope of this repository.

## Setup
1. Clone the repository.
2. Install dependencies for the project stack.
3. Copy `.env.example` to `.env` and configure values.

### Environment variables
- `NODE_ENV` - runtime mode (`development` by default for local work).
- `PORT` - server port for local development.
- `STRIPE_SECRET_KEY` - server-side Stripe API key used to create checkout sessions.
- `VITE_STRIPE_PUBLISHABLE_KEY` - client-side Stripe publishable key for embedded checkout.
- `APP_URL` - public app URL used for checkout return/callback URLs (for local use, typically `http://localhost:3000`).

### EP1 checkout notes
- EP1 wires dependency and environment prerequisites for Stripe embedded checkout.
- Server checkout session creation should read `STRIPE_SECRET_KEY` and `APP_URL`.
- Client checkout initialization should read `VITE_STRIPE_PUBLISHABLE_KEY`.

## Scripts/Usage
Document the main commands or entry points used to run this project.

## Testing
Document how to run the test suite and expected quality checks.

## Deployment Notes
Capture deployment requirements, environment needs, and release checks.

## Release hardening notes

### Setup
- Install dependencies with `npm install` (or `npm ci` when `package-lock.json` is present).

### Testing
- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`

### Deploy
- This repository includes a `vercel.json` baseline for Vercel deployments.
- Deploy with `vercel --prod` after configuring environment variables.
