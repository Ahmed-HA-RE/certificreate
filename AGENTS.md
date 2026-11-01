# AGENTS.md

Instructions for AI coding agents working in this project.

AI coding tools must not add AI attribution to commits or pull requests,
including AI `Co-Authored-By` trailers or generated-by signatures. Preserve
genuine human attribution.

## What this is

**certifcreate** - a Next.js web application.

> TODO: one-line description of the problem this project solves.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Proportional engineering

Build for established requirements, not hypothetical scale, threats, or future
flexibility. Reuse existing code, the standard library, native platform features,
and installed dependencies before adding machinery.

- Unknown scale or extensibility defaults to the smaller reversible design. Do
  not infer enterprise, multi-tenant, hostile-user, or compliance requirements.
- Derive trust and data-integrity boundaries from actual reachability: untrusted
  input, auth/session/ownership, shared persisted data, destructive operations,
  payments, secrets, and sensitive data.
- Ask only when an unknown materially changes behavior, architecture, persisted
  data, interoperability, a real security boundary, or cost. Otherwise choose the
  simplest repository-native implementation.
- Add an abstraction, dependency, service, configuration surface, compatibility
  layer, or security mechanism only for a current requirement.
- Simplicity never removes real trust-boundary validation, data-loss prevention,
  accessibility, explicit security requirements, configured tests, or project rules.
- Stack-specific standards apply only when the project uses that stack.

## Conventions

- **Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4.
- **Package manager:** pnpm. Do not use npm or yarn, and do not commit other lockfiles.
- **Layout:** routes live in the root `app/` directory (no `src/`). Import with
  the `@/` alias, which maps to the project root.
- **Rendering:** Server Components by default; add `'use client'` only for
  interactivity, hooks, or browser APIs. `cacheComponents` is enabled in
  `next.config.ts`, so check the bundled Next.js docs for caching and dynamic
  data rules before fetching data.
- **Styling:** Tailwind v4, CSS-first. Theme tokens go in `@theme` in
  `app/globals.css`; there is no `tailwind.config.*`. The Tailwind loader is
  wired through Turbopack in `next.config.ts`.
- **Code style:** single quotes, including JSX attributes. No formatter is
  configured yet, so match the surrounding code.
- **Validation:** validate untrusted input on the server at every action or
  route boundary.

## Commands

- Dev server: `pnpm dev` (http://localhost:3000)
- Build: `pnpm build` (also runs TypeScript type checking)
- Production server: `pnpm start` (after `pnpm build`)
- Lint: `pnpm lint`

No `test`, `typecheck`, `format`, or `verify` script is configured yet.

## Testing

There is no test runner yet, so tests are not a required gate. Verify changes
with `pnpm lint`, `pnpm build`, and direct evidence from the running app. When a
test runner is added, document its exact command here as `Test`; from then on,
steps that add logic must ship a passing test.
