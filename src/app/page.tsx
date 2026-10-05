import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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

              <Link href="/sign-up" className="btn-start" id="btn-start-nav">ابدأ الآن</Link>

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
            {/* Visual: 3D Dashboard */}
            <div className="hero-visual" id="hero-visual">
              <img
                className="img-dashboard"
                id="dashboard-3d"
                src="/assets/dash_raw.png"
                alt="لوحة تحكم رادار التاجر ثلاثية الأبعاد"
              />
            </div>

            {/* 3D Shopping Bag positioned on the left side of the hero */}
            <img
              className="img-bag"
              src="/assets/bag_perfect@2x.png"
              alt="حقيبة 3D ومخطط نمو المبيعات"
              aria-hidden="true"
            />

            {/* Hero Content */}
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="hl">راقب متجرك.</span>
                <span className="hl">تحكم في مخزونك.</span>
                <span className="hl hl-grad">ضاعف أرباحك.</span>
              </h1>

              <p className="hero-desc">
                <span>منصة ذكية تجمع لك كل ما تحتاجه لإدارة متجرك الإلكتروني</span>
                <span>بشكل احترافي وفعال، بدءاً من تتبع المبيعات والمخزون </span>
                <span>وصولاً إلى تحليل الأداء وتحقيق النمو.</span>
              </p>

              <div className="hero-actions">
                <a href="#pricing" className="btn-video" id="btn-video">
                  <span className="play">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor"/>
                    </svg>
                  </span>
                  <span>شاهد الفيديو التعريفي</span>
                </a>

                <Link href="/sign-up" className="btn-cta" id="btn-start-hero">
                  <span>ابدأ الآن مجاناً</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>

              {/* Trust Pills */}
              <ul className="trust-row">
                <li className="trust">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.4 15a4 4 0 0 0-3.4-6H15a6 6 0 0 0-11.5 2 4.5 4.5 0 0 0 1 8.8h15a3.5 3.5 0 0 0-.1-4.8Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/>
                    <path d="m9.5 13 2.5-2.5L14.5 13M12 10.5v6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
                  </svg>
                  <span><strong>تحديثات مستمرة</strong><small>لأداء أفضل</small></span>
                </li>

                <li className="trust">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.8 19.6 5.6v5.6c0 4.7-3.1 8.4-7.6 10-4.5-1.6-7.6-5.3-7.6-10V5.6Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/>
                    <path d="m8.8 12 2.4 2.4 4.2-4.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span><strong>أمان متقدم</strong><small>لحماية بياناتك</small></span>
                </li>

                <li className="trust">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.5 14v-2.2a7.5 7.5 0 0 1 15 0V14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="3.2" y="12.6" width="3.6" height="6" rx="1.6" fill="currentColor"/>
                    <rect x="17.2" y="12.6" width="3.6" height="6" rx="1.6" fill="currentColor"/>
                    <path d="M18.6 18.6c0 1.8-1.6 2.6-4 2.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="12.6" cy="21.2" r="1.1" fill="currentColor"/>
                  </svg>
                  <span><strong>دعم فني 24/7</strong><small>معك دائماً</small></span>
                </li>
              </ul>
            </div>
          </section>

          {/* ==================== FEATURES + STATS ==================== */}
          <section className="features" id="features">
            <div className="features-stage">
              <span className="pill pill-top" id="pill-all"><i className="dot"></i>كل ما تحتاجه</span>
              <h2 className="sec-title">كل ما تحتاجه لمتجرك في مكان واحد</h2>
              <p className="sec-sub">
                <span>أدوات متكاملة مصممة خصيصاً لتسهيل إدارة متجرك الإلكتروني، من المبيعات والمخزون إلى التحليلات والتقارير </span>
                <span>مع واجهة سهلة الاستخدام تناسب جميع المستخدمين.</span>
              </p>

              {/* 7 Feature Cards Grid */}
              <div className="cards" role="list">
                {/* 1. Alerts */}
                <article className="card" role="listitem" id="card-alerts">
                  <div className="card-text">
                    <h3>تنبيهات تلقائية</h3>
                    <p>كن دائماً على اطلاع بأهم الأحداث والتحديثات في متجرك.</p>
                  </div>
                  <div className="card-side">
                    <span className="tile">
                      <svg viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M16 4.4a6.6 6.6 0 0 0-6.6 6.6v3.7c0 1.1-.4 2.2-1.2 3l-1.3 1.3c-.7.7-.2 1.9.8 1.9h16.6c1 0 1.5-1.2.8-1.9l-1.3-1.3c-.8-.8-1.2-1.9-1.2-3V11A6.6 6.6 0 0 0 16 4.4Z" fill="url(#gBell)"/>
                        <path d="M13.4 22.8a2.6 2.6 0 0 0 5.2 0" fill="none" stroke="#256bf5" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="21" cy="7.5" r="3.2" fill="#ff4d6d"/>
                      </svg>
                    </span>
                    <span className="go" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </article>

                {/* 2. Sales Analysis */}
                <article className="card" role="listitem" id="card-sales">
                  <div className="card-text">
                    <h3>تحليل المبيعات</h3>
                    <p>اكتشف أفضل المنتجات أداءً وابنِ قراراتك على بيانات حقيقية.</p>
                  </div>
                  <div className="card-side">
                    <span className="tile">
                      <svg viewBox="0 0 32 32" aria-hidden="true">
                        <rect x="5.4" y="16.5" width="5" height="10.5" rx="1.8" fill="url(#gBV)"/>
                        <rect x="13.5" y="10.5" width="5" height="16.5" rx="1.8" fill="url(#gBV)"/>
                        <rect x="21.6" y="5" width="5" height="22" rx="1.8" fill="url(#gBV)"/>
                        <path d="M6 14.5l8-6 8 3" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="22" cy="11.5" r="2" fill="#fff"/>
                      </svg>
                    </span>
                    <span className="go" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </article>

                {/* 3. Profit Tracking */}
                <article className="card" role="listitem" id="card-profit">
                  <div className="card-text">
                    <h3>تتبع الأرباح</h3>
                    <p>اعرف أرباحك بدقة من خلال تقارير مفصلة وواضحة.</p>
                  </div>
                  <div className="card-side">
                    <span className="tile">
                      <svg viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M6.5 22.5v3.2c0 1.7 4.2 3 9.5 3s9.5-1.3 9.5-3v-3.2Z" fill="url(#gGoldS)"/>
                        <ellipse cx="16" cy="22.5" rx="9.5" ry="3" fill="url(#gGold)"/>
                        <path d="M6.5 17.6v3.4c0 1.7 4.2 3 9.5 3s9.5-1.3 9.5-3v-3.4Z" fill="url(#gGoldS)"/>
                        <ellipse cx="16" cy="17.6" rx="9.5" ry="3" fill="url(#gGold)"/>
                        <path d="M6.5 12.8v3.4c0 1.7 4.2 3 9.5 3s9.5-1.3 9.5-3v-3.4Z" fill="url(#gGoldS)"/>
                        <ellipse cx="16" cy="12.8" rx="9.5" ry="3" fill="url(#gGold)"/>
                        <path d="M6.5 8v3.4c0 1.7 4.2 3 9.5 3s9.5-1.3 9.5-3V8Z" fill="url(#gGoldS)"/>
                        <ellipse cx="16" cy="8" rx="9.5" ry="3" fill="#ffd54a"/>
                        <ellipse cx="16" cy="7.8" rx="4.6" ry="1.4" fill="#ffe98a"/>
                      </svg>
                    </span>
                    <span className="go" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </article>

                {/* 4. Inventory Management */}
                <article className="card" role="listitem" id="card-inventory">
                  <div className="card-text">
                    <h3>إدارة المخزون الذكية</h3>
                    <p>تتبع مخزنك بشكل لحظي وتجنب نفاذ المنتجات الأكثر مبيعاً.</p>
                  </div>
                  <div className="card-side">
                    <span className="tile">
                      <svg viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M4.6 10.4 14.8 15.6V29L4.6 23.4Z" fill="url(#gLeft)"/>
                        <path d="M14.8 15.6 25.4 10.4V23.4L14.8 29Z" fill="url(#gRight)"/>
                        <path d="M4.6 10.4 14.8 5.2 25.4 10.4 14.8 15.6Z" fill="url(#gTop)"/>
                        <path d="M14.8 15.6V29M4.6 10.4l10.2 5.2 10.6-5.2" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.1" strokeLinejoin="round"/>
                        <circle cx="27.6" cy="5.4" r="1.7" fill="#a561ff"/>
                      </svg>
                    </span>
                    <span className="go" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </article>

                {/* 5. High Security */}
                <article className="card" role="listitem" id="card-security">
                  <div className="card-text">
                    <h3>أمان عالي</h3>
                    <p>حماية متقدمة لبياناتك ومعاملاتك المالية.</p>
                  </div>
                  <div className="card-side">
                    <span className="tile">
                      <svg viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M16 3.4 26.4 7v8.2c0 6.3-4.3 10.6-10.4 13.2C9.9 25.8 5.6 21.5 5.6 15.2V7Z" fill="url(#gShield)"/>
                        <path d="M16 6.6 23.4 9.2v5.8c0 4.7-3 7.9-7.4 9.9-4.4-2-7.4-5.2-7.4-9.9V9.2Z" fill="#fff"/>
                        <path d="m11.8 15.6 3 3 5.6-6.2" fill="none" stroke="#3f45e8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="go" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </article>

                {/* 6. Professional Reports */}
                <article className="card" role="listitem" id="card-reports">
                  <div className="card-text">
                    <h3>تقارير احترافية</h3>
                    <p>تقارير شاملة تساعدك على تطوير عملك ونموه.</p>
                  </div>
                  <div className="card-side">
                    <span className="tile">
                      <svg viewBox="0 0 32 32" aria-hidden="true">
                        <rect x="7.2" y="4.6" width="17.6" height="22.8" rx="3.4" fill="url(#gDoc)"/>
                        <circle cx="10.4" cy="7.8" r="1" fill="#b7d4ff"/>
                        <path d="M11.4 12.6h9.6M11.4 16.6h9.6M11.4 20.6h9.6" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className="go" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </article>

                {/* 7. Product Management */}
                <article className="card" role="listitem" id="card-products">
                  <div className="card-text">
                    <h3>إدارة المنتجات</h3>
                    <p>أضف وعدل منتجاتك بسهولة وتحكم كامل في مواصفاتها.</p>
                  </div>
                  <div className="card-side">
                    <span className="tile">
                      <svg viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M4.6 10.4 14.8 15.6V29L4.6 23.4Z" fill="url(#gBlueL)"/>
                        <path d="M14.8 15.6 25.4 10.4V23.4L14.8 29Z" fill="url(#gBlueR)"/>
                        <path d="M4.6 10.4 14.8 5.2 25.4 10.4 14.8 15.6Z" fill="url(#gBlueT)"/>
                        <path d="M14.8 15.6V29M4.6 10.4l10.2 5.2 10.6-5.2" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="1.2" strokeLinejoin="round"/>
                        <path d="M9.6 18.6v4.2M19.8 18.6v4.2" stroke="#fff" strokeOpacity=".55" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className="go" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </article>
              </div>

              {/* Stats Column */}
              <img
                className="img-stats"
                src="/assets/stats_raw.png"
                alt="لوحة إحصائيات ونمو المبيعات ثلاثية الأبعاد"
              />
              <span className="pill pill-stats" id="pill-tools"><i className="dot"></i>أدوات نجاحك</span>
              <h2 className="stats-title">اعرف أين يذهب كل درهم</h2>
              <p className="stats-text">
                <span>تقارير مفصلة ورؤية واضحة لأداء متجرك، تساعدك على</span>
                <span>اتخاذ قرارات أفضل وزيادة أرباحك بكل ثقة.</span>
              </p>
              <ul className="checks">
                <li><i className="chk"><svg viewBox="0 0 24 24"><path d="m6 12.6 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg></i>مراقبة المبيعات والمخزون</li>
                <li><i className="chk"><svg viewBox="0 0 24 24"><path d="m6 12.6 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg></i>تحليل سلوك العملاء</li>
                <li><i className="chk"><svg viewBox="0 0 24 24"><path d="m6 12.6 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg></i>توقعات النمو المستقبلية</li>
              </ul>
            </div>
          </section>

          {/* ==================== PRICING SECTION (USD) ==================== */}
          <section className="pricing-section" id="pricing">
            <span className="pill pill-top"><i className="dot"></i>باقات الاشتراك</span>
            <h2 className="sec-title">اختر الباقة المناسبة لمتجرك</h2>
            <p className="sec-sub">
              <span>خدمات استخبارات وإدارة أرباح متقدمة بدون فترات تجريبية أو رسوم خفية.</span>
            </p>

            <div className="pricing-grid">
              {/* Starter $40 */}
              <div className="price-card">
                <div>
                  <h3 style={{ fontSize: "calc(20 * var(--u))", fontWeight: "800", color: "var(--navy)" }}>باقة البداية (Starter)</h3>
                  <p style={{ fontSize: "calc(12 * var(--u))", color: "var(--muted)", marginTop: "calc(4 * var(--u))" }}>للمتاجر الناشئة ورواد التجارة</p>
                  <div className="price-amount">$40 <small style={{ fontSize: "calc(13 * var(--u))", fontWeight: "normal", color: "var(--muted)" }}>/ شهر</small></div>
                  <ul className="price-features">
                    <li>✓ متجر إلكتروني واحد متصل</li>
                    <li>✓ حتى 250 منتج نشط في المخزن</li>
                    <li>✓ حتى 1,000 طلب ومبيعة شهرياً</li>
                    <li>✓ حساب تلقائي لصافي الأرباح</li>
                    <li>✓ تنبيهات انخفاض المخزون</li>
                  </ul>
                </div>
                <Link href="/sign-up" className="price-btn">اشترك في البداية ($40)</Link>
              </div>

              {/* Pro $150 */}
              <div className="price-card featured">
                <div>
                  <div style={{ display: "inline-block", background: "linear-gradient(90deg, #6a3dff, #2b6bff)", color: "#fff", padding: "calc(3 * var(--u)) calc(12 * var(--u))", borderRadius: "calc(10 * var(--u))", fontSize: "calc(11 * var(--u))", fontWeight: "800", marginBottom: "calc(8 * var(--u))" }}>
                    الأكثر طلباً ⭐
                  </div>
                  <h3 style={{ fontSize: "calc(20 * var(--u))", fontWeight: "800", color: "var(--navy)" }}>باقة المحترفين (Pro)</h3>
                  <p style={{ fontSize: "calc(12 * var(--u))", color: "var(--muted)", marginTop: "calc(4 * var(--u))" }}>للتجار النشطين وتوسيع المبيعات</p>
                  <div className="price-amount">$150 <small style={{ fontSize: "calc(13 * var(--u))", fontWeight: "normal", color: "var(--muted)" }}>/ شهر</small></div>
                  <ul className="price-features">
                    <li>✓ حتى 5 متاجر إلكترونية متعددة</li>
                    <li>✓ منتجات غير محدودة بالمخزن ∞</li>
                    <li>✓ مبيعات وطلبات غير محدودة ∞</li>
                    <li>✓ تحليلات أرباح ذكية وتنبؤات AI</li>
                    <li>✓ تصدير التقارير إلى Excel و PDF</li>
                    <li>✓ دعم فني ذو أولوية 24/7</li>
                  </ul>
                </div>
                <Link href="/sign-up" className="price-btn" style={{ background: "linear-gradient(90deg, #6a3dff 0%, #2b6bff 100%)" }}>اشترك في Pro ($150)</Link>
              </div>

              {/* VIP Lifetime $250 */}
              <div className="price-card">
                <div>
                  <div style={{ display: "inline-block", background: "rgba(157, 52, 253, 0.15)", color: "#9d34fd", padding: "calc(3 * var(--u)) calc(12 * var(--u))", borderRadius: "calc(10 * var(--u))", fontSize: "calc(11 * var(--u))", fontWeight: "800", marginBottom: "calc(8 * var(--u))" }}>
                    دفعة واحدة للأبد 👑
                  </div>
                  <h3 style={{ fontSize: "calc(20 * var(--u))", fontWeight: "800", color: "var(--navy)" }}>باقة VIP مدى الحياة</h3>
                  <p style={{ fontSize: "calc(12 * var(--u))", color: "var(--muted)", marginTop: "calc(4 * var(--u))" }}>وصول كامل غير محدود للأبد</p>
                  <div className="price-amount">$250 <small style={{ fontSize: "calc(13 * var(--u))", fontWeight: "bold", color: "#9d34fd" }}>مرة واحدة للأبد</small></div>
                  <ul className="price-features">
                    <li>✓ وصول مدى الحياة بدون أي تجديد</li>
                    <li>✓ متاجر إلكترونية غير محدودة ∞</li>
                    <li>✓ منتجات ومبيعات غير محدودة ∞</li>
                    <li>✓ ربط API مخصص ومباشر</li>
                    <li>✓ مدير حساب مخصص على مدار الساعة</li>
                    <li>✓ كافة التحديثات القادمة مجاناً للأبد</li>
                  </ul>
                </div>
                <Link href="/sign-up" className="price-btn">امتلك VIP للأبد ($250)</Link>
              </div>
            </div>
          </section>

          {/* ==================== ABOUT & CONTACT FOOTER ==================== */}
          <footer className="site-footer" id="about">
            <div id="contact" style={{ textAlign: "center", padding: "calc(40 * var(--u)) 0 calc(24 * var(--u))", borderTop: "1px solid rgba(214, 222, 247, 0.6)" }}>
              <h3 style={{ fontSize: "calc(18 * var(--u))", fontWeight: "800", color: "var(--navy)", marginBottom: "calc(8 * var(--u))" }}>
                رادار التاجر | شريكك الاستراتيجي في التجارة الإلكترونية
              </h3>
              <p style={{ fontSize: "calc(12 * var(--u))", color: "var(--muted)", maxWidth: "calc(600 * var(--u))", margin: "0 auto calc(16 * var(--u))", lineHeight: "1.7" }}>
                نمكن رواد الأعمال وأصحاب المتاجر الإلكترونية من التحكم الكامل في مبيعاتهم ومخزونهم ومضاعفة أرباحهم الصافية عبر أحدث أدوات التحليل الذكية.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "calc(16 * var(--u))", fontSize: "calc(12 * var(--u))", color: "var(--ink)", marginBottom: "calc(20 * var(--u))" }}>
                <a href="mailto:support@traders-radar.com" style={{ color: "var(--blue)", fontWeight: "700" }}>support@traders-radar.com</a>
                <span>•</span>
                <span>دعم فني مباشر 24/7</span>
                <span>•</span>
                <span>حماية مشفرة 100%</span>
              </div>
              <p style={{ fontSize: "calc(11 * var(--u))", color: "var(--muted)" }}>
                © 2026 رادار التاجر (Trader's Radar). جميع الحقوق محفوظة.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
