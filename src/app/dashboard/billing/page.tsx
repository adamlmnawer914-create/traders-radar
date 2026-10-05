'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  ShoppingBag,
  Package,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  HelpCircle,
  Clock,
  Check,
  Crown
} from 'lucide-react';

interface PlanLimit {
  stores: number;
  products: number;
  orders: number;
}

interface Plan {
  id: 'FREE' | 'PRO' | 'ENTERPRISE';
  name: string;
  nameEn: string;
  badge?: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  limits: PlanLimit;
}

interface SubscriptionData {
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: string;
  currentPeriodEnd: string | null;
  planDetails: Plan;
  isPaid: boolean;
  isPro: boolean;
  isEnterprise: boolean;
  isFree: boolean;
}

interface UsageData {
  stores: number;
  products: number;
  orders: number;
}

function BillingContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  const planParam = searchParams.get('plan');

  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [data, setData] = useState<{
    subscription: SubscriptionData;
    usage: UsageData;
    plans: Record<string, Plan>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
    if (statusParam === 'success') {
      setNotification(`تهانينا! تم تفعيل ${planParam === 'ENTERPRISE' ? 'باقة المؤسسات' : 'باقة المحترفين'} بنجاح! 🎉`);
    } else if (statusParam === 'cancelled') {
      setNotification('تم إلغاء عملية الدفع. يمكنك المحاولة في أي وقت.');
    }
  }, [statusParam, planParam]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/subscription');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (planId: 'PRO' | 'ENTERPRISE') => {
    try {
      setLoadingPlan(planId);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, interval }),
      });

      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        alert(result.error);
      }
    } catch (err) {
      alert('حدث خطأ أثناء الانتقال لبوابة الدفع');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePortal = async () => {
    try {
      setPortalLoading(true);
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert(result.message || 'لا تتوفر بوابة فوترة في وضع التجربة');
      }
    } catch (err) {
      alert('تعذر فتح بوابة الفوترة');
    } finally {
      setPortalLoading(false);
    }
  };

  const currentPlan = data?.subscription?.plan || 'FREE';
  const plans = data?.plans;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للوحة التحكم</span>
            </Link>
            <div className="h-5 w-px bg-slate-800 mx-2 hidden sm:block" />
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span>الاشتراكات وإدارة الفوترة</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              {currentPlan === 'FREE' ? 'الباقة المجانية' : currentPlan === 'PRO' ? 'باقة المحترفين' : 'باقة المؤسسات'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Notification Banner */}
        {notification && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <p className="text-sm font-medium">{notification}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs text-indigo-300 hover:text-white px-2 py-1"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Current Plan Overview Card */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/60">
                  خطتك الحالية
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2 flex items-center gap-3">
                  {data?.subscription?.planDetails?.name || 'الباقة المجانية'}
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    نشطة ومفعلة
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {data?.subscription?.planDetails?.description}
                </p>
              </div>

              {currentPlan !== 'FREE' && (
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-200 border border-slate-700 transition flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{portalLoading ? 'جارِ التحميل...' : 'إدارة الفواتير والبطاقة'}</span>
                </button>
              )}
            </div>

            {/* Usage Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 relative z-10">
              {/* Stores Usage */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    المتاجر
                  </span>
                  <span className="font-bold text-white">
                    {data?.usage?.stores || 0} / {data?.subscription?.planDetails?.limits?.stores === -1 ? '∞' : data?.subscription?.planDetails?.limits?.stores || 1}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        data?.subscription?.planDetails?.limits?.stores === -1
                          ? 20
                          : ((data?.usage?.stores || 0) / (data?.subscription?.planDetails?.limits?.stores || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Products Usage */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                    المنتجات
                  </span>
                  <span className="font-bold text-white">
                    {data?.usage?.products || 0} / {data?.subscription?.planDetails?.limits?.products === -1 ? '∞' : data?.subscription?.planDetails?.limits?.products || 50}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        data?.subscription?.planDetails?.limits?.products === -1
                          ? 15
                          : ((data?.usage?.products || 0) / (data?.subscription?.planDetails?.limits?.products || 50)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Orders Usage */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    الطلبات الشهرية
                  </span>
                  <span className="font-bold text-white">
                    {data?.usage?.orders || 0} / {data?.subscription?.planDetails?.limits?.orders === -1 ? '∞' : data?.subscription?.planDetails?.limits?.orders || 100}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        data?.subscription?.planDetails?.limits?.orders === -1
                          ? 10
                          : ((data?.usage?.orders || 0) / (data?.subscription?.planDetails?.limits?.orders || 100)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Support / Guarantee Card */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">أمان ومدفوعات موثوقة</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                تتم معالجة كافة العمليات المالية عبر بوابة <strong className="text-slate-200">Stripe العالمية</strong> بتشفير مصرفي متقدم 256-bit. بيانات بطاقتك لا يتم تخزينها أبداً على خوادمنا.
              </p>
            </div>

            <div className="space-y-2 pt-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>إلغاء الاشتراك متاح في أي لحظة بضغطة زر</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>ترقية فورية دون انقطاع عن العمل</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>فواتير ضريبية نظامية تصدر تلقائياً</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              اختر الخطة المناسبة لحجم تجارتك
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              ابدأ مجاناً وقم بالترقية مع نمو مبيعاتك للحصول على متاجر متعددة وإمكانيات تحليل غير محدودة.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl mt-4">
              <button
                onClick={() => setInterval('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  interval === 'monthly'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                الدفع الشهري
              </button>
              <button
                onClick={() => setInterval('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  interval === 'yearly'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>الدفع السنوي</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  وفّر 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition relative">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">الباقة المجانية</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300">تجربة مجانية</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">مثالية لتجربة المنصة وإطلاق أول متجر إلكتروني لك</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">0</span>
                    <span className="text-sm text-slate-400">ر.س / للأبد</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-800/80 pt-6">
                  {[
                    'متجر إلكتروني واحد',
                    'حتى 50 منتج نشط',
                    'حتى 100 طلب شهرياً',
                    'تقارير وإحصائيات أرباح أساسية',
                    'تنبيهات انخفاض المخزون',
                    'حساب تلقائي لهامش الربح',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  disabled={currentPlan === 'FREE'}
                  className="w-full py-3 rounded-2xl text-xs font-bold transition bg-slate-800 text-slate-400 cursor-not-allowed"
                >
                  {currentPlan === 'FREE' ? 'خطتك الحالية' : 'الباقة الأساسية'}
                </button>
              </div>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900/90 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 flex flex-col justify-between relative scale-105">
              <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[11px] font-black text-white uppercase tracking-wider shadow-lg shadow-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                الأكثر اختياراً وطلباً
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 mt-2">
                  <h3 className="text-xl font-bold text-white">باقة المحترفين</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    للتجار الطموحين
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-6">للتجار النشطين الباحثين عن النمو والأتمتة والتحليلات المتقدمة</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {interval === 'yearly' ? '890' : '99'}
                    </span>
                    <span className="text-sm text-slate-400">
                      ر.س / {interval === 'yearly' ? 'سنوياً' : 'شهرياً'}
                    </span>
                  </div>
                  {interval === 'yearly' && (
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                      وفرت 298 ر.س مقارنة بالدفع الشهري!
                    </span>
                  )}
                </div>

                <div className="space-y-3 border-t border-indigo-900/40 pt-6">
                  {[
                    'حتى 5 متاجر إلكترونية',
                    'منتجات غير محدودة ∞',
                    'طلبات ومبيعات غير محدودة ∞',
                    'لوحة تحليل أرباح ذكية ومتقدمة',
                    'تنبيهات فورية عند وصول المنتجات للحد الأدنى',
                    'تصدير التقارير إلى Excel و PDF',
                    'دعم فني ذو أولوية 24/7',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-100 font-medium">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCheckout('PRO')}
                  disabled={loadingPlan === 'PRO' || currentPlan === 'PRO'}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xl ${
                    currentPlan === 'PRO'
                      ? 'bg-slate-800 text-indigo-300 cursor-default'
                      : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/25 active:scale-[0.98]'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {loadingPlan === 'PRO'
                      ? 'جارِ التحويل...'
                      : currentPlan === 'PRO'
                      ? 'خطتك الحالية المفعلة'
                      : 'ترقية إلى باقة المحترفين الآن'}
                  </span>
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition relative">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">باقة المؤسسات</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-purple-300 border border-purple-800/40">
                    للشركات الكبرى
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6">للشركات وسلاسل المتاجر التي تتطلب تخصيصاً وربطاً شاملاً</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {interval === 'yearly' ? '2690' : '299'}
                    </span>
                    <span className="text-sm text-slate-400">
                      ر.س / {interval === 'yearly' ? 'سنوياً' : 'شهرياً'}
                    </span>
                  </div>
                  {interval === 'yearly' && (
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                      وفرت 898 ر.س سنوياً!
                    </span>
                  )}
                </div>

                <div className="space-y-3 border-t border-slate-800/80 pt-6">
                  {[
                    'متاجر إلكترونية غير محدودة ∞',
                    'منتجات وطلبات ومبيعات غير محدودة ∞',
                    'ربط API مخصص ومباشر',
                    'لوحات بيانات متعددة الفروع والعملات',
                    'مدير حساب شخصي مخصص 24/7',
                    'اتفاقية مستوى الخدمة SLA 99.9%',
                    'تخصيص كامل للتقارير والواجهة',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCheckout('ENTERPRISE')}
                  disabled={loadingPlan === 'ENTERPRISE' || currentPlan === 'ENTERPRISE'}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    currentPlan === 'ENTERPRISE'
                      ? 'bg-slate-800 text-purple-300 border-purple-800 cursor-default'
                      : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border-purple-800/60 active:scale-[0.98]'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {loadingPlan === 'ENTERPRISE'
                      ? 'جارِ التحويل...'
                      : currentPlan === 'ENTERPRISE'
                      ? 'خطتك الحالية'
                      : 'الترقية للمؤسسات'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>الأسئلة الشائعة حول الاشتراكات</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-sm">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <h4 className="font-bold text-white mb-1">هل يمكنني إلغاء الاشتراك في أي وقت؟</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                نعم، بكل تأكيد. يمكنك إلغاء اشتراكك في أي لحظة عبر لوحة إدارة الفوترة بدون أي رسوم خفية أو تعقيدات.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <h4 className="font-bold text-white mb-1">ماذا يحدث إذا تجاوزت حدود خطتي؟</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                لن يتم حظر حسابك. سننبهك بلطف بضرورة الترقية إلى الباقة التالية لتتمكن من إضافة متاجر أو منتجات إضافية.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <h4 className="font-bold text-white mb-1">ما هي طرق الدفع المقبولة؟</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                نقبل جميع بطاقات مدى، فيزا، ماستركارد، وأبل باي عبر بوابة Stripe المعتمدة والآمنة 100%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <h4 className="font-bold text-white mb-1">هل تتوفر فواتير ضريبية لشركتي؟</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                نعم، يتم إنشاء وإرسال فاتورة ضريبية رسمية تلقائياً لبريدك الإلكتروني مع كل عملية دفع متكررة.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>جارِ تحميل صفحة الاشتراكات والفوترة...</span>
        </div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
