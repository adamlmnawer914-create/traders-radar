import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck, Sparkles, CheckCircle } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 selection:bg-indigo-600 selection:text-white">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-3 mb-3 hover:opacity-90 transition-opacity">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            رادار التاجر
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-white mt-1">تسجيل الدخول إلى حسابك</h1>
        <p className="text-slate-400 text-sm mt-1">أدخل بياناتك لمتابعة إدارة متجرك ومبيعاتك وصافي أرباحك</p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md space-y-4">
        {/* Instant Demo Access Button */}
        <div className="bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 p-5 rounded-3xl shadow-xl backdrop-blur-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-indigo-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>تجربة المنصة الفورية (دخول سريع بضغطة زر)</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            استكشف لوحة التحكم الحقيقية، المتاجر، الإحصائيات، وميزات المنصة مباشرة بدون الحاجة لرمز تحقق:
          </p>
          <a
            href="/api/auth/demo"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 text-sm active:scale-95"
          >
            <span>⚡ دخول تجريبي فوري للوحة التحكم</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-xs text-slate-500 font-medium">أو عبر حسابك المسجل</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Live Clerk SignIn Component */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "text-white font-bold text-lg",
                headerSubtitle: "text-slate-400 text-sm",
                socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700 font-medium",
                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5",
                formFieldInput: "bg-slate-800/90 border-slate-700 text-white rounded-xl focus:border-indigo-500",
                formFieldLabel: "text-slate-300 font-medium text-xs mb-1",
                footerActionLink: "text-indigo-400 hover:text-indigo-300 font-bold",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-indigo-400",
              },
            }}
          />
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}