import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { subscription: true },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (isStripeConfigured && stripe && user?.subscription?.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: user.subscription.stripeCustomerId,
        return_url: `${appUrl}/dashboard/billing`,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({
      url: `${appUrl}/dashboard/billing?status=portal_demo`,
      message: "لوحة الفوترة التجريبية",
    });
  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: error?.message || "فشل فتح بوابة إدارة الفواتير" },
      { status: 500 }
    );
  }
}
