import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, name, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: { email: ["Email already registered"] } },
        { status: 409 }
      );
    }
    const hashed = await hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name: name ?? null, password: hashed },
      select: { id: true, email: true, name: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
