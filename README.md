# LearnPath – House of Edtech Fullstack Assignment

A full-stack **Learning Path Manager** built with **Next.js 16**, **TypeScript**, **PostgreSQL** (Prisma), and **Tailwind CSS**. Educators can create courses, organize them into modules, and add lessons with full CRUD and authentication.

## Tech Stack

- **Frontend / Backend:** Next.js 16 (App Router), React 19, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js v5 (JWT, credentials)
- **Validation:** Zod (input sanitization, length limits, regex for slug)
- **Styling:** Tailwind CSS v4

## Features

- **Authentication & authorization:** Register, login, JWT session. Routes protected by middleware; API checks `userId` on all course/module/lesson mutations.
- **CRUD:** Courses (title, description, slug, published), Modules (title, order), Lessons (title, content, order). Create, read, update, delete with ownership checks.
- **Data validation & security:** Zod schemas on all API inputs; trimmed strings, max lengths, slug regex; password strength rules; bcrypt hashing.
- **UI:** Responsive layout, focus-visible outlines, semantic HTML, ARIA where needed. Footer includes candidate name, GitHub, and LinkedIn (placeholders to be replaced).

## Getting Started

### Prerequisites

- Node.js 20.9+
- PostgreSQL (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))

### Setup

1. Clone and install:
   ```bash
   git clone <your-repo-url>
   cd edtech
   npm install
   ```

2. Environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `DATABASE_URL` – PostgreSQL connection string
   - `AUTH_SECRET` – e.g. `openssl rand -base64 32`

3. Database:
   ```bash
   npm run db:push
   ```

4. Run:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Register, then create courses, modules, and lessons.

### Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run start` – Start production server
- `npm run lint` – ESLint
- `npm run db:push` – Push Prisma schema to DB
- `npm run db:studio` – Open Prisma Studio

## Deployment (e.g. Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Set env vars: `DATABASE_URL`, `AUTH_SECRET`.
3. Use a hosted Postgres (Neon, Supabase, etc.) and ensure Prisma runs in the build (e.g. `postinstall: prisma generate` is in `package.json`).
4. Deploy; Vercel will run `next build` and deploy.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR:

- Checkout, Node 20, cache `node_modules`
- `npm ci`, `npx prisma generate`
- `npm run lint`, `npm run build`

No DB in CI; build and type-check only. For E2E you could add a job with a service container or hosted DB.

## Real-World Considerations

- **Scalability:** Stateless API; DB connection pooling via Prisma; consider read replicas and caching (e.g. React cache, unstable_cache) for heavy read paths.
- **Error handling:** API routes return appropriate status codes and JSON errors; validation errors surfaced in UI; avoid leaking stack traces in production.
- **Security:** Auth on every mutation; input validation and sanitization (Zod); parameterized queries (Prisma); HTTPS in production; secure cookies for session; rate limiting and CSRF recommended for production.
- **Accessibility:** Semantic markup, labels, focus-visible styles, and keyboard-friendly controls.

## Submission (House of Edtech)

- **GitHub:** Share the repository link.
- **Live deployment:** Deploy to Vercel (or Netlify) and share the URL.
- **Footer:** Update `src/components/Footer.tsx` with your **name**, **GitHub profile URL**, and **LinkedIn profile URL**.

## License

MIT.
