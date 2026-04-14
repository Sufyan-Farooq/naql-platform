'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

interface PortalLayoutProps {
  children: ReactNode;
  role: 'shipper' | 'carrier';
}

const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  sun:  'M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M19.79 17.5l-.87-.5M4.21 6.5l.87.5M21 12h-1M4 12H3m15.36-5.64L17 7.72M7 16.28l-1.36 1.36M17 16.28l1.36 1.36M7 7.72L5.64 6.36M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
};

export default function PortalLayout({ children, role }: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, lang, setLang, theme, setTheme } = useAppContext();
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

  // Protect route
  React.useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
    } else if (currentUser.role !== role.toUpperCase()) {
      router.push(currentUser.role === 'SHIPPER' ? '/shipper/dashboard' : '/carrier/loads');
    }
  }, [currentUser, role, router]);

  if (!currentUser) return null;

  const shipperNav = [
    {
      nameAr: 'الرئيسية',        nameEn: 'Dashboard',
      path: '/shipper/dashboard',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    },
    {
      nameAr: 'نشر حمولة',       nameEn: 'Post a Load',
      path: '/shipper/post-load', highlight: true,
      icon: 'M12 4v16m8-8H4',
    },
    {
      nameAr: 'عروض الأسعار',    nameEn: 'Bids',
      path: '/shipper/bids',
      icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z',
    },
    {
      nameAr: 'شحناتي',           nameEn: 'Shipments',
      path: '/shipper/shipments',
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
    },
    {
      nameAr: 'المدفوعات',        nameEn: 'Payments',
      path: '/shipper/payments',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    },
  ];

  const carrierNav = [
    {
      nameAr: 'لوحة العروض',     nameEn: 'Load Board',
      path: '/carrier/loads',    highlight: true,
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      nameAr: 'عروضي',            nameEn: 'My Bids',
      path: '/carrier/bids',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    },
    {
      nameAr: 'رحلاتي',           nameEn: 'My Trips',
      path: '/carrier/trips',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
      nameAr: 'المدفوعات',        nameEn: 'Earnings',
      path: '/carrier/earnings',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      nameAr: 'أسطولي',           nameEn: 'My Fleet',
      path: '/carrier/fleet',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    },
  ];

  const navItems = role === 'shipper' ? shipperNav : carrierNav;

  const handleLogout = () => {
    logout();
  };

  const currentPageTitle = navItems.find(i => pathname.startsWith(i.path));

  return (
    <div
      className="portal-layout"
      style={{ fontFamily: isAr ? 'Tajawal, Cairo, sans-serif' : 'DM Sans, sans-serif' }}
    >
      {/* ── SIDEBAR ── */}
      <aside className="sidebar pb-8">
        <div style={{ height:72, display:'flex', alignItems:'center', padding:'0 24px', borderBottom:'1px solid var(--border)', marginBottom:8 }}>
          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{ width:32, height:32, borderRadius:6, background:'var(--amber)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <path d="M2 14L6 6l4 6 4-8 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 4l-4 0 0 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--text-primary-dark)', letterSpacing:'0.02em' }}>
              {isAr ? 'نقل' : 'NAQL'}
            </span>
          </Link>
        </div>

        <nav style={{ flex:1, padding:'8px 8px' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'8px 12px 12px' }}>
            {isAr ? 'القائمة الرئيسية' : 'Navigation'}
          </div>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''} ${item.highlight && !isActive ? 'border border-amber/30 text-amber' : ''}`}
                style={item.highlight && !isActive ? { borderColor:'rgba(232,131,10,0.3)', color:'var(--amber)' } : {}}
              >
                <svg className="w-5 h-5 opacity-80 shrink-0" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{isAr ? item.nameAr : item.nameEn}</span>
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div style={{ padding:'0 12px', marginTop:'auto' }}>
          <div style={{ background:'var(--surface-mid)', borderRadius:8, padding:16, display:'flex', gap:12, alignItems:'center', border:'1px solid var(--border)', marginBottom:8 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(232,131,10,0.2)', border:'1px solid rgba(232,131,10,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--amber)', fontWeight:700, fontSize:16, flexShrink:0 }}>
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary-dark)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {currentUser.company || currentUser.name}
              </div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                {role === 'shipper' ? (isAr ? 'شاحن' : 'Shipper') : (isAr ? 'ناقل' : 'Carrier')}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:6, background:'none', border:'1px solid var(--border)', color:'var(--text-muted)', cursor:'pointer', fontSize:13, transition:'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.color='var(--text-primary-dark)'; e.currentTarget.style.borderColor='var(--amber)'; }}
            onMouseOut={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border)'; }}
          >
            <Icon d={ICONS.logout} size={16} />
            {isAr ? 'تسجيل الخروج' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className="portal-main">
        {/* Header */}
        <header className="portal-header">
          <div style={{ fontWeight:700, fontSize:'1.05rem', color:'var(--text-primary-dark)', fontFamily: isAr ? 'Tajawal, Cairo, sans-serif' : 'inherit' }}>
            {isAr ? currentPageTitle?.nameAr : currentPageTitle?.nameEn || (isAr ? 'لوحة التحكم' : 'Dashboard')}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              style={{
                width:36, height:36, borderRadius:6, border:'1px solid var(--border)',
                background:'var(--surface-card)', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--text-muted)', transition:'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor='var(--amber)'; e.currentTarget.style.color='var(--amber)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}
            >
              <Icon d={isDark ? ICONS.sun : ICONS.moon} size={17} />
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              style={{
                padding:'6px 12px', borderRadius:6, border:'1px solid var(--border)',
                background:'var(--surface-card)', cursor:'pointer',
                fontSize:12, fontWeight:700, color:'var(--text-muted)', transition:'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor='var(--amber)'; e.currentTarget.style.color='var(--amber)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}
            >
              {isAr ? 'EN' : 'عربي'}
            </button>

            {/* Notifications */}
            <button
              style={{ width:36, height:36, borderRadius:6, border:'1px solid var(--border)', background:'var(--surface-card)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', position:'relative', transition:'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor='var(--amber)'}
              onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
              aria-label={isAr ? 'الإشعارات' : 'Notifications'}
            >
              <Icon d={ICONS.bell} size={17} />
              <span style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:'var(--error)', border:'1.5px solid var(--portal-header-bg)' }} />
            </button>

            {/* Avatar */}
            <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--amber)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:14, fontWeight:700 }}>
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="portal-content">
          {children}
        </div>
      </main>
    </div>
  );
}
