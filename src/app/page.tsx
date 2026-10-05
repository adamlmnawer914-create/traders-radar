import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  TrendingUp,
  Package,
  ShieldCheck,
  ArrowLeft,
  Zap,
  Sparkles,
  Check,
  Crown,
  Flame
} from 'lucide-react';

export default async function HomePage() {
  try {
    const { userId } = await auth();
    if (userId) {
      redirect('/dashboard');
    }
  } catch (e) {}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                رادار التجار
              </span>
              <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                منصة استخبارات التجارة الإلكترونية
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/sign-up"
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <span>انضم الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام الجيل القادم لرواد التجارة الإلكترونية Premium</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            تحكّم في مبيعاتك وأرباحك بدقة <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              دون أي تعقيد وبأحدث أدوات الذكاء
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            منظومة متطورة تمنحك ربطاً شاملاً لمتاجرك، مراقبة المخزون، واحتساب صافي الأرباح تلقائياً في الوقت الفعلي.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/sign-up"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>ابدأ الآن واشترك في المنصة</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition"
            >
              استعراض خطط الأسعار ($)
            </Link>
          </div>
        </div>

        {/* Featured Visual Dashboard Mockups with User's Uploaded Images */}
        <div className="max-w-6xl mx-auto mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-500/10 hover:border-slate-700 transition">
            <img
              src="/assets/dash_raw.png"
              alt="لوحة تحكم رادار التجار الذكية"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-purple-500/10 hover:border-slate-700 transition">
            <img
              src="/assets/stats_raw.png"
              alt="تحليلات وإحصائيات النمو"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section (3 USD Tiers: $40, $99, $250 Lifetime) */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-800/80 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white">باقات الاشتراك بالدولار الأمريكي (USD)</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            خدمات Premium متخصصة بدون فترات تجريبية أو قيود خفية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Starter $40 */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">باقة البداية (Starter)</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">للمبتدئين</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">مثالية للمتاجر الناشئة لتتبع الأرباح والمخزون بدقة</p>
              <div className="text-4xl font-black text-white mb-6">$40 <span className="text-sm font-normal text-slate-400">/ شهرياً</span></div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> متجر إلكتروني واحد متصل</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> حتى 250 منتج نشط</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> حتى 1,000 طلب ومبيعة شهرياً</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> حساب تلقائي لصافي وهوامش الأرباح</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> تنبيهات انخفاض المخزون</li>
              </ul>
            </div>
            <Link href="/sign-up" className="mt-8 block text-center py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition">
              اشترك في Starter ($40)
            </Link>
          </div>

          {/* Pro $99 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/70 via-slate-900/90 to-slate-900 border-2 border-indigo-500 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20 scale-105">
            <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-black text-white uppercase">
              الأكثر طلباً
            </div>
            <div>
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-xl font-bold text-white">باقة المحترفين (Pro)</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">للتجار النشطين</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">لتوسيع تجارتك عبر 5 متاجر وإمكانيات تحليل غير محدودة</p>
              <div className="text-4xl font-black text-white mb-6">$99 <span className="text-sm font-normal text-slate-400">/ شهرياً</span></div>
              <ul className="space-y-3 text-xs text-slate-200 border-t border-indigo-900/40 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> حتى 5 متاجر إلكترونية متعددة العملات</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> منتجات غير محدودة بالمخزون ∞</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> طلبات ومبيعات غير محدودة ∞</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> لوحة تحليل أرباح ذكية وتنبؤات AI</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> تصدير التقارير إلى Excel و PDF</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> دعم فني ذو أولوية 24/7</li>
              </ul>
            </div>
            <Link href="/sign-up" className="mt-8 block text-center py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition">
              اشترك في Pro ($99)
            </Link>
          </div>

          {/* VIP Lifetime $250 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-950/40 via-slate-900/90 to-slate-900 border-2 border-purple-500/80 flex flex-col justify-between relative shadow-2xl shadow-purple-600/20">
            <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-[10px] font-black text-white uppercase">
              مدى الحياة
            </div>
            <div>
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-xl font-bold text-white">باقة VIP مدى الحياة</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">عرض حصري</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">دفعة واحدة فقط لامتلاك وصول غير محدود للأبد بدون أي اشتراك شهري</p>
              <div className="text-4xl font-black text-white mb-2">$250 <span className="text-sm font-bold text-purple-300 mr-2">دفعة واحدة</span></div>
              <span className="text-[11px] text-emerald-400 font-semibold block mb-6">وفر كافة رسوم الاشتراكات المستقبلية!</span>
              <ul className="space-y-3 text-xs text-purple-200 border-t border-purple-900/40 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> وصول كامل لمدى الحياة بدون تجديد</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> متاجر إلكترونية غير محدودة ∞</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> منتجات ومبيعات غير محدودة ∞</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> ربط API مخصص ومباشر</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> مدير حساب مخصص على مدار الساعة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> كافة التحديثات القادمة مجاناً للأبد</li>
              </ul>
            </div>
            <Link href="/sign-up" className="mt-8 block text-center py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg transition">
              امتلك VIP مدى الحياة ($250)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-10 text-center text-xs text-slate-500">
        <p>© 2026 رادار التجار. جميع الحقوق محفوظة. منصة استخبارات التجارة الإلكترونية وإدارة الأرباح.</p>
      </footer>
    </div>
  );
}
