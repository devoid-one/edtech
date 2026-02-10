"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [error, setError] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description") || undefined,
        slug: formData.get("slug"),
        published: formData.get("published") === "on",
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? { _: ["Failed to create course"] });
      return;
    }
    router.push(`/courses/${data.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
        New course
      </h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && Object.keys(error).length > 0 && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          >
            <ul className="list-disc pl-4">
              {Object.entries(error).flatMap(([k, v]) =>
                (Array.isArray(v) ? v : [v]).map((msg) => (
                  <li key={k}>{msg}</li>
                ))
              )}
            </ul>
          </div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug (URL-friendly, e.g. intro-to-js)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            placeholder="intro-to-js"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="h-4 w-4 rounded border-[var(--border)]"
          />
          <label htmlFor="published" className="text-sm">
            Published
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create course"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-[var(--border)] px-4 py-2 font-medium hover:bg-[var(--card)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
