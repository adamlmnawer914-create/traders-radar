import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { stores: { select: { id: true } } },
    });
    if (!user) return NextResponse.json({ products: [] });

    const storeIds = user.stores.map((s) => s.id);
    const products = await prisma.product.findMany({
      where: { storeId: { in: storeIds } },
      include: { store: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
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
    const { name, sku, costPrice, sellingPrice, stock, lowStockAlert, category, storeId } = body;

    // Verify storeId belongs to user
    const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.id } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const product = await prisma.product.create({
      data: { name, sku, costPrice: costPrice || 0, sellingPrice: sellingPrice || 0, stock: stock || 0, lowStockAlert: lowStockAlert || 5, category, storeId },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}