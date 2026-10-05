import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const isStripeConfigured = Boolean(
  stripeSecretKey &&
  !stripeSecretKey.includes("YOUR_STRIPE_SECRET_KEY") &&
  stripeSecretKey.startsWith("sk_")
);

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey!, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })
  : null;

export interface PlanConfig {
  id: "FREE" | "PRO" | "ENTERPRISE";
  name: string;
  nameEn: string;
  badge?: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  priceIdMonthly?: string;
  priceIdYearly?: string;
  features: string[];
  limits: {
    stores: number; // -1 means unlimited
    products: number;
    orders: number;
  };
}

export const PLANS: Record<"FREE" | "PRO" | "ENTERPRISE", PlanConfig> = {
  FREE: {
    id: "FREE",
    name: "الباقة المجانية",
    nameEn: "Free",
    description: "مثالية لتجربة المنصة وإطلاق أول متجر إلكتروني لك",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "SAR",
    features: [
      "متجر إلكتروني واحد",
      "حتى 50 منتج نشط",
      "حتى 100 طلب شهرياً",
      "تقارير وإحصائيات أرباح أساسية",
      "تنبيهات انخفاض المخزون",
      "حساب تلقائي لهامش الربح",
    ],
    limits: { stores: 1, products: 50, orders: 100 },
  },
  PRO: {
    id: "PRO",
    name: "باقة المحترفين",
    nameEn: "Pro",
    badge: "الأكثر شعبية ⭐",
    description: "للتجار النشطين الباحثين عن النمو والأتمتة والتحليلات المتقدمة",
    priceMonthly: 99,
    priceYearly: 890,
    currency: "SAR",
    priceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    priceIdYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    features: [
      "حتى 5 متاجر إلكترونية",
      "منتجات غير محدودة",
      "طلبات ومبيعات غير محدودة",
      "لوحة تحليل أرباح ذكية ومتقدمة",
      "تنبيهات فورية عند وصول المنتجات للحد الأدنى",
      "تصدير التقارير إلى Excel و PDF",
      "دعم فني ذو أولوية 24/7",
    ],
    limits: { stores: 5, products: -1, orders: -1 },
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    name: "باقة المؤسسات",
    nameEn: "Enterprise",
    badge: "أقصى طاقة 🚀",
    description: "للشركات وسلاسل المتاجر التي تتطلب تخصيصاً وربطاً شاملاً",
    priceMonthly: 299,
    priceYearly: 2690,
    currency: "SAR",
    priceIdMonthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    priceIdYearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
    features: [
      "متاجر إلكترونية غير محدودة",
      "منتجات وطلبات ومبيعات غير محدودة",
      "ربط API مخصص ومباشر",
      "لوحات بيانات متعددة الفروع والعملات",
      "مدير حساب شخصي مخصص",
      "اتفاقية مستوى الخدمة SLA 99.9%",
      "تخصيص كامل للتقارير والواجهة",
    ],
    limits: { stores: -1, products: -1, orders: -1 },
  },
};

export type PlanType = keyof typeof PLANS;

/**
 * Get or initialize user subscription from database
 */
export async function getUserSubscription(userId: string) {
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: "FREE",
        status: "ACTIVE",
      },
    });
  }

  const planKey = (subscription.plan as PlanType) in PLANS ? (subscription.plan as PlanType) : "FREE";
  const planDetails = PLANS[planKey];
  const isPaid = (planKey === "PRO" || planKey === "ENTERPRISE") && subscription.status === "ACTIVE";

  return {
    ...subscription,
    planDetails,
    isPaid,
    isPro: planKey === "PRO",
    isEnterprise: planKey === "ENTERPRISE",
    isFree: planKey === "FREE",
  };
}

/**
 * Check if the user is allowed to perform an action according to their subscription limits
 */
export async function checkPlanLimits(
  userId: string,
  action: "create_store" | "create_product" | "create_order"
): Promise<{ allowed: boolean; message?: string; limit?: number; current?: number }> {
  const sub = await getUserSubscription(userId);
  const limits = sub.planDetails.limits;

  if (action === "create_store") {
    if (limits.stores === -1) return { allowed: true };
    const currentStores = await prisma.store.count({ where: { userId } });
    if (currentStores >= limits.stores) {
      return {
        allowed: false,
        message: `وصلت إلى الحد الأقصى للمتاجر في خطتك الحالية (${limits.stores} متجر). يرجى الترقية لإضافة المزيد.`,
        limit: limits.stores,
        current: currentStores,
      };
    }
    return { allowed: true, limit: limits.stores, current: currentStores };
  }

  if (action === "create_product") {
    if (limits.products === -1) return { allowed: true };
    const currentProducts = await prisma.product.count({
      where: { store: { userId } },
    });
    if (currentProducts >= limits.products) {
      return {
        allowed: false,
        message: `وصلت إلى الحد الأقصى للمنتجات في خطتك الحالية (${limits.products} منتج). يرجى الترقية لمنتجات غير محدودة.`,
        limit: limits.products,
        current: currentProducts,
      };
    }
    return { allowed: true, limit: limits.products, current: currentProducts };
  }

  if (action === "create_order") {
    if (limits.orders === -1) return { allowed: true };
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const currentOrders = await prisma.order.count({
      where: {
        store: { userId },
        createdAt: { gte: startOfMonth },
      },
    });

    if (currentOrders >= limits.orders) {
      return {
        allowed: false,
        message: `وصلت إلى الحد الأقصى للطلبات هذا الشهر (${limits.orders} طلب). يرجى الترقية لطلبات غير محدودة.`,
        limit: limits.orders,
        current: currentOrders,
      };
    }
    return { allowed: true, limit: limits.orders, current: currentOrders };
  }

  return { allowed: true };
}
