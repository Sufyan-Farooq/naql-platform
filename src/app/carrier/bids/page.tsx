'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import Link from 'next/link';

export default function CarrierBidsPage() {
  const { lang } = useAppContext();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  const t = {
    title: isAr ? 'عروضي المقدمة' : 'My Bids',
    empty: isAr ? 'لم تقدم أي عروض بعد.' : 'No bids submitted yet.',
    loadBoard: isAr ? 'تصفح قائمة الحمولات' : 'Browse Load Board',
    ref: isAr ? 'رقم المرجع' : 'Ref Number',
    status: isAr ? 'الحالة' : 'Status',
    bidPrice: isAr ? 'قيمة العرض' : 'Bid Amount',
    date: isAr ? 'منذ' : 'Submitted',
    sar: isAr ? 'ر.س' : 'SAR',
    route: isAr ? 'المسار' : 'Route',
    viewLoad: isAr ? 'عرض الحمولة' : 'View Load',
    statusPending: isAr ? 'قيد الانتظار' : 'Pending',
    statusAccepted: isAr ? 'تم القبول' : 'Accepted',
    statusRejected: isAr ? 'مرفوض' : 'Rejected',
    trucks: isAr ? 'شاحنة' : 'Trucks',
  };

  useEffect(() => {
    fetch('/api/bids/carrier')
      .then(res => res.json())
      .then(data => {
        setBids(data.bids || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bids:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <div className="h-8 w-48 bg-surface-mid animate-pulse rounded" />
        <div className="grid grid-cols-1 gap-4">
          <div className="h-32 bg-surface-mid animate-pulse rounded-xl" />
          <div className="h-32 bg-surface-mid animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${isAr ? 'font-ar' : 'font-en'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy">{t.title}</h1>
      </div>

      {bids.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-surface-mid rounded-full flex items-center justify-center text-text-muted">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-text-muted">{t.empty}</p>
          <Link href="/carrier/loads" className="btn-primary px-6 h-10 flex items-center">
            {t.loadBoard}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map(bid => {
            const load = bid.load;
            const creationDate = new Date(bid.createdAt);
            const firstRoute = load.routes?.[0] || {};
            const totalTrucks = load.routes?.reduce((acc: number, r: any) => acc + (r.truckCount || 0), 0) || 0;

            return (
              <div key={bid.id} className="card p-5 flex flex-col md:flex-row md:items-center gap-6 hover:border-amber transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-navy text-white px-2 py-0.5 rounded">{load.refNumber}</span>
                    <span className="text-xs text-text-muted">{formatDistanceToNow(creationDate, { locale: isAr ? ar : enUS, addSuffix: true })}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 font-bold text-navy">
                    <span>{firstRoute.origin}</span>
                    <svg className={`w-4 h-4 text-amber transform ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    <span>{firstRoute.destination}</span>
                    {load.routes?.length > 1 && (
                      <span className="text-[10px] bg-amber text-navy px-1.5 rounded">+{load.routes.length - 1}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-4 text-xs text-text-muted">
                    <span>{load.cargoType}</span>
                    <span>{totalTrucks} {t.trucks}</span>
                    <span>{load.shipper?.company}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:border-r md:pr-8 border-sand">
                  <div className="text-center md:text-right">
                    <span className="block text-xs text-text-muted mb-1">{t.bidPrice}</span>
                    <span className="font-mono font-bold text-xl text-navy">{bid.price.toLocaleString()} <span className="text-sm font-sans">{t.sar}</span></span>
                  </div>
                  
                  <div className="min-w-[100px] text-center">
                     {bid.status === 'PENDING' && <span className="status-badge bg-amber-dim text-amber-dark">{t.statusPending}</span>}
                     {bid.status === 'ACCEPTED' && <span className="status-badge bg-teal-light text-teal">{t.statusAccepted}</span>}
                     {bid.status === 'REJECTED' && <span className="status-badge bg-red-50 text-red-600">{t.statusRejected}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
