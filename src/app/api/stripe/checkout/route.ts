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
    const planId = (body.planId as PlanType) || "PRO";
    const interval = (body.interval as "monthly" | "yearly") || "monthly";

    if (!PLANS[planId] || planId === "FREE") {
      return NextResponse.json({ error: "باقة غير صالحة" }, { status: 400 });
    }

    // Find DB user
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // If Stripe is fully configured with real keys
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
            plan: "FREE",
            status: "ACTIVE",
          },
          update: { stripeCustomerId },
        });
      }

      const planConfig = PLANS[planId];
      const priceAmount = interval === "yearly" ? planConfig.priceYearly : planConfig.priceMonthly;

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
                line_items: [
          {
            price_data: {
              currency: "sar",
              product_data: {
                name: `رادار التجار - ${planConfig.name}`,
                description: planConfig.description,
              },
              unit_amount: priceAmount * 100, // in halalas (cents)
              recurring: {
                interval: interval === "yearly" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          planId,
          interval,
        },
        success_url: `${appUrl}/dashboard/billing?status=success&plan=${planId}`,
        cancel_url: `${appUrl}/dashboard/billing?status=cancelled`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Seamless Fallback for Development/Demo Mode (when Stripe secret is test placeholder)
    // Directly activates the plan in DB so the user can test all features immediately!
    const nextPeriod = new Date();
    if (interval === "yearly") {
      nextPeriod.setFullYear(nextPeriod.getFullYear() + 1);
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
      message: `تمت الترقية بنجاح إلى ${PLANS[planId].name} (وضع التجربة)`,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء إنشاء جلسة الدفع" },
      { status: 500 }
    );
  }
}
