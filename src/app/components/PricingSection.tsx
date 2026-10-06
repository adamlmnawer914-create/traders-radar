'use client';

import React, { useState } from 'react';
import { Check, CreditCard, Sparkles, X, ArrowLeft, ShieldCheck, Zap, Lock } from 'lucide-react';

interface PlanInfo {
  id: 'STARTER' | 'PRO' | 'VIP';
  name: string;
  badge?: string;
  subtitle: string;
  price: number;
  period: string;
  isLifetime?: boolean;
  features: string[];
}

const PLANS: PlanInfo[] = [
  {
    id: 'STARTER',
    name: 'باقة البداية (Starter)',
    subtitle: 'للمتاجر الناشئة ورواد التجارة',
    price: 40,
    period: '/ شهرياً',
    features: [
      'متجر إلكتروني واحد متصل',
      'حتى 250 منتج نشط في المخزن',
      'حتى 1,000 طلب ومبيعة شهرياً',
      'حساب تلقائي لصافي الأرباح',
      'تنبيهات انخفاض المخزون اللحظية',
      'تقارير المبيعات والأداء الأساسية',
    ],
  },
  {
    id: 'PRO',
    name: 'باقة المحترفين (Pro)',
    badge: 'الأكثر طلباً ⭐',
    subtitle: 'للتجار النشطين وتوسيع المبيعات',
    price: 150,
    period: '/ شهرياً',
    features: [
      'حتى 5 متاجر إلكترونية متعددة',
      'منتجات غير محدودة بالمخزن ∞',
      'مبيعات وطلبات غير محدودة ∞',
      'تحليلات أرباح ذكية وتنبؤات AI',
      'تصدير التقارير إلى Excel و PDF',
      'دعم فني ذو أولوية 24/7',
    ],
  },
  {
    id: 'VIP',
    name: 'باقة VIP مدى الحياة',
    badge: 'دفعة واحدة للأبد 👑',
    subtitle: 'وصول كامل غير محدود للأبد',
    price: 250,
    period: 'مرة واحدة للأبد',
    isLifetime: true,
    features: [
      'وصول مدى الحياة بدون أي تجديد',
      'متاجر إلكترونية غير محدودة ∞',
      'منتجات ومبيعات غير محدودة ∞',
      'ربط API مخصص ومباشر',
      'مدير حساب مخصص على مدار الساعة',
      'كافة التحديثات القادمة مجاناً للأبد',
    ],
  },
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenCheckout = (plan: PlanInfo) => {
    setSelectedPlan(plan);
    setError(null);
  };

  const handleProceedToPayment = async (mode: 'stripe' | 'instant') => {
    if (!selectedPlan) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          email: email || undefined,
          mode,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        window.location.href = `/dashboard/billing?status=success&plan=${selectedPlan.id}`;
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء الاتصال ببوابة الدفع، يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <section className="pricing-section" id="pricing">
      <span className="pill pill-top">
        <i className="dot"></i>باقات الاشتراك
      </span>
      <h2 className="sec-title">اختر الباقة المناسبة لمتجرك</h2>
      <p className="sec-sub">
        <span>خدمات استشارات وإدارة أرباح متقدمة بدون فترات تجريبية أو رسوم خفية.</span>
      </p>

      <div className="pricing-grid">
        {PLANS.map((plan) => {
          const isFeatured = plan.id === 'PRO';

          return (
            <div
              key={plan.id}
              className={`price-card ${isFeatured ? 'featured' : ''}`}
            >
              <div className="card-top">
                {plan.badge && (
                  <div className={isFeatured ? 'popular-badge' : 'vip-badge'}>
                    {plan.badge}
                  </div>
                )}
                <div className="plan-header">
                  <h3 className="plan-title">{plan.name}</h3>
                  <p className="plan-subtitle">{plan.subtitle}</p>
                </div>
                <div className="price-box">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className={`period ${plan.isLifetime ? 'highlight' : ''}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="price-features">
                  {plan.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="chk-icon">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCheckout(plan)}
                className={`price-btn ${isFeatured ? 'price-btn-featured' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {plan.id === 'VIP'
                  ? 'امتلك VIP للأبد ($250)'
                  : plan.id === 'PRO'
                  ? 'اشترك في Pro ($150)'
                  : 'اشترك في البداية ($40)'}
              </button>
            </div>
          );
        })}
      </div>

      {/* ==================== CHECKOUT MODAL ==================== */}
      {selectedPlan && (
        <div className="checkout-modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 8, 22, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          <div className="checkout-modal-card" style={{
            backgroundColor: '#0c1024',
            border: '1px solid rgba(80, 110, 245, 0.4)',
            borderRadius: '28px',
            maxWidth: '520px',
            width: '100%',
            padding: '32px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(43, 90, 245, 0.25)',
            position: 'relative',
            color: '#fff',
            direction: 'rtl',
            textAlign: 'right',
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlan(null)}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                <Zap size={14} /> بوابة الدفع والاشتراك
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: '4px 0' }}>
                {selectedPlan.name}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                أكمل بياناتك للدخول المباشر إلى المنصة وتفعيل مميزات الباقة فوراً.
              </p>
            </div>

            {/* Price Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(51, 65, 85, 0.7)',
              padding: '16px 20px',
              borderRadius: '18px',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>المبلغ المطلوب:</span>
              <span style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>${selectedPlan.price}</span>
              <span style={{ fontSize: '13px', color: '#818cf8', fontWeight: 'bold' }}>USD {selectedPlan.period}</span>
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold', marginBottom: '6px' }}>
                بريدك الإلكتروني (لإرسال الفاتورة وبيانات الحساب):
              </label>
              <input
                type="email"
                placeholder="trader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Option 1: Stripe Checkout */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleProceedToPayment('stripe')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: '#4f46e5',
                  backgroundImage: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <CreditCard size={18} />
                <span>{loading ? 'جاري الاتصال بالبوابة...' : `الدفع الآمن عبر بوابة Stripe ($${selectedPlan.price})`}</span>
              </button>

              {/* Option 2: Instant 1-Click Activation */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleProceedToPayment('instant')}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#e2e8f0',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sparkles size={16} color="#fbbf24" />
                <span>تفعيل فوري وتجربة مباشرة للوحة التحكم</span>
              </button>
            </div>

            {/* Security Notice */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '11px', color: '#64748b' }}>
              <Lock size={12} />
              <span>مدفوعات مشفرة وآمنة 100% متوافقة مع معايير PCI-DSS</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}