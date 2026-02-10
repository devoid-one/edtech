import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { lessonSchema } from "@/lib/validations";

async function checkModuleAuth(moduleId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", status: 401 } as const;
  const module_ = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: true },
  });
  if (!module_) return { error: "Module not found", status: 404 } as const;
  if (module_.course.userId !== session.user.id) return { error: "Forbidden", status: 403 } as const;
  return { session, module: module_ } as const;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: moduleId } = await params;
  const result = await checkModuleAuth(moduleId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  try {
    const body = await request.json();
    const parsed = lessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const lesson = await prisma.lesson.create({
      data: { ...parsed.data, moduleId },
    });
    return NextResponse.json(lesson, { status: 201 });
  } catch (e) {
    console.error("Create lesson error:", e);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
