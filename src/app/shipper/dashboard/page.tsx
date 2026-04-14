'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function ShipperDashboard() {
  const { currentUser, lang, loads, trips } = useAppContext();
  
  const isAr = lang === 'ar';
  const companyName = currentUser?.company || currentUser?.name || '';

  const t = {
    greeting:      isAr ? `مرحباً، ${companyName}` : `Welcome, ${companyName}`,
    greetingSub:   isAr ? 'منصة نقل — لإدارة شحناتك وعقودك بكل سهولة.' : 'NAQL Platform — Manage your shipments and contracts easily.',
    postLoadBtn:   isAr ? 'انشر حمولتك الآن' : 'Post Your Load Now',
    activeLoads:   isAr ? 'حمولات نشطة (مزاد)' : 'Active Loads (Auction)',
    waitingBids:   isAr ? 'بانتظار العروض' : 'Awaiting Bids',
    bidsReceived:  isAr ? 'عروض مقدمة' : 'Bids Received',
    inTransit:     isAr ? 'شحنات في الطريق' : 'In Transit',
    viaGps:        isAr ? 'عبر GPS' : 'via GPS',
    deliveredThis: isAr ? 'تسليمات هذا الشهر' : 'Delivered This Month',
    vsLastMonth:   isAr ? '+12% عن الشهر الماضي' : '+12% vs last month',
    recentLoads:   isAr ? 'آخر الحمولات' : 'Recent Loads',
    viewAll:       isAr ? 'عرض الكل' : 'View All',
    colRef:        isAr ? 'رقم المرجع (Ref)' : 'Ref Number',
    colRoute:      isAr ? 'المسار' : 'Route',
    colCargo:      isAr ? 'البضاعة' : 'Cargo',
    colDate:       isAr ? 'نوع الشاحنة' : 'Truck Type',
 vehicularType: isAr ? 'نوع المركبة' : 'Vehicle Type',
    colStatus:     isAr ? 'الحالة' : 'Status',
    colBids:       isAr ? 'العروض' : 'Bids',
    ton:           isAr ? 'طن' : 'Ton',
    sActive:       isAr ? 'بحث عن ناقل' : 'Seeking Carrier',
    sPending:      isAr ? 'بانتظار الناقل' : 'Pending Assignment',
    sTransit:      isAr ? 'في الطريق' : 'In Transit',
    sDelivered:    isAr ? 'تم التسليم' : 'Delivered',
    bcount:        isAr ? 'عروض' : 'Bids',
    noLoads:       isAr ? 'لا توجد حمولات بعد.' : 'No loads yet.',
    postFirst:     isAr ? 'انشر حمولتك الأولى' : 'Post your first load',
  };

  const activeLoads = loads.filter(l => l.status === 'ACTIVE').length;
  const activeTripsCount = (trips || []).filter(t => t.status === 'IN_TRANSIT').length;
  const deliveredThisMonth = loads.filter(l => l.status === 'DELIVERED').length;

  return (
    <div className={`max-w-6xl mx-auto space-y-8 ${isAr ? 'font-ar' : 'font-en'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Welcome Banner */}
      <div className="bg-navy text-white p-8 rounded-2xl flex justify-between items-center relative overflow-hidden card-dark">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber via-navy to-navy pointer-events-none" />
        <div className="relative z-10">
          <h1 className={`${isAr ? 'font-display-ar' : 'font-display-en'} text-3xl font-bold mb-2 text-white`}>{t.greeting}</h1>
          <p className="text-white/80 text-lg">{t.greetingSub}</p>
        </div>
        <Link href="/shipper/post-load" className="btn-primary h-14 px-8 text-lg relative z-10 shadow-lg shadow-amber/20 hidden md:flex">
          {t.postLoadBtn}
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="kpi-card border-l-4 border-l-[#3980f4]">
           <div className="text-sm font-bold text-text-muted">{t.activeLoads}</div>
           <div className="kpi-number text-[#3980f4]">{activeLoads}</div>
           <div className="text-xs text-text-muted mt-2">{t.waitingBids}</div>
        </div>
        <div className="kpi-card border-l-4 border-l-amber bg-amber-dim">
           <div className="text-sm font-bold text-amber-dark">{t.bidsReceived}</div>
           <div className="kpi-number">{Object.values(loads).reduce((total, curr) => total + (curr.bidsCount || 0), 0)}</div>
           <div className="text-xs text-amber-dark/70 mt-2">{t.bidsReceived}</div>
        </div>
        <div className="kpi-card border-l-4 border-l-teal">
           <div className="text-sm font-bold text-text-muted">{t.inTransit}</div>
           <div className="kpi-number text-teal">{activeTripsCount}</div>
           <div className="text-xs text-text-muted mt-2">{t.viaGps}</div>
        </div>
        <div className="kpi-card border-l-4 border-l-navy">
           <div className="text-sm font-bold text-text-muted">{t.deliveredThis}</div>
           <div className="kpi-number text-navy">{deliveredThisMonth}</div>
           <div className="text-xs text-teal font-bold flex items-center gap-1 mt-2">
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
             {t.vsLastMonth}
           </div>
        </div>
      </div>

      {/* Recent Loads Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-surface-mid flex justify-between items-center bg-surface/50">
          <h2 className={`${isAr ? 'font-display-ar' : 'font-display-en'} font-bold text-xl`}>{t.recentLoads}</h2>
          <Link href="/shipper/bids" className="text-sm font-bold text-amber hover:underline">{t.viewAll}</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="naql-table">
            <thead>
              <tr>
                <th>{t.colRef}</th>
                <th>{t.colRoute}</th>
                <th>{t.colCargo}</th>
                <th>{t.colDate}</th>
                <th>{t.colStatus}</th>
                <th>{t.colBids}</th>
              </tr>
            </thead>
            <tbody>
              {loads.slice(0, 5).map(load => {
                const firstRoute = load.routes?.[0] || { origin: '---', destination: '---', truckType: '---', truckCount: 0 };
                const totalTrucks = load.routes?.reduce((sum, r) => sum + (r.truckCount || 0), 0) || 0;
                
                return (
                  <tr key={load.id}>
                    <td className="font-mono text-sm font-bold">{load.refNumber}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{firstRoute.origin}</span>
                        <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span className="font-bold">{firstRoute.destination}</span>
                        {(load.routes?.length || 0) > 1 && (
                          <span className="text-[10px] bg-amber-dim text-amber-dark px-1 rounded border border-amber/10">
                            +{load.routes.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-bold truncate max-w-[150px]" title={load.cargoContent}>{load.cargoContent}</div>
                      <div className="text-xs text-text-muted">
                        {load.cargoWeight} {t.ton} · {totalTrucks} {isAr ? 'شاحنة' : 'Trucks'}
                      </div>
                    </td>
                    <td className="font-mono text-sm">
                       {load.routes?.length === 1 ? firstRoute.truckType : (isAr ? 'متعدد' : 'Multi-Type')}
                    </td>
                    <td>
                    {load.status === 'ACTIVE' && <span className="px-2 py-1 text-xs font-bold rounded bg-amber-dim text-amber border border-amber/20">{t.sActive}</span>}
                    {load.status === 'PENDING_ASSIGNMENT' && <span className="px-2 py-1 text-xs font-bold rounded bg-surface-mid text-navy border border-sand">{t.sPending}</span>}
                    {load.status === 'IN_TRANSIT' && <span className="px-2 py-1 text-xs font-bold rounded bg-teal-light text-teal border border-teal/20">{t.sTransit}</span>}
                    {load.status === 'DELIVERED' && <span className="px-2 py-1 text-xs font-bold rounded bg-surface-mid text-text-muted border border-sand">{t.sDelivered}</span>}
                  </td>
                  <td>
                    {load.status === 'ACTIVE' ? (
                      <Link href={`/shipper/bids/${load.id}`} className="font-mono font-bold text-amber hover:underline flex items-center gap-1">
                        {load._count?.bids || 0} {t.bcount} <span className="pulse-amber w-1.5 h-1.5 rounded-full inline-block mr-1"></span>
                      </Link>
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
              {loads.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    {t.noLoads} <Link href="/shipper/post-load" className="text-amber font-bold hover:underline">{t.postFirst}</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
