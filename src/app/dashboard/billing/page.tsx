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
  Crown,
  Check,
  Flame
} from 'lucide-react';

interface PlanLimit {
  stores: number;
  products: number;
  orders: number;
}

interface Plan {
  id: 'STARTER' | 'PRO' | 'VIP';
  name: string;
  nameEn: string;
  badge?: string;
  description: string;
  price: number;
  isLifetime?: boolean;
  currency: string;
  features: string[];
  limits: PlanLimit;
}

interface SubscriptionData {
  plan: 'STARTER' | 'PRO' | 'VIP';
  status: string;
  currentPeriodEnd: string | null;
  planDetails: Plan;
  isActive: boolean;
  isStarter: boolean;
  isPro: boolean;
  isVip: boolean;
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

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
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
      const planName = planParam === 'VIP' ? 'باقة VIP مدى الحياة' : planParam === 'PRO' ? 'باقة المحترفين' : 'باقة البداية';
      setNotification(`تهانينا! تم تفعيل ${planName} بنجاح! حسابك نشط الآن بالكامل. 🎉`);
    } else if (statusParam === 'cancelled') {
      setNotification('تم إلغاء عملية الدفع.');
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

  const handleCheckout = async (planId: 'STARTER' | 'PRO' | 'VIP') => {
    try {
      setLoadingPlan(planId);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
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

  const currentPlan = data?.subscription?.plan || 'STARTER';
  const isUserActive = Boolean(data?.subscription?.isActive);

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
              <span>الاشتراكات والفوترة Premium</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${
              isUserActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Crown className="w-3.5 h-3.5" />
              {isUserActive
                ? currentPlan === 'VIP' ? 'VIP مدى الحياة 👑' : currentPlan === 'PRO' ? 'باقة المحترفين ⭐' : 'باقة البداية'
                : 'يلزمك اختيار باقة'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Notification Banner */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-sm font-medium">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs text-emerald-300 hover:text-white px-2 py-1">
              إغلاق
            </button>
          </div>
        )}

        {/* Pricing Cards Grid (USD) */}
        <section className="space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تسعير حصري بالدولار الأمريكي (USD)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              اختر خطتك المميزة وابدأ الآن
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              منصة رادار التجار تقدم خدمات استخبارات تجارية وتحليلات أرباح Premium حصرية للمشتركين.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            {/* Starter ($40) */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition relative">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">باقة البداية (Starter)</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">للمبتدئين</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">مثالية لتتبع أرباح أول متجر إلكتروني بدقة عالية</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$40</span>
                    <span className="text-sm text-slate-400">/ شهرياً</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-800/80 pt-6">
                  {[
                    'متجر إلكتروني واحد متصل (1 Store)',
                    'حتى 250 منتج نشط في المخزون',
                    'حتى 1,000 طلب ومبيعة شهرياً',
                    'حساب تلقائي لصافي وهوامش الأرباح',
                    'تنبيهات انخفاض المخزون اللحظية',
                    'دعم فني عبر البريد الإلكتروني',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCheckout('STARTER')}
                  disabled={loadingPlan === 'STARTER' || (currentPlan === 'STARTER' && isUserActive)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    currentPlan === 'STARTER' && isUserActive
                      ? 'bg-slate-800 text-indigo-400 border-indigo-900 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-600/25 active:scale-[0.98]'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {loadingPlan === 'STARTER'
                      ? 'جارِ التحويل...'
                      : currentPlan === 'STARTER' && isUserActive
                      ? 'خطتك الحالية المفعلة'
                      : 'اشترك الآن مقابل 40$'}
                  </span>
                </button>
              </div>
            </div>

            {/* Pro ($99) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/70 via-slate-900/90 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 flex flex-col justify-between relative scale-105">
              <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[11px] font-black text-white uppercase tracking-wider shadow-lg shadow-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                الأكثر اختياراً وقوة
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 mt-2">
                  <h3 className="text-xl font-bold text-white">باقة المحترفين (Pro)</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    للتجار النشطين
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-6">لتوسيع تجارتك عبر 5 متاجر وتحليلات أرباح ذكية وتنبؤات AI</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$99</span>
                    <span className="text-sm text-slate-400">/ شهرياً</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-indigo-900/40 pt-6">
                  {[
                    'حتى 5 متاجر إلكترونية متعددة العملات',
                    'منتجات غير محدودة ∞ بالمخزون',
                    'طلبات ومبيعات غير محدودة ∞',
                    'لوحة تحليل أرباح ذكية وتنبؤات AI',
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
                  disabled={loadingPlan === 'PRO' || (currentPlan === 'PRO' && isUserActive)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xl ${
                    currentPlan === 'PRO' && isUserActive
                      ? 'bg-slate-800 text-indigo-300 cursor-default'
                      : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/25 active:scale-[0.98]'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {loadingPlan === 'PRO'
                      ? 'جارِ التحويل...'
                      : currentPlan === 'PRO' && isUserActive
                      ? 'خطتك الحالية المفعلة'
                      : 'ترقية إلى Pro مقابل 99$'}
                  </span>
                </button>
              </div>
            </div>

            {/* VIP Lifetime ($250) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-950/40 via-slate-900/90 to-slate-900 border-2 border-purple-500/80 flex flex-col justify-between hover:border-purple-400 transition relative shadow-2xl shadow-purple-600/20">
              <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-[11px] font-black text-white uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                دفعة واحدة لمدى الحياة
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 mt-2">
                  <h3 className="text-xl font-bold text-white">باقة VIP مدى الحياة</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    عرض إطلاق حصري
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-6">ادفع مرة واحدة فقط وامتلك وصولاً غير محدود للأبد بدون أي تجديد شهري</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$250</span>
                    <span className="text-sm text-purple-300 font-bold mr-2">دفعة واحدة للأبد</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                    وفر مئات الدولارات من رسوم الاشتراكات السنوية!
                  </span>
                </div>

                <div className="space-y-3 border-t border-purple-900/40 pt-6">
                  {[
                    'وصول كامل لمدى الحياة بدون أي رسوم شهرية',
                    'متاجر إلكترونية غير محدودة ∞',
                    'منتجات وطلبات ومبيعات غير محدودة ∞',
                    'ربط API مخصص ومباشر',
                    'مدير حساب شخصي مخصص على مدار الساعة',
                    'كافة الميزات والتحديثات المستقبلية مجاناً للأبد',
                    'اتفاقية مستوى الخدمة SLA 99.9%',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-purple-200 font-medium">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCheckout('VIP')}
                  disabled={loadingPlan === 'VIP' || (currentPlan === 'VIP' && isUserActive)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xl ${
                    currentPlan === 'VIP' && isUserActive
                      ? 'bg-slate-800 text-purple-300 cursor-default'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/25 active:scale-[0.98]'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {loadingPlan === 'VIP'
                      ? 'جارِ التحويل...'
                      : currentPlan === 'VIP' && isUserActive
                      ? 'أنت عضو VIP لمدى الحياة 👑'
                      : 'امتلك باقة VIP مقابل 250$'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Guarantee */}
        <section className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1 text-center sm:text-right">
            <h4 className="text-base font-bold text-white">دفع آمن ومحمي 100% عبر Stripe</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              معالجة المدفوعات الدولية بالدولار الأمريكي (USD) عبر أقوى بوابات الدفع في العالم. إمكانية الإلغاء أو الترقية في أي وقت من خلال بوابة العميل.
            </p>
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
          <span>جارِ تحميل صفحة الفوترة...</span>
        </div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
