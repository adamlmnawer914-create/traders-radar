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

  // 1. Sync or fetch user with real data from database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
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
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${clerkId}@tradersradar.com`;
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
            slug: `store-${clerkId.slice(-6).toLowerCase()}`,
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

    // Seed sample initial data if new store has 0 products
    const initialStore = dbUser.stores[0];
    if (initialStore) {
      await prisma.product.createMany({
        data: [
          { name: "حقيبة ظهر رياضية ذكية", sellingPrice: 65, costPrice: 28, stock: 45, storeId: initialStore.id, category: "إكسسوارات" },
          { name: "ساعة ذكية مقاومة للماء", sellingPrice: 120, costPrice: 55, stock: 8, storeId: initialStore.id, category: "إلكترونيات" },
          { name: "شاحن متنقل فائق السرعة", sellingPrice: 35, costPrice: 14, stock: 3, storeId: initialStore.id, category: "شواحن" },
          { name: "سماعات بلوتوث عازلة للضوضاء", sellingPrice: 85, costPrice: 38, stock: 25, storeId: initialStore.id, category: "صوتيات" },
        ],
      });

      await prisma.order.createMany({
        data: [
          { orderNumber: "ORD-101", customerName: "أحمد المنصور", totalAmount: 185, profitAmount: 92, status: "DELIVERED", storeId: initialStore.id },
          { orderNumber: "ORD-102", customerName: "سارة العتيبي", totalAmount: 120, profitAmount: 65, status: "PROCESSING", storeId: initialStore.id },
          { orderNumber: "ORD-103", customerName: "خالد بن فيصل", totalAmount: 65, profitAmount: 37, status: "DELIVERED", storeId: initialStore.id },
        ],
      });

      dbUser = (await prisma.user.findUnique({
        where: { clerkId },
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
      }))!;
    }
  }

  // 2. User subscription check
  const subscription = await getUserSubscription(dbUser.id);

  // 3. Real live analytics aggregation across all stores
  const totalStores = dbUser.stores.length;
  const totalProducts = dbUser.stores.reduce((acc, s) => acc + s._count.products, 0);
  const totalOrders = dbUser.stores.reduce((acc, s) => acc + s._count.orders, 0);

  const allOrders = await prisma.order.findMany({
    where: { store: { userId: dbUser.id } },
    select: { totalAmount: true, profitAmount: true, status: true, customerName: true, orderNumber: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const totalSales = allOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalProfit = allOrders.reduce((acc, o) => acc + o.profitAmount, 0);
  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0.0";
  const avgOrderValue = allOrders.length > 0 ? (totalSales / allOrders.length).toFixed(1) : "0.0";

  // Low stock products alert (<= 5 items)
  const lowStockProducts = await prisma.product.findMany({
    where: {
      store: { userId: dbUser.id },
      stock: { lte: 5 },
    },
    include: { store: { select: { name: true } } },
    take: 5,
  });

  // All recent products
  const recentProducts = await prisma.product.findMany({
    where: { store: { userId: dbUser.id } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
                  لوحة التجارة والتحليلات
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
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

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/billing"
              className={`px-3.5 py-1.5 rounded-full border text-xs font-bold transition flex items-center gap-1.5 ${
                subscription.isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{subscription.isActive ? subscription.planDetails.name : 'تفعيل الاشتراك'}</span>
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

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Unsubscribed Notice (No Free Tier) */}
        {!subscription.isActive && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/40 border-2 border-amber-500/40 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  منصة رادار التجار تقدم خدمات Premium الحصرية
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  اختر خطتك الآن (باقة البداية بـ $40، باقة المحترفين بـ $99، أو باقة VIP مدى الحياة بـ $250) لبدء إضافة وتتبع مبيعاتك الحقيقية.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/billing"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <span>اختر باقتك الآن</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Welcome Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              مرحباً بك، {userName} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              لوحة التحكم مربوطة بقاعدة البيانات الحية ومزامنة مع مبيعات متاجرك.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/billing"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-800 transition flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>إدارة الفواتير</span>
            </Link>
          </div>
        </div>

        {/* Real Dynamic Metrics Cards (USD) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Sales */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">إجمالي المبيعات</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">$` + totalSales.toLocaleString() + `</span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>مبيعات حقيقية موثقة</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">صافي الأرباح المحققة</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">$` + totalProfit.toLocaleString() + `</span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <div className="mt-3 text-xs text-indigo-400 flex items-center gap-1">
              <span>هامش الربح: ` + profitMargin + `%</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">إجمالي الطلبات</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">` + totalOrders + `</span>
              <span className="text-xs text-slate-400">طلب</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              متوسط الطلب: $` + avgOrderValue + `
            </div>
          </div>

          {/* Total Products */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">المنتجات النشطة بالمخزن</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">` + totalProducts + `</span>
              <span className="text-xs text-slate-400">منتج</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              مربوطة بـ ` + totalStores + ` متجر
            </div>
          </div>
        </section>

        {/* Live Stores & Low Stock Alerts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stores */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                <span>متاجرك النشطة (` + totalStores + `)</span>
              </h2>
            </div>

            <div className="space-y-3">
              {dbUser.stores.map((store) => (
                <div
                  key={store.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                      {store.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{store.name}</h4>
                      <p className="text-xs text-slate-500">معرف المتجر: {store.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    <div>
                      <span className="font-bold text-white">{store._count.products}</span> منتجات
                    </div>
                    <div>
                      <span className="font-bold text-white">{store._count.orders}</span> طلبات
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px]">
                      نشط ومتصل
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>تنبيهات انخفاض المخزون</span>
              </h2>
              <span className="text-xs font-semibold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {lowStockProducts.length} منتجات
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/40 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                كافة مستويات المخزون كافية وآمنة!
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">{p.name}</h5>
                      <span className="text-[10px] text-slate-500">سعر البيع: ${p.sellingPrice}</span>
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

        {/* Live Products & Orders Table */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
                <span>آخر المبيعات والطلبات الحية</span>
              </h2>
            </div>

            <div className="space-y-2.5">
              {allOrders.slice(0, 5).map((order, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{order.customerName}</span>
                    <span className="text-[11px] text-slate-500">{order.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-400 block">+${order.profitAmount} ربح</span>
                    <span className="text-[10px] text-slate-500">إجمالي: ${order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Products */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <span>أحدث المنتجات المسجلة في النظام</span>
              </h2>
            </div>

            <div className="space-y-2.5">
              {recentProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-slate-500">التكلفة: ${p.costPrice} | البيع: ${p.sellingPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-indigo-400 block">هامش: +${(p.sellingPrice - p.costPrice).toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400">المخزون: {p.stock} قطعة</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
