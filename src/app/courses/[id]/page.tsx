import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CourseDetail } from "@/components/CourseDetail";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!course || course.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        ← Dashboard
      </Link>
      <CourseDetail course={course} />
    </div>
  );
}
