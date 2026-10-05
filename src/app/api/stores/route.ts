import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ stores: [] });

    const stores = await prisma.store.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { products: true, orders: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ stores });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { name, description, currency } = await req.json();
    if (!name) return NextResponse.json({ error: "Store name is required" }, { status: 400 });

    const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const store = await prisma.store.create({
      data: { name, slug, description, currency: currency || "SAR", userId: user.id },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}