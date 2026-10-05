import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  TrendingUp,
  Package,
  ShieldCheck,
  BarChart3,
  ArrowLeft,
  Zap,
  Sparkles,
  CheckCircle2,
  Users,
  Check,
  Crown
} from 'lucide-react';

export default async function HomePage() {
  try {
    const { userId } = await auth();
    if (userId) {
      redirect('/dashboard');
    }
  } catch (e) {
    // If Clerk is loading or unconfigured, allow landing preview
  }

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
                منصة ذكاء التجارة
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
              <span>ابدأ مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام الجيل القادم لرواد التجارة الإلكترونية في الشرق الأوسط</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            تحكّم في مبيعاتك وأرباحك <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              بدقة متناهية وبدون تعقيد
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة تمنحك لوحة تحكم ذكية، حساب تلقائي لهوامش الربح، وتنبيهات فورية للمخزون، مع اشتراكات مرنة عبر Stripe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link
              href="/sign-up"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>سجّل الآن وافتح متاجرك</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition"
            >
              استعرض باقات الاشتراك
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">حساب الأرباح اللحظي</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            اطلع على صافي ربح كل طلب بعد خصم تكلفة المنتج ورسوم الشحن والتشغيل تلقائياً.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">مراقبة المخزون الذكية</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            تنبيهات استباقية عندما يصل أي منتج إلى حده الأدنى لمنع توقف مبيعاتك.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">أمان وعزل بيانات تام</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            بنية تحتية متطورة تضمن عزل بيانات كل تاجر بنسبة 100% مع مصادقة Clerk العالمية.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white">خطط أسعار واضحة بدون التزامات خفية</h2>
          <p className="text-slate-400 text-sm">
            ابدأ بالخطة المجانية اليوم، وقم بالترقية عند رغبتك في مضاعفة مبيعاتك ومتاجرك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">الباقة المجانية</h3>
              <p className="text-xs text-slate-400 mb-6">لتجربة المنصة وتشغيل متجرك الأول</p>
              <div className="text-3xl font-black text-white mb-6">0 <span className="text-sm font-normal text-slate-400">ر.س</span></div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> متجر إلكتروني واحد</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> حتى 50 منتج</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> حتى 100 طلب شهرياً</li>
              </ul>
            </div>
            <Link href="/sign-up" className="mt-8 block text-center py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition">
              ابدأ مجاناً
            </Link>
          </div>

          {/* Pro */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20">
            <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-black text-white uppercase">
              الأكثر طلباً
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">باقة المحترفين</h3>
              <p className="text-xs text-slate-300 mb-6">للتجار النشطين الباحثين عن النمو السريع</p>
              <div className="text-3xl font-black text-white mb-6">99 <span className="text-sm font-normal text-slate-400">ر.س / شهرياً</span></div>
              <ul className="space-y-3 text-xs text-slate-200 border-t border-indigo-900/40 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> حتى 5 متاجر إلكترونية</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> منتجات غير محدودة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> مبيعات وطلبات غير محدودة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> لوحة تحليل أرباح متقدمة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> دعم فني ذو أولوية</li>
              </ul>
            </div>
            <Link href="/sign-up" className="mt-8 block text-center py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition">
              اشترك في باقة المحترفين
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">باقة المؤسسات</h3>
              <p className="text-xs text-slate-400 mb-6">للشركات وسلاسل المتاجر الكبرى</p>
              <div className="text-3xl font-black text-white mb-6">299 <span className="text-sm font-normal text-slate-400">ر.س / شهرياً</span></div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> متاجر إلكترونية غير محدودة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> ربط API مخصص</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> مدير حساب مخصص 24/7</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> اتفاقية مستوى خدمة 99.9%</li>
              </ul>
            </div>
            <Link href="/sign-up" className="mt-8 block text-center py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-10 text-center text-xs text-slate-500">
        <p>© 2026 رادار التجار. جميع الحقوق محفوظة. منصة مدعومة بأحدث تقنيات الذكاء الاصطناعي والتجارة الإلكترونية.</p>
      </footer>
    </div>
  );
}
