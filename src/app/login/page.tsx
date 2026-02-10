"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">
        Log in
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Sign in to manage your learning paths.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--primary)] py-2.5 font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Don’t have an account?{" "}
        <Link href="/register" className="underline hover:text-[var(--foreground)]">
          Sign up
        </Link>
      </p>
    </div>
  );
}
