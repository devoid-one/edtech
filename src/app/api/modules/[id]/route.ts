import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moduleSchema } from "@/lib/validations";

async function getModuleAndCheckAuth(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", status: 401 } as const;
  const module_ = await prisma.module.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!module_) return { error: "Not found", status: 404 } as const;
  if (module_.course.userId !== session.user.id) return { error: "Forbidden", status: 403 } as const;
  return { session, module: module_ } as const;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getModuleAndCheckAuth(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  try {
    const body = await request.json();
    const parsed = moduleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const module_ = await prisma.module.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(module_);
  } catch (e) {
    console.error("Update module error:", e);
    return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getModuleAndCheckAuth(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  await prisma.module.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
