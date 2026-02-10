import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { lessonSchema } from "@/lib/validations";

async function getLessonAndCheckAuth(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", status: 401 } as const;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { module: { include: { course: true } } },
  });
  if (!lesson) return { error: "Not found", status: 404 } as const;
  if (lesson.module.course.userId !== session.user.id) return { error: "Forbidden", status: 403 } as const;
  return { session, lesson } as const;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getLessonAndCheckAuth(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  try {
    const body = await request.json();
    const parsed = lessonSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const lesson = await prisma.lesson.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(lesson);
  } catch (e) {
    console.error("Update lesson error:", e);
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getLessonAndCheckAuth(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  await prisma.lesson.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
