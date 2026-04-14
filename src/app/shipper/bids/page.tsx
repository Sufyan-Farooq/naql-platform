'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { useState } from 'react';

export default function ShipperBidsView() {
  const { lang, getLoadsForCurrentUser, bids } = useAppContext();
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'COMPLETED'>('ALL');
  
  const isAr = lang === 'ar';
  
  const t = {
    title: isAr ? 'إدارة عروض الأسعار' : 'Bid Management',
    all: isAr ? 'الكل' : 'All',
    new: isAr ? 'عروض جديدة' : 'New Bids',
    completed: isAr ? 'مكتمل' : 'Completed',
    endsSoon: isAr ? 'ينتهي خلال ساعة' : 'Ends in 1 hr',
    accepted: isAr ? 'تم قبول العرض' : 'Bid Accepted',
    tons: isAr ? 'طن' : 't',
    received: isAr ? 'العروض المستلمة' : 'Received Bids',
    details: isAr ? 'عرض التفاصيل' : 'View Details',
    review: isAr ? 'مراجعة العروض' : 'Review Bids',
    empty: isAr ? 'لا توجد حمولات لها عروض حالياً' : 'No loads with bids currently',
  };

  const allLoads = getLoadsForCurrentUser();
  
  const displayLoads = allLoads.filter(load => {
    const bidsCount = load._count?.bids || 0;
    const hasPending = bidsCount > 0; // Simplified logic since we don't have all bid statuses globally
    const hasAccepted = load.status !== 'ACTIVE'; // Status changes once a bid is accepted

    if (bidsCount === 0 && load.status !== 'ACTIVE') return false;

    if (filter === 'NEW' && (!hasPending || load.status !== 'ACTIVE')) return false;
    if (filter === 'COMPLETED' && load.status === 'ACTIVE') return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display-ar font-bold text-primary">{t.title}</h1>
        
        <div className="flex gap-2">
           <button onClick={() => setFilter('ALL')} className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-colors border ${filter === 'ALL' ? 'bg-navy text-white border-transparent' : 'bg-surface-card text-primary border-sand hover:border-amber'}`}>{t.all}</button>
           <button onClick={() => setFilter('NEW')} className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-colors border ${filter === 'NEW' ? 'bg-navy text-white border-transparent' : 'bg-surface-card text-primary border-sand hover:border-amber'}`}>{t.new}</button>
           <button onClick={() => setFilter('COMPLETED')} className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-colors border ${filter === 'COMPLETED' ? 'bg-navy text-white border-transparent' : 'bg-surface-card text-primary border-sand hover:border-amber'}`}>{t.completed}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayLoads.map(load => {
          const bidsCount = load._count?.bids || 0;
          const hasPending = bidsCount > 0;
          const hasAccepted = load.status !== 'ACTIVE';

          return (
            <div key={load.id} className={`card p-6 flex flex-col md:flex-row md:items-center gap-6 ${hasPending && load.status === 'ACTIVE' ? 'card-amber-border' : ''}`}>
               {/* Mobile Header Data */}
               <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                     <span className="font-mono bg-surface-mid px-2 py-0.5 rounded font-bold text-sm text-primary">{load.refNumber}</span>
                     {load.status === 'ACTIVE' && <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-dim text-amber uppercase tracking-wider">{t.endsSoon}</span>}
                     {hasAccepted && <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-light text-teal uppercase tracking-wider">{t.accepted}</span>}
                  </div>
                  
                  <div className="text-lg font-bold flex items-center gap-2 text-primary">
                     {load.routes?.[0] ? (
                       <>
                         {load.routes[0].origin} 
                         <svg className={`w-5 h-5 text-sand transform ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                         {load.routes[0].destination}
                         {load.routes.length > 1 && (
                           <span className="text-xs bg-amber-dim text-amber px-2 py-1 rounded ml-2">
                             +{load.routes.length - 1} {isAr ? 'مسارات أخرى' : 'more routes'}
                           </span>
                         )}
                       </>
                     ) : (
                       <span>{load.cargoContent}</span>
                     )}
                  </div>
                  
                  <div className="text-sm text-text-muted flex gap-2 divide-x divide-x-reverse divide-sand">
                     <span>{isAr ? 'إجمالي الشاحنات' : 'Total Trucks'}: {load.routes?.reduce((acc, r) => acc + (r.truckCount || 0), 0) || 0}</span>
                     <span className="pl-2 pr-2">{load.cargoWeight} {t.tons}</span>
                  </div>
               </div>

               {/* Right Actions */}
               <div className="flex items-center gap-6 md:border-r border-sand pr-6 md:w-[35%] shrink-0">
                  <div className="flex-1 text-center">
                     <div className="text-text-muted text-xs mb-1 font-bold">{t.received}</div>
                     <div className="font-mono text-3xl font-bold text-primary">
                        {bidsCount} 
                        {hasPending && load.status === 'ACTIVE' && <span className="w-2.5 h-2.5 bg-amber rounded-full inline-block mr-2 transform -translate-y-2 pulse-amber" />}
                     </div>
                  </div>
                  
                  <Link href={`/shipper/bids/${load.id}`} className={hasAccepted ? "btn-ghost w-full" : "btn-primary w-full"}>
                     {hasAccepted ? t.details : t.review}
                  </Link>
               </div>
            </div>
          );
        })}
        {displayLoads.length === 0 && (
           <div className="text-center py-20 bg-surface-card rounded-xl border border-surface-mid text-text-muted">{t.empty}</div>
        )}
      </div>
    </div>
  );
}
