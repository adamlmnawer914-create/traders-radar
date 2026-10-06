import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PricingSection from "./components/PricingSection";

export default async function HomePage() {
  try {
    const { userId } = await auth();
    if (userId) {
      redirect("/dashboard");
    }
  } catch (e) {}

  return (
    <div className="vp" dir="rtl">
      {/* Shared SVG gradients used by 3D icons */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="gBV" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#1c8cff"/><stop offset="1" stopColor="#9446ff"/></linearGradient>
          <linearGradient id="gBVv" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#1f8fff"/><stop offset="1" stopColor="#9a4dff"/></linearGradient>
          <linearGradient id="gBVh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2d9bff"/><stop offset="1" stopColor="#7a4dff"/></linearGradient>
          <linearGradient id="gLeft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3aa6ff"/><stop offset="1" stopColor="#2a56f5"/></linearGradient>
          <linearGradient id="gRight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a52ff"/><stop offset="1" stopColor="#8f3df2"/></linearGradient>
          <linearGradient id="gTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b58bff"/><stop offset="1" stopColor="#7d55ff"/></linearGradient>
          <linearGradient id="gBlueL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a9bff"/><stop offset="1" stopColor="#1b4fe8"/></linearGradient>
          <linearGradient id="gBlueR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c6cff"/><stop offset="1" stopColor="#1636c9"/></linearGradient>
          <linearGradient id="gBlueT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6cb4ff"/><stop offset="1" stopColor="#2f78ff"/></linearGradient>
          <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe066"/><stop offset="1" stopColor="#f59a0e"/></linearGradient>
          <linearGradient id="gGoldS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffc233"/><stop offset="1" stopColor="#f07f0a"/></linearGradient>
          <linearGradient id="gBell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a62ff"/><stop offset="1" stopColor="#2a82ff"/></linearGradient>
          <linearGradient id="gDoc" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#2f8bff"/><stop offset="1" stopColor="#8a3df5"/></linearGradient>
          <linearGradient id="gShield" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#1f7bff"/><stop offset="0.55" stopColor="#4a4bff"/><stop offset="1" stopColor="#9a3df2"/></linearGradient>
          <linearGradient id="gLogoA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b48bff"/><stop offset="1" stopColor="#6a3dff"/></linearGradient>
          <linearGradient id="gLogoB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5aa0ff"/><stop offset="1" stopColor="#7a3dff"/></linearGradient>
          <linearGradient id="gLogoC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#19b2ff"/><stop offset="1" stopColor="#3a57ff"/></linearGradient>
          <linearGradient id="gArrow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2a6bff"/><stop offset="1" stopColor="#5a3dff"/></linearGradient>
        </defs>
      </svg>

      <div className="page">
        {/* ==================== HEADER ==================== */}
        <header className="site-header" id="top">
          <div className="navbar" id="navbar">
            {/* Brand Logo & Title */}
            <Link href="/" className="nav-brand" aria-label="رادار التاجر">
              <svg className="brand-mark" viewBox="0 0 24 30" aria-hidden="true">
                <path d="M1.2 11.5 L7 9.2 V25.8 L1.2 27.6 Z" fill="url(#gLogoA)"/>
                <path d="M1.2 11.5 L7 9.2 L9 10.2 L3.2 12.5 Z" fill="#cdb2ff"/>
                <path d="M8.6 14 L14 12.2 V26 L8.6 27.8 Z" fill="url(#gLogoB)"/>
                <path d="M8.6 14 L14 12.2 L15.8 13.2 L10.4 15 Z" fill="#9cc2ff"/>
                <path d="M15.4 4.6 L21.4 2.2 V24.6 L15.4 26.8 Z" fill="url(#gLogoC)"/>
                <path d="M15.4 4.6 L21.4 2.2 L23 3.4 L17 5.8 Z" fill="#7fd6ff"/>
                <path d="M21.4 2.2 L23 3.4 V25.6 L21.4 24.6 Z" fill="#2f45e0"/>
                <ellipse cx="2.2" cy="25.2" rx="1.1" ry="1.5" fill="#6f8bff" opacity=".85"/>
              </svg>
              <span className="brand-text">
                <strong>رادار للتاجر</strong>
                <small>حلول رقمية لنجاح أكبر</small>
              </span>
            </Link>

            {/* Navigation Menu */}
            <nav className="nav-menu" aria-label="قائمة الموقع">
              <Link href="/" className="nav-link active">الرئيسية</Link>
              <a href="#features" className="nav-link">الخدمات</a>
              <a href="#stats-showcase" className="nav-link">التحليلات</a>
              <a href="#pricing" className="nav-link">الأسعار</a>
              <a href="#about" className="nav-link">من نحن</a>
              <a href="#contact" className="nav-link">تواصل معنا</a>
            </nav>

            {/* Actions */}
            <div className="nav-actions">
              <Link href="/sign-in" className="btn-login" id="btn-login">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="7.5" r="4" fill="none" stroke="currentColor" strokeWidth="2.4"/>
                  <path d="M4.5 21c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                </svg>
                <span>تسجيل الدخول</span>
              </Link>

              <a href="#pricing" className="btn-start" id="btn-start-nav">ابدأ الآن</a>

              <label className="search-bar" htmlFor="site-search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.6"/>
                  <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
                </svg>
                <input id="site-search" type="text" placeholder="ابحث عن خدماتنا..." aria-label="ابحث عن خدمة" />
              </label>
            </div>
          </div>
        </header>

        <main>
          {/* ==================== HERO ==================== */}
          <section className="hero" id="home">
            {/* Visual: Ultra-Luxurious 3D Glass Dashboard */}
            <div className="hero-visual" id="hero-visual">
              <img
                className="img-dashboard"
                id="dashboard-3d"
                src="/assets/dash_perfect@2x.png"
                alt="لوحة تحكم رادار التجار ثلاثية الأبعاد الفاخرة"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* 3D Shopping Bag on bottom left */}
            <img
              className="img-bag"
              src="/assets/bag_perfect@2x.png"
              alt="حقيبة 3D ومؤشر نمو المبيعات"
              aria-hidden="true"
            />

            {/* Hero Content */}
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="hl">راقب متجرك.</span>
                <span className="hl">تحكم في مخزونك.</span>
                <span className="hl hl-grad">ضاعف أرباحك.</span>
              </h1>

              <p className="hero-sub">
                منصة ذكية تجمع لك كل ما تحتاجه لإدارة متجرك الإلكتروني بشكل احترافي وفعال، بدءاً من تتبع المبيعات والمخزون وصولاً إلى تحليل الأداء وتحقيق النمو.
              </p>

              {/* CTAs */}
              <div className="hero-actions">
                <a href="#pricing" className="btn-cta" id="hero-cta-btn">
                  <span>ابدأ الآن</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                <a href="#stats-showcase" className="btn-video" id="hero-video-btn">
                  <span className="play-triangle">▶</span>
                  <span>شاهد التحليلات الحية</span>
                </a>
              </div>

              {/* Feature Pills */}
              <div className="features-row">
                <div className="feat-pill">
                  <div className="feat-pill-ico">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="feat-pill-text">
                    <strong>تحديثات مستمرة</strong>
                    <small>لأداء أفضل</small>
                  </div>
                </div>

                <div className="feat-pill">
                  <div className="feat-pill-ico">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="feat-pill-text">
                    <strong>أمان متقدم</strong>
                    <small>لحماية بياناتك</small>
                  </div>
                </div>

                <div className="feat-pill">
                  <div className="feat-pill-ico">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="feat-pill-text">
                    <strong>دعم فني 24/7</strong>
                    <small>معك دائماً</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== FEATURES GRID ==================== */}
          <section className="features" id="features">
            <span className="pill pill-top"><i className="dot"></i>كل ما تحتاجه</span>
            <h2 className="features-title">كل ما تحتاجه لمتجرك في مكان واحد</h2>
            <p className="features-sub">
              <span>أدوات متكاملة مصممة خصيصاً لتسهيل إدارة متجرك الإلكتروني، من المبيعات والمخزون إلى التحليلات والتقارير</span>
              <br />
              <span>مع واجهة سهلة الاستخدام تناسب جميع المستخدمين.</span>
            </p>

            <div className="cards-wrapper">
              <div className="cards-grid">
                {/* 1. إدارة المخزون الذكية */}
                <div className="fcard">
                  <div className="fcard-icon">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <polygon points="22,6 38,15 22,24 6,15" fill="url(#gTop)"/>
                      <polygon points="6,15 22,24 22,38 6,29" fill="url(#gLeft)"/>
                      <polygon points="22,24 38,15 38,29 22,38" fill="url(#gRight)"/>
                    </svg>
                  </div>
                  <h3 className="fcard-title">إدارة المخزون الذكية</h3>
                  <p className="fcard-desc">تتبع مخزونك بشكل لحظي وتجنب نفاد المنتجات الأكثر مبيعاً.</p>
                  <a href="#stats-showcase" className="fcard-arrow" aria-label="إدارة المخزون الذكية">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                {/* 2. تتبع الأرباح */}
                <div className="fcard">
                  <div className="fcard-icon">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <ellipse cx="22" cy="14" rx="14" ry="5.5" fill="url(#gGold)"/>
                      <path d="M8 14 v8 c0 3 6.3 5.5 14 5.5 s14-2.5 14-5.5 v-8 Z" fill="url(#gGoldS)"/>
                      <path d="M8 22 v8 c0 3 6.3 5.5 14 5.5 s14-2.5 14-5.5 v-8 Z" fill="url(#gGold)"/>
                    </svg>
                  </div>
                  <h3 className="fcard-title">تتبع الأرباح بدقة</h3>
                  <p className="fcard-desc">اعرف أرباحك بدقة من خلال تقارير مفصلة وواضحة.</p>
                  <a href="#stats-showcase" className="fcard-arrow" aria-label="تتبع الأرباح بدقة">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                {/* 3. تحليل المبيعات */}
                <div className="fcard">
                  <div className="fcard-icon">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <rect x="7" y="24" width="7" height="14" rx="2" fill="url(#gBlueL)"/>
                      <rect x="18.5" y="15" width="7" height="23" rx="2" fill="url(#gBlueR)"/>
                      <rect x="30" y="8" width="7" height="30" rx="2" fill="url(#gBlueT)"/>
                    </svg>
                  </div>
                  <h3 className="fcard-title">تحليل المبيعات</h3>
                  <p className="fcard-desc">اكتشف أفضل المنتجات أداءً وابنِ قراراتك على بيانات حقيقية.</p>
                  <a href="#stats-showcase" className="fcard-arrow" aria-label="تحليل المبيعات">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                {/* 4. تنبيهات تلقائية */}
                <div className="fcard">
                  <div className="fcard-icon">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <path d="M22 6 a10 10 0 0 0-10 10 v7 l-3 4 v2 h26 v-2 l-3-4 v-7 a10 10 0 0 0-10-10 Z" fill="url(#gBell)"/>
                      <circle cx="22" cy="34" r="3" fill="#ffe066"/>
                    </svg>
                  </div>
                  <h3 className="fcard-title">تنبيهات تلقائية</h3>
                  <p className="fcard-desc">ابقَ على اطلاع بأهم التغييرات والتحديثات في متجرك.</p>
                  <a href="#stats-showcase" className="fcard-arrow" aria-label="تنبيهات تلقائية">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                {/* 5. إدارة المنتجات */}
                <div className="fcard">
                  <div className="fcard-icon">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <polygon points="22,6 38,15 22,24 6,15" fill="url(#gBV)"/>
                      <polygon points="6,15 22,24 22,38 6,29" fill="url(#gBVv)"/>
                      <polygon points="22,24 38,15 38,29 22,38" fill="url(#gBVh)"/>
                    </svg>
                  </div>
                  <h3 className="fcard-title">إدارة المنتجات</h3>
                  <p className="fcard-desc">أضف وعدّل منتجاتك بسهولة وتحكم كامل في مواصفاتها.</p>
                  <a href="#stats-showcase" className="fcard-arrow" aria-label="إدارة المنتجات">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                {/* 6. تقارير احترافية */}
                <div className="fcard">
                  <div className="fcard-icon">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <rect x="10" y="7" width="24" height="30" rx="3" fill="url(#gDoc)"/>
                      <line x1="15" y1="14" x2="29" y2="14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                      <line x1="15" y1="20" x2="29" y2="20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                      <line x1="15" y1="26" x2="23" y2="26" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="fcard-title">تقارير احترافية</h3>
                  <p className="fcard-desc">تقارير شاملة تساعدك على تطوير عملك وتنمو.</p>
                  <a href="#stats-showcase" className="fcard-arrow" aria-label="تقارير احترافية">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                {/* 7. أمان عالي */}
                <div className="fcard">
                  <div className="fcard-icon">
                    <svg viewBox="0 0 44 44" aria-hidden="true">
                      <path d="M22 6 L34 11 V22 C34 29 29 35 22 38 C15 35 10 29 10 22 V11 Z" fill="url(#gShield)"/>
                      <polyline points="17,21 21,25 27,17" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="fcard-title">أمان عالي</h3>
                  <p className="fcard-desc">حماية متقدمة لبياناتك ومعاملاتك المالية.</p>
                  <a href="#stats-showcase" className="fcard-arrow" aria-label="أمان عالي">
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 3D STATS SHOWCASE SECTION ==================== */}
          <section className="stats-showcase-section" id="stats-showcase">
            <div className="stats-showcase-card">
              {/* Text Info (Right in RTL) */}
              <div className="stats-showcase-info">
                <span className="pill pill-top">
                  <i className="dot"></i>أدوات نجاحك
                </span>
                <h2 className="stats-showcase-title">
                  اعرف أين يذهب كل درهم.
                </h2>
                <p className="stats-showcase-desc">
                  تقارير مفصلة ورؤية واضحة لأداء متجرك، تساعدك على اتخاذ قرارات أفضل وزيادة أرباحك بكل ثقة.
                </p>
                <ul className="stats-showcase-checks">
                  <li>
                    <span className="chk-ico">✓</span>
                    <span>مراقبة المبيعات والمخزون</span>
                  </li>
                  <li>
                    <span className="chk-ico">✓</span>
                    <span>تحليل سلوك العملاء</span>
                  </li>
                  <li>
                    <span className="chk-ico">✓</span>
                    <span>توقعات النمو المستقبلية</span>
                  </li>
                </ul>
              </div>

              {/* Ultra-Luxurious 3D Stats Graphic (Left in RTL) */}
              <div className="stats-showcase-visual">
                <img
                  className="img-stats-showcase"
                  src="/assets/stats_perfect@2x.png"
                  alt="لوحة تحليلات وإحصائيات دقيقة ثلاثية الأبعاد"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* ==================== PRICING SECTION (USD) ==================== */}
          <PricingSection />

          {/* ==================== ABOUT & CONTACT FOOTER ==================== */}
          <footer className="site-footer" id="about">
            <div id="contact" style={{ textAlign: "center", padding: "calc(40 * var(--u)) 0 calc(24 * var(--u))", borderTop: "1px solid rgba(214, 222, 247, 0.6)" }}>
              <h3 style={{ fontSize: "calc(16 * var(--u))", fontWeight: "800", color: "var(--navy)", marginBottom: "calc(8 * var(--u))" }}>
                رادار التاجر | شريكك الاستراتيجي في التجارة الإلكترونية
              </h3>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "#627099", maxWidth: "600px", margin: "0 auto calc(16 * var(--u))", lineHeight: "1.7" }}>
                نمكّن رواد الأعمال وأصحاب المتاجر الإلكترونية من التحكم الكامل في مبيعاتهم ومخزونهم ومضاعفة أرباحهم الصافية عبر أحدث أدوات التحليل الذكية.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "calc(20 * var(--u))", flexWrap: "wrap", fontSize: "calc(12 * var(--u))", color: "var(--blue)" }}>
                <span>support@traders-radar.com</span>
                <span>•</span>
                <span>دعم فني مباشر 24/7</span>
                <span>•</span>
                <span>حماية مشفرة 100%</span>
              </div>
              <p style={{ marginTop: "calc(20 * var(--u))", fontSize: "calc(11 * var(--u))", color: "#8a96b8" }}>
                © 2026 رادار التاجر (Trader's Radar). جميع الحقوق محفوظة.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}