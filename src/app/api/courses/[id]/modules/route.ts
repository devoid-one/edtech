import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moduleSchema } from "@/lib/validations";

async function checkCourseAuth(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", status: 401 } as const;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found", status: 404 } as const;
  if (course.userId !== session.user.id) return { error: "Forbidden", status: 403 } as const;
  return { session, course } as const;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const result = await checkCourseAuth(courseId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  try {
    const body = await request.json();
    const parsed = moduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const module_ = await prisma.module.create({
      data: { ...parsed.data, courseId },
    });
    return NextResponse.json(module_, { status: 201 });
  } catch (e) {
    console.error("Create module error:", e);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
