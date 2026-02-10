import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/validations";

async function getCourseAndCheckAuth(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", status: 401 } as const;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return { error: "Not found", status: 404 } as const;
  if (course.userId !== session.user.id) return { error: "Forbidden", status: 403 } as const;
  return { session, course } as const;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getCourseAndCheckAuth(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
    },
  });
  return NextResponse.json(course);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getCourseAndCheckAuth(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  try {
    const body = await request.json();
    const parsed = courseSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (parsed.data.slug) {
      const existing = await prisma.course.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: { slug: ["Slug already in use"] } },
          { status: 409 }
        );
      }
    }
    const course = await prisma.course.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(course);
  } catch (e) {
    console.error("Update course error:", e);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getCourseAndCheckAuth(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  await prisma.course.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
