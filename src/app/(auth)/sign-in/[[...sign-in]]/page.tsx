import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Zap, ArrowRight, ShieldCheck, Key } from 'lucide-react';

export default function SignInPage() {
  const isKeyConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('XXXXXXXXX') &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 selection:bg-indigo-600 selection:text-white">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 mb-3 hover:opacity-90 transition-opacity">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            رادار التاجر
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-white mt-1">تسجيل الدخول إلى حسابك</h1>
        <p className="text-slate-400 text-sm mt-1">أدخل بياناتك لمتابعة إدارة متجرك ومبيعاتك</p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md">
        {isKeyConfigured ? (
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none p-0",
                  headerTitle: "text-white font-bold",
                  headerSubtitle: "text-slate-400",
                  socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold",
                  formFieldInput: "bg-slate-800 border-slate-700 text-white",
                  footerActionLink: "text-indigo-400 hover:text-indigo-300",
                }
              }}
            />
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4">
              <Key className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2">إعداد مفاتيح Clerk للمصادقة</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              تم تجهيز نظام تسجيل الدخول وإنشاء الحسابات بالكامل. لتفعيل الاتصال الفعلي مع خوادم Clerk المجانية:
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right text-xs text-slate-300 space-y-2 mb-6 font-mono">
              <div className="text-indigo-400 font-bold font-sans">خطوات التفعيل السريعة (دقيقة واحدة):</div>
              <div>1. أنشئ حساباً مجانياً على <a href="https://dashboard.clerk.com" target="_blank" className="text-indigo-400 underline">clerk.com</a></div>
              <div>2. اختر اسم التطبيق: Traders Radar</div>
              <div>3. انسخ المفاتيح وضعها في ملف <span className="text-amber-400">.env.local</span></div>
            </div>

            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-600/30"
            >
              <span>دخول تجريبي للوحة التحكم (Demo Mode)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}