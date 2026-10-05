import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET || !stripe) {
    return NextResponse.json({ error: "Webhook secret or stripe not configured" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as any;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId || "PRO";

        if (userId) {
          const subscriptionId = session.subscription as string;
          let currentPeriodEnd: Date | undefined;

          if (subscriptionId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            currentPeriodEnd = (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000) : undefined;
          }

          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscriptionId,
              plan: planId,
              status: "ACTIVE",
              currentPeriodEnd,
            },
            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscriptionId,
              plan: planId,
              status: "ACTIVE",
              currentPeriodEnd,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status === "active" ? "ACTIVE" : subscription.status.toUpperCase(),
            currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : undefined,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan: "FREE",
            status: "CANCELED",
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (dbError) {
    console.error("Database update error on webhook:", dbError);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
