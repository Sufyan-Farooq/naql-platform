'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  overview: {
    totalShippers: number; totalCarriers: number;
    pendingShippers: number; pendingCarriers: number;
    activeLoads: number; totalBids: number; activeTrips: number; totalRevenue: number;
  };
  weeklyData: Array<{ week: string; loads: number; bids: number; revenue: number; shippers: number; carriers: number }>;
  topRoutes: Array<{ route: string; count: number }>;
  cargoDistribution: Array<{ type: string; value: number }>;
  topCarriers: Array<{ id: string; name: string; company: string; _count: { bids: number; trips: number } }>;
}

const COLORS = ['#E8830A', '#26A69A', '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'demand' | 'revenue' | 'signups'>('demand');

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const t = {
    title:         isAr ? 'التقارير والتحليلات' : 'Reports & Analytics',
    sub:           isAr ? 'بيانات حية لفهم الطلب والعرض واتخاذ قرارات استراتيجية' : 'Live data to understand demand & supply and make strategic decisions',
    demandSupply:  isAr ? 'الطلب والعرض' : 'Demand & Supply',
    revenue:       isAr ? 'العمولات' : 'Commission Revenue',
    signups:       isAr ? 'التسجيلات' : 'Signups',
    loads:         isAr ? 'أحمال' : 'Loads',
    bids:          isAr ? 'عروض' : 'Bids',
    shippers:      isAr ? 'شاحنون' : 'Shippers',
    carriers:      isAr ? 'ناقلون' : 'Carriers',
    topRoutes:     isAr ? 'أعلى المسارات طلباً' : 'Top Routes by Volume',
    cargoTitle:    isAr ? 'توزيع أنواع البضائع' : 'Cargo Type Distribution',
    topCarriers:   isAr ? 'أكثر الناقلين نشاطاً' : 'Most Active Carriers',
    revenueLabel:  isAr ? 'العمولة (ر.س)' : 'Commission (SAR)',
    sar:           isAr ? 'ر.س' : 'SAR',
    noData:        isAr ? 'لا توجد بيانات بعد' : 'No data yet',
  };

  const chartTabs = [
    { key: 'demand' as const, label: t.demandSupply },
    { key: 'revenue' as const, label: t.revenue },
    { key: 'signups' as const, label: t.signups },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div><div className="h-8 w-64 bg-surface-mid rounded animate-pulse mb-2" /><div className="h-4 w-96 bg-surface-mid rounded animate-pulse" /></div>
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-6 h-64 animate-pulse bg-surface-mid" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl font-bold mb-1 ${isAr ? 'font-display-ar' : ''}`} style={{ color: 'var(--text-primary-dark)' }}>{t.title}</h1>
        <p className="text-text-muted">{t.sub}</p>
      </div>

      {/* Main Chart */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-surface-mid">
          {chartTabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveChart(tab.key)}
              className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeChart === tab.key ? 'border-amber text-amber' : 'border-transparent text-text-muted hover:text-navy'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeChart === 'demand' && (
            <>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary-dark)' }}>{isAr ? 'الأحمال المنشورة مقابل العروض المقدمة' : 'Loads Posted vs Bids Submitted'}</h3>
              <p className="text-xs text-text-muted mb-6">{isAr ? 'أسبوعياً — آخر 8 أسابيع' : 'Weekly — last 8 weeks'}</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="loads" name={t.loads} stroke="#E8830A" strokeWidth={2.5} dot={{ fill: '#E8830A', r: 4 }} />
                  <Line type="monotone" dataKey="bids" name={t.bids} stroke="#26A69A" strokeWidth={2.5} dot={{ fill: '#26A69A', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
          {activeChart === 'revenue' && (
            <>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary-dark)' }}>{isAr ? 'العمولات الأسبوعية' : 'Weekly Commission Revenue'}</h3>
              <p className="text-xs text-text-muted mb-6">{isAr ? '5% من العروض المقبولة' : '5% of accepted bid values'}</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
                    formatter={(v: any) => [`${Number(v).toLocaleString()} ${t.sar}`, t.revenueLabel]} />
                  <Bar dataKey="revenue" name={t.revenueLabel} fill="#E8830A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
          {activeChart === 'signups' && (
            <>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary-dark)' }}>{isAr ? 'التسجيلات الجديدة' : 'New Registrations'}</h3>
              <p className="text-xs text-text-muted mb-6">{isAr ? 'شاحنون وناقلون أسبوعياً' : 'Shippers and carriers weekly'}</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="shippers" name={t.shippers} fill="#E8830A" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="carriers" name={t.carriers} fill="#26A69A" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Routes */}
        <div className="card p-6">
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary-dark)' }}>{t.topRoutes}</h3>
          {!data?.topRoutes?.length ? (
            <p className="text-text-muted text-sm text-center py-8">{t.noData}</p>
          ) : (
            <div className="space-y-3">
              {data.topRoutes.map((r, i) => (
                <div key={r.route} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-surface-mid flex items-center justify-center text-xs font-mono font-bold text-text-muted shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary-dark)' }}>{r.route}</div>
                    <div className="mt-1 h-1.5 rounded-full bg-amber/20">
                      <div className="h-full rounded-full bg-amber transition-all" style={{ width: `${Math.round((r.count / (data.topRoutes[0]?.count || 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm shrink-0 text-amber">{r.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cargo Pie */}
        <div className="card p-6">
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary-dark)' }}>{t.cargoTitle}</h3>
          {!data?.cargoDistribution?.length ? (
            <p className="text-text-muted text-sm text-center py-8">{t.noData}</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={data.cargoDistribution} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={70}
                    label={(props: any) => `${Math.round((props.percent || 0) * 100)}%`} labelLine={false}>
                    {data.cargoDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-3">
                {data.cargoDistribution.slice(0, 6).map((d, i) => (
                  <div key={d.type} className="flex items-center gap-1.5 text-xs text-text-muted truncate">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{d.type}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Carriers */}
        <div className="card p-6">
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary-dark)' }}>{t.topCarriers}</h3>
          {!data?.topCarriers?.length ? (
            <p className="text-text-muted text-sm text-center py-8">{t.noData}</p>
          ) : (
            <div className="space-y-3">
              {data.topCarriers.slice(0, 7).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary-dark)' }}>{c.company}</div>
                    <div className="text-xs text-text-muted">{c.name}</div>
                  </div>
                  <div className="text-end shrink-0">
                    <div className="font-mono text-sm font-bold text-amber">{c._count.bids}</div>
                    <div className="text-xs text-text-muted">{t.bids}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
