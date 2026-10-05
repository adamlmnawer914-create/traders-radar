import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email =
      clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@unknown.com`;
    const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { name, imageUrl: clerkUser.imageUrl },
      create: {
        clerkId: userId,
        email,
        name,
        imageUrl: clerkUser.imageUrl,
      },
    });

    // Create default store if user has no stores
    const storeCount = await prisma.store.count({ where: { userId: user.id } });
    if (storeCount === 0) {
      const storeName = name ? `متجر ${name}` : "متجري الأول";
      const slug = `store-${userId.slice(-8).toLowerCase()}`;
      await prisma.store.create({
        data: {
          name: storeName,
          slug,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ user, message: "User synced successfully" });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        stores: {
          include: {
            _count: { select: { products: true, orders: true } },
          },
        },
        subscription: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}