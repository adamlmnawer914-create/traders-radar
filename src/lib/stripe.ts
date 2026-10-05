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
  id: "STARTER" | "PRO" | "VIP";
  name: string;
  nameEn: string;
  badge?: string;
  description: string;
  price: number; // in USD
  isLifetime?: boolean;
  currency: string;
  features: string[];
  limits: {
    stores: number; // -1 means unlimited
    products: number;
    orders: number;
  };
}

export const PLANS: Record<"STARTER" | "PRO" | "VIP", PlanConfig> = {
  STARTER: {
    id: "STARTER",
    name: "باقة البداية (Starter)",
    nameEn: "Starter",
    description: "مثالية للمتاجر الناشئة ورواد التجارة المبتدئين",
    price: 40,
    currency: "USD",
    features: [
      "متجر إلكتروني واحد متصل (1 Store)",
      "حتى 250 منتج نشط في المخزون",
      "حتى 1,000 طلب ومبيعة شهرياً",
      "حساب تلقائي لهامش وصافي الأرباح بدقة",
      "تنبيهات انخفاض المخزون اللحظية",
      "تقارير المبيعات والأداء الأساسية",
      "دعم فني عبر البريد الإلكتروني",
    ],
    limits: { stores: 1, products: 250, orders: 1000 },
  },
  PRO: {
    id: "PRO",
    name: "باقة المحترفين (Pro)",
    nameEn: "Pro",
    badge: "الأكثر اختياراً ⭐",
    description: "للتجار النشطين الباحثين عن النمو السريع وأتمتة الأرباح",
    price: 99,
    currency: "USD",
    features: [
      "حتى 5 متاجر إلكترونية متعددة العملات",
      "منتجات غير محدودة ∞ في المخزون",
      "طلبات ومبيعات غير محدودة ∞ شهرياً",
      "لوحة تحليل أرباح ذكية وتنبؤات AI بالمبيعات",
      "تنبيهات استباقية ذكية عند انخفاض المخزون",
      "تصدير التقارير المالية إلى Excel و PDF بضغطة زر",
      "دعم فني متميز ذو أولوية 24/7",
    ],
    limits: { stores: 5, products: -1, orders: -1 },
  },
  VIP: {
    id: "VIP",
    name: "باقة VIP مدى الحياة (VIP Lifetime)",
    nameEn: "VIP Lifetime",
    badge: "عرض إطلاق حصري 👑",
    description: "وصول غير محدود لمدى الحياة بدون أي اشتراكات أو فواتير شهرية نهائياً",
    price: 250,
    isLifetime: true,
    currency: "USD",
    features: [
      "وصول كامل لمدى الحياة (دفعة واحدة فقط)",
      "متاجر إلكترونية غير محدودة ∞",
      "منتجات وطلبات ومبيعات غير محدودة ∞",
      "ربط API مخصص ومباشر مع متاجرك",
      "مدير حساب شخصي مخصص على مدار الساعة",
      "كافة التحديثات والميزات المستقبلية مجاناً للأبد",
      "اتفاقية مستوى الخدمة المضمونة SLA 99.9%",
    ],
    limits: { stores: -1, products: -1, orders: -1 },
  },
};

export type PlanType = keyof typeof PLANS;

/**
 * Get or initialize user subscription from database
 * NO FREE TIER: Default status is PENDING / INACTIVE until paid
 */
export async function getUserSubscription(userId: string) {
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: "STARTER",
        status: "INACTIVE", // Requires payment, no free tier!
      },
    });
  }

  const planKey = (subscription.plan as PlanType) in PLANS ? (subscription.plan as PlanType) : "STARTER";
  const planDetails = PLANS[planKey];
  const isActive = subscription.status === "ACTIVE";

  return {
    ...subscription,
    planDetails,
    isActive,
    isStarter: planKey === "STARTER" && isActive,
    isPro: planKey === "PRO" && isActive,
    isVip: planKey === "VIP" && isActive,
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

  if (!sub.isActive) {
    return {
      allowed: false,
      message: "يلزمك الاشتراك في إحدى باقات المنصة لمتابعة النشاط وإضافة المتاجر والمنتجات.",
    };
  }

  const limits = sub.planDetails.limits;

  if (action === "create_store") {
    if (limits.stores === -1) return { allowed: true };
    const currentStores = await prisma.store.count({ where: { userId } });
    if (currentStores >= limits.stores) {
      return {
        allowed: false,
        message: `وصلت للحد الأقصى للمتاجر في خطتك (${limits.stores} متجر). قم بالترقية لفتح متاجر إضافية.`,
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
        message: `وصلت للحد الأقصى للمنتجات في خطتك (${limits.products} منتج). قم بالترقية لمنتجات غير محدودة.`,
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
        message: `وصلت للحد الأقصى للطلبات هذا الشهر (${limits.orders} طلب). قم بالترقية لطلبات غير محدودة.`,
        limit: limits.orders,
        current: currentOrders,
      };
    }
    return { allowed: true, limit: limits.orders, current: currentOrders };
  }

  return { allowed: true };
}
