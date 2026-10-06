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
  Crown,
  Check,
  Flame,
  CheckCircle
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

const UI_PLANS: Plan[] = [
  {
    id: 'STARTER',
    name: 'باقة البداية (Starter)',
    nameEn: 'Starter',
    description: 'مثالية للمتاجر الناشئة ورواد التجارة المبتدئين',
    price: 40,
    currency: 'USD',
    features: [
      'متجر إلكتروني واحد متصل (1 Store)',
      'حتى 250 منتج نشط في المخزن',
      'حتى 1,000 طلب ومبيعة شهرياً',
      'حساب تلقائي للهامش وصافي الأرباح بدقة',
      'تنبيهات انخفاض المخزون اللحظية',
      'تقارير المبيعات والأداء الأساسية',
      'دعم فني عبر البريد الإلكتروني',
    ],
    limits: { stores: 1, products: 250, orders: 1000 },
  },
  {
    id: 'PRO',
    name: 'باقة المحترفين (Pro)',
    nameEn: 'Pro',
    badge: 'الأكثر طلباً ⭐',
    description: 'للتجار النشطين الباحثين عن النمو السريع وأتمتة الأرباح',
    price: 150,
    currency: 'USD',
    features: [
      'حتى 5 متاجر إلكترونية متعددة العملات',
      'منتجات غير محدودة في المخزن ∞',
      'طلبات ومبيعات غير محدودة شهرياً ∞',
      'لوحة تحليل أرباح ذكية وتنبؤات AI بالمبيعات',
      'تنبيهات استباقية ذكية عند نفاد المخزون',
      'تصدير التقارير المالية إلى Excel و PDF بنقرة واحدة',
      'دعم فني متميز ذو أولوية 24/7',
    ],
    limits: { stores: 5, products: -1, orders: -1 },
  },
  {
    id: 'VIP',
    name: 'باقة VIP مدى الحياة (VIP Lifetime)',
    nameEn: 'VIP Lifetime',
    badge: 'دفعة واحدة للأبد 👑',
    description: 'وصول غير محدود لمدى الحياة بدون أي اشتراكات أو فواتير شهرية نهائياً',
    price: 250,
    isLifetime: true,
    currency: 'USD',
    features: [
      'وصول كامل لمدى الحياة (دفعة واحدة فقط)',
      'متاجر إلكترونية غير محدودة ∞',
      'منتجات وطلبات ومبيعات غير محدودة ∞',
      'ربط API مخصص ومباشر مع متاجرك',
      'مدير حساب شخصي مخصص على مدار الساعة',
      'كافة التحديثات والميزات المستقبلية مجاناً للأبد',
      'أفضلية مستوى الخدمة المضمونة SLA 99.9%',
    ],
    limits: { stores: -1, products: -1, orders: -1 },
  },
];

function BillingContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  const planParam = searchParams.get('plan');

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<'STARTER' | 'PRO' | 'VIP'>('STARTER');

  useEffect(() => {
    if (statusParam === 'success') {
      const planName =
        planParam === 'VIP'
          ? 'باقة VIP مدى الحياة'
          : planParam === 'PRO'
          ? 'باقة المحترفين (Pro)'
          : 'باقة البداية (Starter)';
      setNotification(`تهانينا! تم تفعيل ${planName} بنجاح! حسابك نشط الآن بالكامل. 🚀`);
      if (planParam === 'VIP' || planParam === 'PRO' || planParam === 'STARTER') {
        setCurrentPlanId(planParam);
      }
    } else if (statusParam === 'cancelled') {
      setNotification('تم إلغاء عملية الدفع.');
    }
  }, [statusParam, planParam]);

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
      alert('حدث خطأ أثناء الاتصال ببوابة الدفع، يرجى المحاولة ثانية');
    } finally {
      setLoadingPlan(null);
    }
  };

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
              <span>الاشتراكات وبوابة الدفع Premium</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>حساب نشط</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {notification && (
          <div className="bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 px-6 py-4 rounded-2xl flex items-center justify-between shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-semibold text-sm">{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white text-xs underline"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Pricing Cards */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-3xl font-black text-white">اختر باقتك المفضلة</h2>
            <p className="text-slate-400 text-sm">
              لا توجد باقة مجانية — خدمات حصرية للمحترفين بأسعار تنافسية تبدأ من 40$
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UI_PLANS.map((plan) => {
              const isCurrent = currentPlanId === plan.id;
              const isFeatured = plan.id === 'PRO';

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    isFeatured
                      ? 'bg-gradient-to-b from-indigo-950/90 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/15 scale-[1.02]'
                      : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-slate-400 text-xs mt-1 min-h-[32px]">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 my-5">
                      <span className="text-4xl font-black text-white">${plan.price}</span>
                      <span className="text-xs text-slate-400">
                        {plan.isLifetime ? 'مرة واحدة للأبد' : '/ شهرياً'}
                      </span>
                    </div>

                    <div className="h-px bg-slate-800/80 my-5" />

                    <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full py-3.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30'
                        : isCurrent
                        ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <span className="animate-pulse">جاري التحويل لبوابة الدفع...</span>
                    ) : isCurrent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>باقتك الحالية (تجديد)</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {plan.id === 'VIP'
                            ? 'شراء VIP مدى الحياة ($250)'
                            : plan.id === 'PRO'
                            ? 'الترقية إلى Pro ($150)'
                            : 'الاشتراك في البداية ($40)'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">جاري تحميل الفوترة...</div>}>
      <BillingContent />
    </Suspense>
  );
}