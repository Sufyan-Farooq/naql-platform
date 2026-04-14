'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

const NAV = [
  { href: '/admin', label: 'نظرة عامة', labelEn: 'Overview', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { href: '/admin/registrations', label: 'طلبات التسجيل', labelEn: 'Registrations', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/admin/loads', label: 'الأحمال والطلبات', labelEn: 'Loads & Orders', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  { href: '/admin/analytics', label: 'التقارير والتحليلات', labelEn: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lang, setLang, logout, currentUser } = useAppContext();
  const isAr = lang === 'ar';

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--surface)' }}>
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col" style={{ background: 'var(--navy)', minHeight: '100vh' }}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <Image src="/logo.svg" alt="NAQL Admin" width={32} height={32} className="object-contain" priority />
            </div>
            <span className="font-bold text-white text-lg">{isAr ? 'نقل | Admin' : 'NAQL | Admin'}</span>
          </Link>
        </div>

        {/* Admin badge */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-lg" style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber)' }}>
          <div className="text-xs text-amber/60 mb-0.5">{isAr ? 'المدير' : 'Administrator'}</div>
          <div className="text-sm font-bold text-white truncate">{currentUser?.name || 'Admin'}</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 mt-2">
          {NAV.map(item => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? 'var(--amber-dim)' : 'transparent',
                  color: active ? 'var(--amber)' : 'rgba(255,255,255,0.6)',
                  borderLeft: active ? '3px solid var(--amber)' : '3px solid transparent',
                }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {isAr ? item.label : item.labelEn}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={() => setLang(isAr ? 'en' : 'ar')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            {isAr ? 'English' : 'العربية'}
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {isAr ? 'تسجيل الخروج' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
