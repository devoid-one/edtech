import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";

export async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href={session ? "/dashboard" : "/"}
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          LearnPath
        </Link>
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Dashboard
              </Link>
              <span className="text-sm text-[var(--muted)]" aria-hidden>
                {session.user.email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md bg-stone-200 px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-stone-300 dark:bg-stone-600 dark:hover:bg-stone-500"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
