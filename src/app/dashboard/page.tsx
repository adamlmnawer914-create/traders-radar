import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
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
  ArrowUpRight,
  Store,
  CreditCard,
  Crown,
  Sparkles,
  Layers,
  ChevronLeft,
  Plus
} from "lucide-react";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const userName = clerkUser?.firstName || clerkUser?.username || "التاجر المتميز";
  const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || "";

  // Sync user to database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      stores: {
        include: {
          _count: { select: { products: true, orders: true } },
          orders: { orderBy: { createdAt: "desc" }, take: 5 },
          products: { take: 5 },
        },
      },
    },
  });

  if (!dbUser) {
    // Auto-create user on first login
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@unknown.com`;
    const name = `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || null;
    dbUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        name,
        imageUrl: clerkUser?.imageUrl,
        stores: {
          create: {
            name: name ? `متجر ${name}` : "متجري الأول",
            slug: `store-${clerkId.slice(-8).toLowerCase()}`,
          },
        },
      },
      include: {
        stores: {
          include: {
            _count: { select: { products: true, orders: true } },
            orders: { orderBy: { createdAt: "desc" }, take: 5 },
            products: { take: 5 },
          },
        },
      },
    });
  }

  // Get user subscription info
  const subscription = await getUserSubscription(dbUser.id);

  // Aggregate stats across all user stores
  const totalStores = dbUser.stores.length;
  const totalProducts = dbUser.stores.reduce((acc, s) => acc + s._count.products, 0);
  const totalOrders = dbUser.stores.reduce((acc, s) => acc + s._count.orders, 0);

  // Total sales and profits
  const allOrders = await prisma.order.findMany({
    where: { store: { userId: dbUser.id } },
    select: { totalAmount: true, profitAmount: true, status: true },
  });

  const totalSales = allOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalProfit = allOrders.reduce((acc, o) => acc + o.profitAmount, 0);
  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0.0";

  // Low stock products alert
  const lowStockProducts = await prisma.product.findMany({
    where: {
      store: { userId: dbUser.id },
      stock: { lte: 5 },
    },
    include: { store: { select: { name: true } } },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  رادار التجار
                </span>
                <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  لوحة التجارة الذكية
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
              >
                نظرة عامة
              </Link>
              <Link
                href="/dashboard/billing"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                <span>الاشتراكات والفوترة</span>
              </Link>
            </nav>
          </div>

          {/* User & Plan Pill */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/billing"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 transition text-xs font-bold text-slate-200"
            >
              <Crown className="w-3.5 h-3.5 text-indigo-400" />
              <span>{subscription.planDetails.name}</span>
              {subscription.isFree && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-[10px] text-white">
                  ترقية
                </span>
              )}
            </Link>

            <div className="border-l border-slate-800 pl-4 flex items-center gap-3">
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-white">{userName}</div>
                <div className="text-[10px] text-slate-500 max-w-[120px] truncate">{userEmail}</div>
              </div>
              <UserButton
                                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 ring-2 ring-indigo-500/30",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              مرحباً بك، {userName} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              إليك ملخص أداء متاجرك الإلكترونية وصافي أرباحك لليوم.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/billing"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>إدارة الباقة والاشتراك</span>
            </Link>
          </div>
        </div>

        {/* Free Plan Upgrade Promo Banner (if free) */}
        {subscription.isFree && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  أنت حالياً على الباقة المجانية - ارتقِ بتجارتك إلى مستوى أعلى!
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  احصل على 5 متاجر، منتجات وطلبات غير محدودة، وتصدير التقارير بضغطة زر عبر باقة المحترفين.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/billing"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 relative z-10 shrink-0"
            >
              <span>ترقية الآن مقابل 99 ر.س</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Key Performance Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Sales */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">إجمالي المبيعات</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{totalSales.toLocaleString('ar-SA')}</span>
              <span className="text-xs text-slate-400">ر.س</span>
            </div>
            <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>مبيعات موثقة في قاعدة البيانات</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">صافي الأرباح</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{totalProfit.toLocaleString('ar-SA')}</span>
              <span className="text-xs text-slate-400">ر.س</span>
            </div>
            <div className="mt-3 text-xs text-indigo-400 flex items-center gap-1">
              <span>هامش ربح تقريبي: {profitMargin}%</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">عدد الطلبات</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{totalOrders}</span>
              <span className="text-xs text-slate-400">طلب</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              عبر {totalStores} متجر إلكتروني
            </div>
          </div>

          {/* Total Products */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">إجمالي المنتجات</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{totalProducts}</span>
              <span className="text-xs text-slate-400">منتج</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              مربوطة بالمخزون المباشر
            </div>
          </div>
        </section>

        {/* Stores & Low Stock Alerts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stores List */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                <span>متاجرك الإلكترونية ({totalStores})</span>
              </h2>
              <span className="text-xs text-slate-400">
                الحد الأقصى لخطتك: {subscription.planDetails.limits.stores === -1 ? 'غير محدود' : subscription.planDetails.limits.stores}
              </span>
            </div>

            <div className="space-y-3">
              {dbUser.stores.map((store) => (
                <div
                  key={store.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm">
                      {store.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{store.name}</h4>
                      <p className="text-xs text-slate-500">معرف المتجر: {store.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    <div>
                      <span className="font-bold text-white">{store._count.products}</span> منتج
                    </div>
                    <div>
                      <span className="font-bold text-white">{store._count.orders}</span> طلب
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px]">
                      متصل ونشط
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>تنبيهات المخزون</span>
              </h2>
              <span className="text-xs font-semibold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {lowStockProducts.length} منتجات
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/40 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                جميع المنتجات بمستويات مخزون آمنة!
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">{p.name}</h5>
                      <span className="text-[10px] text-slate-500">{p.store.name}</span>
                    </div>
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                      متبقي {p.stock} فقط
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
