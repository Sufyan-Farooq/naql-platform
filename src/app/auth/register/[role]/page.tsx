'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function RegisterPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = use(params);
  const router = useRouter();
  const { lang, setLang } = useAppContext();

  const [form, setForm] = useState({ name: '', company: '', mobile: '', email: '', crNumber: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAr = lang === 'ar';
  const isCarrier = role === 'carrier';

  const t = {
    title:    isAr ? (isCarrier ? 'إنشاء حساب ناقل' : 'إنشاء حساب شاحن') : (isCarrier ? 'Create Carrier Account' : 'Create Shipper Account'),
    sub:      isAr ? 'سجل الآن للوصول إلى أكبر منصة شحن في المملكة' : 'Register now to access the largest freight platform in the Kingdom',
    fName:    isAr ? 'الاسم الكامل' : 'Full Name',
    fCompany: isAr ? 'اسم الشركة / المؤسسة' : 'Company Name',
    fMobile:  isAr ? 'رقم الجوال (+966)' : 'Mobile (+966)',
    fEmail:   isAr ? 'البريد الإلكتروني' : 'Email Address',
    fCR:      isAr ? 'رقم السجل التجاري' : 'CR Number',
    fPwd:     isAr ? 'كلمة المرور' : 'Password',
    fPwdConfirm: isAr ? 'تأكيد كلمة المرور' : 'Confirm Password',
    btn:      isAr ? 'إنشاء حساب' : 'Create Account',
    hasAccount: isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    login:    isAr ? 'تسجيل الدخول هنا' : 'Login here',
    langToggle: isAr ? 'English' : 'العربية',
    leftTitle:  isAr ? 'منظومة نقل متكاملة' : 'Integrated Freight Ecosystem',
    leftSub:    isAr ? 'انضم إلى آلاف الشركات التي تعتمد على منصة نقل يومياً.' : 'Join thousands of companies relying on NAQL daily to streamline their logistics.',
    pendingNote: isAr 
      ? 'سيتم مراجعة طلبك من قِبل فريق نقل والموافقة عليه خلال 24 ساعة عمل.'
      : 'Your account will be reviewed and approved by the NAQL team within 24 business hours.',
    pwdMismatch: isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match',
    emailTaken:  isAr ? 'البريد الإلكتروني مسجل مسبقاً' : 'Email already registered',
    errServer:   isAr ? 'حدث خطأ. حاول مرة أخرى.' : 'Server error. Please try again.',
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError(t.pwdMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          password: form.password,
          phone: form.mobile || null,
          crNumber: form.crNumber || null,
          role: isCarrier ? 'carrier' : 'shipper',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) setError(t.emailTaken);
        else setError(t.errServer);
        return;
      }

      // Redirect to pending page (account awaits admin approval)
      router.push('/auth/pending');
    } catch {
      setError(t.errServer);
    } finally {
      setIsLoading(false);
    }
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex min-h-screen font-ar" style={{ background: 'var(--surface)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-[45%] text-[#FAF7F2] p-12 relative overflow-hidden grain" style={{ background: '#0D1B2A' }}>
        <Link href="/" className="inline-flex items-center gap-3 z-10 w-fit cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-amber flex items-center justify-center font-bold text-white text-xl">N</div>
          <span className="font-bold text-2xl tracking-wide">{isAr ? 'نقل | NAQL' : 'NAQL | نقل'}</span>
        </Link>
        <div className="flex-1 flex flex-col justify-center mt-12 z-10">
          <h1 className={`${isAr ? 'font-display-ar' : 'font-display-en'} text-5xl font-bold mb-4`}>{t.leftTitle}</h1>
          <p className="text-xl text-[#FAF7F2]/80 mb-12 max-w-md">{t.leftSub}</p>
          <div className="bg-white/5 border border-amber/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm text-[#FAF7F2]/70 leading-relaxed">{t.pendingNote}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-teal rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <div className="absolute top-8 right-8 lg:left-8 lg:right-auto">
          <button onClick={() => setLang(isAr ? 'en' : 'ar')} className="text-sm font-medium hover:text-amber transition-colors" style={{ color: 'var(--text-primary-dark)' }}>
            {t.langToggle}
          </button>
        </div>

        <div className="w-full max-w-[480px]">
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10 w-fit mx-auto">
            <div className="w-10 h-10 rounded-lg bg-amber flex items-center justify-center font-bold text-white text-xl">N</div>
            <span className="font-bold text-2xl" style={{ color: 'var(--text-primary-dark)' }}>{isAr ? 'نقل | NAQL' : 'NAQL | نقل'}</span>
          </Link>

          <h2 className={`text-3xl font-bold mb-2 text-center lg:text-start ${isAr ? 'font-display-ar' : 'font-display-en'}`} style={{ color: 'var(--text-primary-dark)' }}>{t.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>{t.sub}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium" dir="auto">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="naql-label">{t.fName}</label><input className="naql-input" required value={form.name} onChange={update('name')} /></div>
              <div><label className="naql-label">{t.fCompany}</label><input className="naql-input" required value={form.company} onChange={update('company')} /></div>
            </div>

            <div><label className="naql-label">{t.fEmail}</label><input type="email" className="naql-input" required value={form.email} onChange={update('email')} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="naql-label">{t.fMobile}</label><input type="tel" className="naql-input" value={form.mobile} onChange={update('mobile')} /></div>
              <div><label className="naql-label">{t.fCR}</label><input className="naql-input" value={form.crNumber} onChange={update('crNumber')} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="naql-label">{t.fPwd}</label><input type="password" className="naql-input" required minLength={8} value={form.password} onChange={update('password')} /></div>
              <div><label className="naql-label">{t.fPwdConfirm}</label><input type="password" className="naql-input" required value={form.confirmPassword} onChange={update('confirmPassword')} /></div>
            </div>

            <button type="submit" className="btn-primary w-full h-[52px] text-lg mt-4 relative" disabled={isLoading}>
              {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : t.btn}
            </button>
          </form>

          <div className="mt-8 text-center font-medium">
            <span style={{ color: 'var(--text-muted)' }}>{t.hasAccount} </span>
            <Link href="/auth/login" className="text-amber font-bold hover:underline">{t.login}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
