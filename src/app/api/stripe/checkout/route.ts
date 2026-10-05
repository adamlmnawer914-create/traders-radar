import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe, isStripeConfigured, PLANS, PlanType } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const body = await req.json();
    const planId = (body.planId as PlanType) || "STARTER";

    if (!PLANS[planId]) {
      return NextResponse.json({ error: "باقة غير صالحة" }, { status: 400 });
    }

    const planConfig = PLANS[planId];

    // Find or create DB user
    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: { subscription: true },
    });

    if (!user) {
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || `${clerkId}@unknown.com`;
      const name = `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || null;
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          imageUrl: clerkUser?.imageUrl,
        },
        include: { subscription: true },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://traders-radar.vercel.app";

    // If Stripe is configured with live/test key
    if (isStripeConfigured && stripe) {
      let stripeCustomerId = user.subscription?.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: { userId: user.id, clerkId },
        });
        stripeCustomerId = customer.id;

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stripeCustomerId,
            plan: planId,
            status: "INACTIVE",
          },
          update: { stripeCustomerId },
        });
      }

      const isLifetime = planConfig.isLifetime;

      const lineItem = isLifetime
        ? {
            price_data: {
              currency: "usd",
              product_data: {
                name: `رادار التجار - ${planConfig.name}`,
                description: planConfig.description,
              },
              unit_amount: planConfig.price * 100, // cents
            },
            quantity: 1,
          }
        : {
            price_data: {
              currency: "usd",
              product_data: {
                name: `رادار التجار - ${planConfig.name}`,
                description: planConfig.description,
              },
              unit_amount: planConfig.price * 100,
              recurring: { interval: "month" as const },
            },
            quantity: 1,
          };

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: isLifetime ? "payment" : "subscription",
        line_items: [lineItem],
        metadata: {
          userId: user.id,
          planId,
        },
        success_url: `${appUrl}/dashboard/billing?status=success&plan=${planId}`,
        cancel_url: `${appUrl}/dashboard/billing?status=cancelled`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Instant Activation in Demo Mode (when Stripe secret is test placeholder)
    const nextPeriod = new Date();
    if (planConfig.isLifetime) {
      nextPeriod.setFullYear(nextPeriod.getFullYear() + 100); // 100 years lifetime
    } else {
      nextPeriod.setMonth(nextPeriod.getMonth() + 1);
    }

    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        plan: planId,
        status: "ACTIVE",
        currentPeriodEnd: nextPeriod,
      },
      update: {
        plan: planId,
        status: "ACTIVE",
        currentPeriodEnd: nextPeriod,
      },
    });

    return NextResponse.json({
      url: `${appUrl}/dashboard/billing?status=success&plan=${planId}&mode=demo`,
      demo: true,
      message: `تم تفعيل ${planConfig.name} بنجاح!`,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error?.message || "حدث خطأ أثناء إنشاء جلسة الدفع" }, { status: 500 });
  }
}
