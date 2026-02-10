import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
        LearnPath
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Create and manage learning paths: courses, modules, and lessons. Built for
        educators — House of Edtech Assignment.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        {session ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-white hover:bg-[var(--primary-hover)]"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg border border-[var(--border)] px-6 py-3 font-medium hover:bg-[var(--card)]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-white hover:bg-[var(--primary-hover)]"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
