import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const courses = await prisma.course.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { modules: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Your courses
        </h1>
        <Link
          href="/dashboard/courses/new"
          className="rounded-lg bg-[var(--primary)] px-4 py-2 font-medium text-white hover:bg-[var(--primary-hover)]"
        >
          New course
        </Link>
      </div>
      {courses.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-12 text-center">
          <p className="text-[var(--muted)]">No courses yet.</p>
          <Link
            href="/dashboard/courses/new"
            className="mt-4 inline-block text-[var(--primary)] underline"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/30 hover:shadow-md"
              >
                <h2 className="font-medium text-[var(--foreground)]">
                  {course.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {course._count.modules} module{course._count.modules !== 1 ? "s" : ""}
                </p>
                {course.published && (
                  <span className="mt-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Published
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
