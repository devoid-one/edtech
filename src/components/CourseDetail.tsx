"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Course, Module, Lesson } from "@prisma/client";

type CourseWithModules = Course & {
  modules: (Module & { lessons: Lesson[] })[];
};

export function CourseDetail({ course }: { course: CourseWithModules }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description ?? "");
  const [slug, setSlug] = useState(course.slug);
  const [published, setPublished] = useState(course.published);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveCourse() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: description || undefined, slug, published }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error?.slug?.[0] ?? d.error?.title?.[0] ?? "Failed to save");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function deleteCourse() {
    if (!confirm("Delete this course and all its modules and lessons?")) return;
    const res = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="mt-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {!editing ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                {course.title}
              </h1>
              {course.description && (
                <p className="mt-2 text-[var(--muted)]">{course.description}</p>
              )}
              <p className="mt-1 text-sm text-[var(--muted)]">/{course.slug}</p>
              {course.published && (
                <span className="mt-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Published
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--card)]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={deleteCourse}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="pub"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="pub" className="text-sm">Published</label>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveCourse}
                disabled={saving}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setError(null); setTitle(course.title); setDescription(course.description ?? ""); setSlug(course.slug); setPublished(course.published); }}
                className="rounded-lg border border-[var(--border)] px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <ModulesSection courseId={course.id} modules={course.modules} />
    </div>
  );
}

function ModulesSection({
  courseId,
  modules,
}: {
  courseId: string;
  modules: (Module & { lessons: Lesson[] })[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function addModule() {
    if (!newTitle.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), order: modules.length }),
    });
    setLoading(false);
    if (res.ok) {
      setNewTitle("");
      setAdding(false);
      router.refresh();
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Modules
        </h2>
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-sm text-white hover:bg-[var(--primary-hover)]"
          >
            Add module
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Module title"
              className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addModule()}
            />
            <button
              type="button"
              onClick={addModule}
              disabled={loading || !newTitle.trim()}
              className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-sm text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"
            >
              {loading ? "…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setNewTitle(""); }}
              className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <ul className="mt-4 space-y-4">
        {modules.map((mod) => (
          <ModuleItem key={mod.id} module={mod} />
        ))}
      </ul>
    </div>
  );
}

function ModuleItem({ module }: { module: Module & { lessons: Lesson[] } }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/modules/${module.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setSaving(false);
    if (res.ok) {
      setEditing(false);
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm("Delete this module and all its lessons?")) return;
    const res = await fetch(`/api/modules/${module.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <li className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between">
        {!editing ? (
          <>
            <h3 className="font-medium text-[var(--foreground)]">{module.title}</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={remove}
                className="text-sm text-red-600 hover:underline dark:text-red-400"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1"
            />
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="ml-2 rounded bg-[var(--primary)] px-2 py-1 text-sm text-white disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setTitle(module.title); }}
              className="ml-1 rounded border px-2 py-1 text-sm"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      <LessonsList moduleId={module.id} lessons={module.lessons} />
    </li>
  );
}

function LessonsList({
  moduleId,
  lessons,
}: {
  moduleId: string;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function addLesson() {
    if (!title.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/modules/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim() || undefined,
        order: lessons.length,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setTitle("");
      setContent("");
      setAdding(false);
      router.refresh();
    }
  }

  return (
    <div className="mt-3 border-t border-[var(--border)] pt-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--muted)]">Lessons</span>
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-sm text-[var(--primary)] hover:underline"
          >
            + Add lesson
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title"
              className="rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content (optional)"
              rows={2}
              className="rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addLesson}
                disabled={loading || !title.trim()}
                className="rounded bg-[var(--primary)] px-2 py-1 text-sm text-white disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setAdding(false); setTitle(""); setContent(""); }}
                className="rounded border px-2 py-1 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <ul className="mt-2 space-y-2">
        {lessons.map((lesson) => (
          <LessonItem key={lesson.id} lesson={lesson} />
        ))}
      </ul>
    </div>
  );
}

function LessonItem({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: content || undefined }),
    });
    setSaving(false);
    if (res.ok) {
      setEditing(false);
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm("Delete this lesson?")) return;
    const res = await fetch(`/api/lessons/${lesson.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <li className="rounded border border-[var(--border)]/80 bg-[var(--background)]/50 px-3 py-2 text-sm">
      {!editing ? (
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-medium text-[var(--foreground)]">{lesson.title}</span>
            {lesson.content && (
              <p className="mt-0.5 text-[var(--muted)]">{lesson.content}</p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={remove}
              className="text-red-600 hover:underline dark:text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="w-full rounded border border-[var(--border)] bg-[var(--card)] px-2 py-1"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded bg-[var(--primary)] px-2 py-1 text-sm text-white disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setTitle(lesson.title); setContent(lesson.content ?? ""); }}
              className="rounded border px-2 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
