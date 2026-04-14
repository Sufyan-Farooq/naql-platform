'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function LoginPage() {
  const { lang, setLang } = useAppContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAr = lang === 'ar';

  const t = {
    welcome:    isAr ? 'مرحباً بعودتك' : 'Welcome Back',
    welcomeSub: isAr ? 'سجّل دخولك للوصول إلى تفاصيل شحناتك وعروض الأسعار في منصة نقل.' : 'Sign in to access your shipment details and quotes on NAQL platform.',
    feature1Title: isAr ? 'مزاد عروض شفاف' : 'Transparent Bidding',
    feature1Sub:   isAr ? 'احصل على أفضل الأسعار من مئات الناقلين' : 'Get the best rates from hundreds of carriers',
    feature2Title: isAr ? 'بوليصات ومدفوعات معتمدة' : 'Verified Waybills & Payments',
    feature2Sub:   isAr ? 'ربط مباشر مع بيان وفواتير مطابقة لهيئة الزكاة' : 'Direct Bayan integration and ZATCA compliant invoices',
    carriers:   isAr ? 'ناقل موثق'      : 'Verified Carriers',
    shipments:  isAr ? 'شحنة مكتملة'    : 'Completed Shipments',
    langToggle: isAr ? 'English'          : 'العربية',
    loginTitle: isAr ? 'تسجيل الدخول'   : 'Sign In',
    emailLabel: isAr ? 'البريد الإلكتروني' : 'Email Address',
    pwdLabel:   isAr ? 'كلمة المرور'     : 'Password',
    forgotLink: isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?',
    loginBtn:   isAr ? 'تسجيل الدخول'   : 'Sign In',
    noAccount:  isAr ? 'ليس لديك حساب؟' : "Don't have an account?",
    amShipper:  isAr ? 'أنا شاحن'        : "I'm a Shipper",
    amCarrier:  isAr ? 'أنا ناقل'         : "I'm a Carrier",
    errInvalid: isAr ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password',
    errServer:  isAr ? 'حدث خطأ في الخادم. حاول مجدداً.' : 'Server error. Please try again.',
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(res.status === 401 ? t.errInvalid : t.errServer);
        return;
      }

      const { user } = data;

      // Redirect based on role
      if (user.role === 'ADMIN') router.push('/admin');
      else if (user.role === 'CARRIER') {
        if (user.status !== 'APPROVED') router.push('/auth/pending');
        else router.push('/carrier/loads');
      } else {
        if (user.status !== 'APPROVED') router.push('/auth/pending');
        else router.push('/shipper/dashboard');
      }
    } catch {
      setError(t.errServer);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-ar" style={{ background: 'var(--surface)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-[45%] text-white p-12 relative overflow-hidden grain" style={{ background: 'var(--navy)' }}>
        <Link href="/" className="inline-flex items-center gap-3 z-10 w-fit cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <Image src="/logo.svg" alt="NAQL" width={40} height={40} className="object-contain" priority />
          </div>
          <span className="font-display-ar font-bold text-2xl tracking-wide">{isAr ? 'نقل | NAQL' : 'NAQL | نقل'}</span>
        </Link>
        
        <div className="flex-1 flex flex-col justify-center mt-12 z-10">
          <h1 className={isAr ? 'font-display-ar text-5xl font-bold mb-4' : 'font-display-en text-5xl font-bold mb-4'}>{t.welcome}</h1>
          <p className="text-xl text-[#FAF7F2]/80 mb-12 max-w-md">{t.welcomeSub}</p>
          <div className="space-y-6">
            {[{ icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: t.feature1Title, sub: t.feature1Sub, color: 'amber' },
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: t.feature2Title, sub: t.feature2Sub, color: 'teal' }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center`} style={{ borderColor: i === 0 ? 'rgba(232,131,10,0.3)' : 'rgba(38,166,154,0.4)', color: i === 0 ? 'var(--amber)' : '#4db6ac' }}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{f.title}</h3>
                  <p className="text-sm text-[#FAF7F2]/60">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 right-12 z-10 flex gap-12 font-mono opacity-60">
          <div><div className="text-amber text-xl font-bold">2,500+</div><div className="text-xs font-sans mt-1">{t.carriers}</div></div>
          <div><div className="text-amber text-xl font-bold">50K+</div><div className="text-xs font-sans mt-1">{t.shipments}</div></div>
        </div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-amber rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <div className="absolute top-8 right-8 lg:left-8 lg:right-auto">
          <button onClick={() => setLang(isAr ? 'en' : 'ar')} className="text-sm font-medium hover:text-amber transition-colors" style={{ color: 'var(--text-primary-dark)' }}>
            {t.langToggle}
          </button>
        </div>

        <div className="w-full max-w-[420px]">
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10 w-fit mx-auto">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <Image src="/logo.svg" alt="NAQL" width={40} height={40} className="object-contain" priority />
            </div>
            <span className="font-bold text-2xl" style={{ color: 'var(--text-primary-dark)' }}>{isAr ? 'نقل | NAQL' : 'NAQL | نقل'}</span>
          </Link>

          <h2 className={`text-3xl font-bold mb-8 text-center lg:text-start ${isAr ? 'font-display-ar' : 'font-display-en'}`} style={{ color: 'var(--text-primary-dark)' }}>
            {t.loginTitle}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium" dir="auto">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="naql-label">{t.emailLabel}</label>
              <input type="email" className="naql-input" placeholder="ex@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="naql-label mb-0">{t.pwdLabel}</label>
                <a href="#" className="text-sm font-bold text-amber hover:underline">{t.forgotLink}</a>
              </div>
              <input type="password" className="naql-input mt-1" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary w-full h-[52px] text-lg mt-2 relative" disabled={isLoading}>
              {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : t.loginBtn}
            </button>
          </form>

          <div className="mt-10 text-center font-medium">
            <span className="text-text-muted">{t.noAccount} </span>
            <div className="flex items-center justify-center gap-4 mt-2">
              <Link href="/auth/register/shipper" className="text-amber font-bold hover:underline">{t.amShipper}</Link>
              <span style={{ color: 'var(--border)' }}>|</span>
              <Link href="/auth/register/carrier" className="font-bold hover:underline" style={{ color: 'var(--text-primary-dark)' }}>{t.amCarrier}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
