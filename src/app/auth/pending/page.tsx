'use client';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function PendingPage() {
  const { lang, logout } = useAppContext();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--surface)' }}>
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-amber-dim flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className={`text-3xl font-bold mb-3 ${isAr ? 'font-display-ar' : 'font-display-en'}`} style={{ color: 'var(--text-primary-dark)' }}>
          {isAr ? 'طلبك قيد المراجعة' : 'Your Account is Pending Review'}
        </h1>

        <p className="text-text-muted text-lg leading-relaxed mb-8">
          {isAr
            ? 'شكراً لتسجيلك في منصة نقل. سيقوم فريقنا بمراجعة بياناتك والتحقق من السجل التجاري والموافقة على حسابك خلال 24 ساعة عمل.'
            : "Thank you for registering with NAQL. Our team will review your details and approve your account within 24 business hours."}
        </p>

        <div className="bg-surface-mid border border-amber/20 rounded-xl p-5 mb-8 text-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse" />
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary-dark)' }}>
              {isAr ? 'ما الذي يحدث الآن؟' : "What happens next?"}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-text-muted">
            {(isAr ? [
              'يراجع فريق نقل بياناتك وسجلك التجاري',
              'ستصلك رسالة بريد إلكتروني عند الموافقة',
              'يمكنك تسجيل الدخول مجدداً لاستخدام المنصة بعد الموافقة',
            ] : [
              'NAQL team reviews your business registration',
              "You'll receive an email when your account is approved",
              'Login again after approval to start using the platform',
            ]).map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-amber font-bold mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-ghost flex-1 justify-center">
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
          <button onClick={logout} className="btn-primary flex-1 justify-center">
            {isAr ? 'تسجيل خروج' : 'Sign Out'}
          </button>
        </div>

        <p className="text-xs text-text-muted mt-6">
          {isAr ? 'لأي استفسار: ' : 'For inquiries: '}
          <a href="mailto:info@naql.sa" className="text-amber hover:underline">info@naql.sa</a>
        </p>
      </div>
    </div>
  );
}
