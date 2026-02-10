"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        name: formData.get("name") || undefined,
        password: formData.get("password"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? { _: ["Registration failed"] });
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  const flatErrors = error
    ? Object.values(error).flat().filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">
        Sign up
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Create an account to start building learning paths.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {flatErrors.length > 0 && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            <ul className="list-disc pl-4">
              {flatErrors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
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
          <label htmlFor="name" className="block text-sm font-medium">
            Name (optional)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
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
            autoComplete="new-password"
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            At least 8 characters, with uppercase, lowercase, and a number.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--primary)] py-2.5 font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="underline hover:text-[var(--foreground)]">
          Log in
        </Link>
      </p>
    </div>
  );
}
