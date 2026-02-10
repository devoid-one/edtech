import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const courses = await prisma.course.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { modules: true } } },
  });
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const existing = await prisma.course.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: { slug: ["Slug already in use"] } },
        { status: 409 }
      );
    }
    const course = await prisma.course.create({
      data: { ...parsed.data, userId: session.user.id },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (e) {
    console.error("Create course error:", e);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
