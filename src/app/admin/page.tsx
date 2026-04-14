'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

interface Overview {
  totalShippers: number;
  totalCarriers: number;
  pendingShippers: number;
  pendingCarriers: number;
  activeLoads: number;
  totalBids: number;
  activeTrips: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => setData(d.overview))
      .finally(() => setLoading(false));
  }, []);

  const t = {
    title: isAr ? 'لوحة التحكم' : 'Admin Dashboard',
    sub:   isAr ? 'نظرة عامة على أداء منصة نقل' : 'Platform performance overview',
    shippers:   isAr ? 'الشاحنون' : 'Shippers',
    carriers:   isAr ? 'الناقلون' : 'Carriers',
    activeLoads:isAr ? 'أحمال نشطة' : 'Active Loads',
    bids:       isAr ? 'إجمالي العروض' : 'Total Bids',
    trips:      isAr ? 'رحلات جارية' : 'Active Trips',
    revenue:    isAr ? 'إجمالي العمولات' : 'Total Commission',
    pending:    isAr ? 'بانتظار الموافقة' : 'Awaiting Approval',
    viewAll:    isAr ? 'عرض الكل' : 'View All',
    quickActions: isAr ? 'إجراءات سريعة' : 'Quick Actions',
    goRegistrations: isAr ? 'مراجعة التسجيلات' : 'Review Registrations',
    goLoads:    isAr ? 'إدارة الأحمال' : 'Manage Loads',
    goAnalytics:isAr ? 'التقارير التفصيلية' : 'Detailed Analytics',
  };

  const sar = (n: number) => `${n.toLocaleString(isAr ? 'ar-SA' : 'en-US')} ${isAr ? 'ر.س' : 'SAR'}`;

  const KPI = ({ label, value, sub, color, href }: { label: string; value: string | number; sub?: string; color: string; href?: string }) => (
    <div className="card p-6" style={{ borderTop: `3px solid ${color}` }}>
      <div className="text-text-muted text-sm mb-2">{label}</div>
      <div className="font-mono text-3xl font-bold mb-1" style={{ color: 'var(--text-primary-dark)' }}>
        {loading ? <div className="h-8 w-24 bg-surface-mid rounded animate-pulse" /> : value}
      </div>
      {sub && <div className="text-xs font-medium" style={{ color }}>{sub}</div>}
      {href && <Link href={href} className="text-xs text-amber hover:underline mt-2 inline-block font-bold">{t.viewAll} →</Link>}
    </div>
  );

  const total = (data?.pendingShippers ?? 0) + (data?.pendingCarriers ?? 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-1 ${isAr ? 'font-display-ar' : 'font-display-en'}`} style={{ color: 'var(--text-primary-dark)' }}>{t.title}</h1>
        <p className="text-text-muted">{t.sub}</p>
      </div>

      {/* Pending banner */}
      {(total > 0) && (
        <Link href="/admin/registrations" className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:opacity-90 transition-opacity" style={{ background: 'rgba(232,131,10,0.08)', border: '1px solid rgba(232,131,10,0.3)' }}>
          <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-white font-bold text-lg shrink-0">{total}</div>
          <div>
            <div className="font-bold text-amber">{isAr ? 'طلبات تسجيل بانتظار موافقتك' : 'Registration requests awaiting your approval'}</div>
            <div className="text-sm text-text-muted">{isAr ? `${data?.pendingShippers ?? 0} شاحن، ${data?.pendingCarriers ?? 0} ناقل` : `${data?.pendingShippers ?? 0} shippers, ${data?.pendingCarriers ?? 0} carriers`}</div>
          </div>
          <svg className="w-5 h-5 text-amber ms-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAr ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>
        </Link>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPI label={t.shippers} value={(data?.totalShippers ?? 0)} sub={data ? `${data.pendingShippers} ${t.pending}` : undefined} color="var(--amber)" href="/admin/registrations?role=shipper" />
        <KPI label={t.carriers} value={(data?.totalCarriers ?? 0)} sub={data ? `${data.pendingCarriers} ${t.pending}` : undefined} color="var(--teal)" href="/admin/registrations?role=carrier" />
        <KPI label={t.activeLoads} value={(data?.activeLoads ?? 0)} color="#6366f1" href="/admin/loads" />
        <KPI label={t.bids} value={(data?.totalBids ?? 0)} color="#f59e0b" />
        <KPI label={t.trips} value={(data?.activeTrips ?? 0)} color="#10b981" />
        <KPI label={t.revenue} value={data ? sar(data.totalRevenue) : '—'} color="var(--amber)" href="/admin/analytics" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary-dark)' }}>{t.quickActions}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/admin/registrations', label: t.goRegistrations, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'var(--amber)' },
            { href: '/admin/loads', label: t.goLoads, icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', color: '#6366f1' },
            { href: '/admin/analytics', label: t.goAnalytics, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: '#10b981' },
          ].map(a => (
            <Link key={a.href} href={a.href} className="card p-5 flex items-center gap-4 hover:border-amber transition-colors cursor-pointer">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${a.color}15` }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: a.color }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={a.icon} /></svg>
              </div>
              <span className="font-bold" style={{ color: 'var(--text-primary-dark)' }}>{a.label}</span>
              <svg className="w-4 h-4 text-text-muted ms-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAr ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
