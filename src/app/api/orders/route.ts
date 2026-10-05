import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { stores: { select: { id: true } } },
    });
    if (!user) return NextResponse.json({ orders: [] });

    const storeIds = user.stores.map((s) => s.id);
    const orders = await prisma.order.findMany({
      where: { storeId: { in: storeIds } },
      include: { store: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ orders });
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

    const body = await req.json();
    const { customerName, customerPhone, totalAmount, profitAmount, status, paymentStatus, storeId } = body;

    const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.id } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const orderCount = await prisma.order.count({ where: { storeId } });
    const orderNumber = `ORD-${String(orderCount + 1).padStart(4, "0")}`;

    const order = await prisma.order.create({
      data: { orderNumber, customerName, customerPhone, totalAmount, profitAmount: profitAmount || 0, status: status || "NEW", paymentStatus: paymentStatus || "PAID", storeId },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}