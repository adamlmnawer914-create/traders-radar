import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSubscription, PLANS, PlanType } from "@/lib/stripe";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        stores: {
          include: {
            _count: { select: { products: true, orders: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const subscription = await getUserSubscription(user.id);

    // Calculate usage
    const storesCount = user.stores.length;
    const productsCount = user.stores.reduce((acc, s) => acc + s._count.products, 0);
    const ordersCount = user.stores.reduce((acc, s) => acc + s._count.orders, 0);

    return NextResponse.json({
      subscription,
      usage: {
        stores: storesCount,
        products: productsCount,
        orders: ordersCount,
      },
      plans: PLANS,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "فشل جلب تفاصيل الاشتراك" }, { status: 500 });
  }
}

// Reset/Change to Free or any plan directly (for testing or downgrade)
export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const newPlan = (body.plan as PlanType) || "FREE";

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const updated = await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        plan: newPlan,
        status: "ACTIVE",
      },
      update: {
        plan: newPlan,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    return NextResponse.json({ error: "فشل تعديل الخطة" }, { status: 500 });
  }
}
