import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe, isStripeConfigured, PLANS, PlanType } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    const cookieStore = await cookies();
    const isDemoCookie = cookieStore.get("traders_demo_session")?.value === "true";

    const body = await req.json().catch(() => ({}));
    const planId = (body.planId as PlanType) || "STARTER";
    const guestEmail = body.email || (isDemoCookie ? "demo.trader@traders-radar.com" : null);

    if (!PLANS[planId]) {
      return NextResponse.json({ error: "الباقة المختارة غير صالحة" }, { status: 400 });
    }

    const planConfig = PLANS[planId];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://traders-radar.vercel.app";

    // Effective user identifier: real clerkId or demo ID
    const effectiveClerkId = clerkId || (isDemoCookie ? "demo_trader_vip" : `guest_${Date.now()}`);

    let user = await prisma.user.findUnique({
      where: { clerkId: effectiveClerkId },
      include: { subscription: true },
    });

    if (!user) {
      let email = guestEmail || `${effectiveClerkId}@tradersradar.com`;
      let name = "التاجر المشترك";

      if (clerkId) {
        const clerkUser = await currentUser();
        email = clerkUser?.emailAddresses?.[0]?.emailAddress || email;
        name = `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || name;
      }

      user = await prisma.user.create({
        data: {
          clerkId: effectiveClerkId,
          email,
          name,
        },
        include: { subscription: true },
      });
    }

    // 1. If real Stripe is configured and live/test key is provided
    if (isStripeConfigured && stripe) {
      let stripeCustomerId = user.subscription?.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: { userId: user.id, clerkId: effectiveClerkId },
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

    // 2. Instant Subscription Activation (when Stripe is in demo/test mode)
    const nextPeriod = new Date();
    if (planConfig.isLifetime) {
      nextPeriod.setFullYear(nextPeriod.getFullYear() + 100);
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

    // Set demo cookie so the user can immediately access the dashboard
    const response = NextResponse.json({
      url: `/dashboard/billing?status=success&plan=${planId}`,
      success: true,
      demo: true,
      plan: planConfig,
      message: `تم تفعيل ${planConfig.name} بنجاح!`,
    });

    response.cookies.set("traders_demo_session", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء الاتصال ببوابة الدفع" },
      { status: 500 }
    );
  }
}