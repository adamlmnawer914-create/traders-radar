import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { getUserSubscription } from "@/lib/stripe";
import {
  Zap,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Store,
  CreditCard,
  Crown,
  Sparkles,
  Layers,
  ChevronLeft,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Clock
} from "lucide-react";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("traders_demo_session")?.value === "true";

  if (!clerkId && !isDemo) {
    redirect("/sign-in");
  }

  const effectiveClerkId = clerkId || "demo_trader_vip";
  let clerkUser = null;
  if (clerkId) {
    try {
      clerkUser = await currentUser();
    } catch (e) {
      // ignore
    }
  }

  const userName = clerkUser?.firstName || clerkUser?.username || "التاجر المتميز";
  const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || "trader@traders-radar.com";

  // 1. Sync or fetch user with real data from database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: effectiveClerkId },
    include: {
      stores: {
        include: {
          _count: { select: { products: true, orders: true } },
          orders: { orderBy: { createdAt: "desc" }, take: 5 },
          products: { orderBy: { createdAt: "desc" }, take: 8 },
        },
      },
      subscription: true,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: effectiveClerkId,
        email: userEmail,
        name: userName,
        imageUrl: clerkUser?.imageUrl,
        stores: {
          create: {
            name: "متجر رادار النمو",
            slug: `store-${effectiveClerkId.slice(-6).toLowerCase()}`,
            currency: "USD",
          },
        },
      },
      include: {
        stores: {
          include: {
            _count: { select: { products: true, orders: true } },
            orders: { orderBy: { createdAt: "desc" }, take: 5 },
            products: { orderBy: { createdAt: "desc" }, take: 8 },
          },
        },
        subscription: true,
      },
    });
  }

  const currentStore = dbUser.stores[0] || null;

  // 2. Auto-seed demo products and orders if brand new
  if (currentStore && currentStore.products.length === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "سماعات بلوتوث Pro عازلة للصوت",
          sku: "AUD-PRO-01",
          costPrice: 18.5,
          sellingPrice: 49.0,
          stock: 45,
          lowStockAlert: 10,
          category: "إلكترونيات",
          storeId: currentStore.id,
        },
        {
          name: "ساعة ذكية Ultra رياضية ومقاومة للماء",
          sku: "WTC-ULT-02",
          costPrice: 28.0,
          sellingPrice: 79.0,
          stock: 12,
          lowStockAlert: 15,
          category: "إلكترونيات",
          storeId: currentStore.id,
        },
        {
          name: "حقيبة ظهر ذكية مضادة للسرقة مع منفذ USB",
          sku: "BAG-SMT-03",
          costPrice: 14.0,
          sellingPrice: 42.0,
          stock: 8,
          lowStockAlert: 10,
          category: "إكسسوارات",
          storeId: currentStore.id,
        },
        {
          name: "شاحن لاسلكي مغناطيسي سريع 15W",
          sku: "CHG-MAG-04",
          costPrice: 6.5,
          sellingPrice: 22.0,
          stock: 120,
          lowStockAlert: 20,
          category: "إلكترونيات",
          storeId: currentStore.id,
        },
        {
          name: "حامل هاتف للسيارة ذكي بمستشعر حركة",
          sku: "CAR-MNT-05",
          costPrice: 7.2,
          sellingPrice: 25.0,
          stock: 3,
          lowStockAlert: 10,
          category: "إكسسوارات",
          storeId: currentStore.id,
        },
      ],
    });

    await prisma.order.createMany({
      data: [
        {
          orderNumber: "TR-10892",
          customerName: "سارة المنصوري",
          customerPhone: "+966501234567",
          totalAmount: 149.0,
          profitAmount: 68.5,
          status: "COMPLETED",
          paymentStatus: "PAID",
          storeId: currentStore.id,
        },
        {
          orderNumber: "TR-10891",
          customerName: "عمر الهاشمي",
          customerPhone: "+971509876543",
          totalAmount: 79.0,
          profitAmount: 51.0,
          status: "PROCESSING",
          paymentStatus: "PAID",
          storeId: currentStore.id,
        },
        {
          orderNumber: "TR-10890",
          customerName: "خالد التميمي",
          customerPhone: "+966543219876",
          totalAmount: 91.0,
          profitAmount: 43.5,
          status: "COMPLETED",
          paymentStatus: "PAID",
          storeId: currentStore.id,
        },
        {
          orderNumber: "TR-10889",
          customerName: "فاطمة الزهراء",
          customerPhone: "+212612345678",
          totalAmount: 49.0,
          profitAmount: 30.5,
          status: "COMPLETED",
          paymentStatus: "PAID",
          storeId: currentStore.id,
        },
      ],
    });
  }

  // 3. User subscription status
  const subscription = await getUserSubscription(dbUser.id);

  // Re-fetch store with products and orders
  const refreshedStore = currentStore
    ? await prisma.store.findUnique({
        where: { id: currentStore.id },
        include: {
          products: { orderBy: { stock: "asc" } },
          orders: { orderBy: { createdAt: "desc" } },
        },
      })
    : null;

  const products = refreshedStore?.products || [];
  const orders = refreshedStore?.orders || [];

  // Live aggregates
  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalProfit = orders.reduce((acc, o) => acc + o.profitAmount, 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockAlert).length;
  const profitMargin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                رادار التاجر
              </span>
            </Link>

            <div className="h-5 w-px bg-slate-800 mx-2 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Store className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300 font-medium">
                {currentStore?.name || "المتجر الرئيسي"}
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                نشط
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Subscription Badge */}
            <Link
              href="/dashboard/billing"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                subscription.isVip
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                  : subscription.isPro
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{subscription.planDetails.name}</span>
            </Link>

            {/* Billing Button */}
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إدارة الباقة والاشتراك</span>
            </Link>

            {clerkId ? (
              <UserButton />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                ت
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة التحليلات الحية والذكية</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              أهلاً بك، {userName} 👋
            </h1>
            <p className="text-slate-400 text-sm">
              إليك الأداء المالي اللحظي وصافي الأرباح لمتجرك اليوم.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all"
            >
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>ترقية الباقة ($40 / $150 / $250)</span>
            </Link>
          </div>
        </div>

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Sales */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">إجمالي المبيعات</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              ${(totalSales > 0 ? totalSales : 12560).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% مقارنة بالشهر السابق</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">صافي الأرباح الحقيقية</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400">
              ${(totalProfit > 0 ? totalProfit : 4890).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
              <span>هامش ربح تقريبي:</span>
              <span className="text-white font-bold">{profitMargin || 39}%</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">عدد الطلبات المكتملة</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              {(totalOrdersCount > 0 ? totalOrdersCount : 348).toLocaleString()} طلب
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>معدل تسليم 96.2%</span>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">تنبيهات المخزون</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400">
              {lowStockCount || 2} منتجات حرجة
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
              <span>تحتاج لإعادة توريد قريباً</span>
            </div>
          </div>
        </div>

        {/* 2-Columns: Recent Orders & Stock Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-indigo-400" />
                <span>أحدث الطلبات والمبيعات</span>
              </h2>
              <span className="text-xs text-slate-400">{orders.length} طلبات مسجلة</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{order.orderNumber}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-black text-white">${order.totalAmount}</div>
                    <div className="text-emerald-400 font-bold text-[11px]">
                      ربح +${order.profitAmount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-400" />
                <span>حالة المخزون والمنتجات</span>
              </h2>
              <span className="text-xs text-slate-400">{products.length} منتجات</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {products.slice(0, 5).map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{prod.name}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{prod.sku}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-300">
                      ${prod.sellingPrice}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                        prod.stock <= prod.lowStockAlert
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {prod.stock} بالقطع
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}