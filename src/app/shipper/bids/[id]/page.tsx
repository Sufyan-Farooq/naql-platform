'use client';

import { useAppContext, Bid } from '@/context/AppContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

export default function BidManagementDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { lang, loads, acceptBid, refreshBids, isHydrated } = useAppContext();
  const isAr = lang === 'ar';

  const loadId = (Array.isArray(id) ? id[0] : id) || '';
  const load = loads.find(l => l.id === loadId);
  const [bidsForLoad, setBidsForLoad] = useState<Bid[]>([]);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'PRICE'|'RATING'>('PRICE');

  const t = {
    backBtn:    isAr ? 'العودة لإدارة العروض' : 'Back to Bid Management',
    refLabel:   isAr ? 'رقم المرجع' : 'Reference',
    auctionEnd: isAr ? 'ينتهي المزاد' : 'Auction Ends',
    truckType:  isAr ? 'نوع الشاحنة' : 'Truck Type',
    weight:     isAr ? 'الوزن' : 'Weight',
    pickup:     isAr ? 'الاستلام' : 'Pickup',
    tons:       isAr ? 'طن' : 't',
    bidsTitle:  isAr ? 'العروض المقدمة' : 'Submitted Bids',
    sortPrice:  isAr ? 'السعر (الأقل)' : 'Price (Lowest)',
    sortRating: isAr ? 'التقييم' : 'Rating',
    noBids:     isAr ? 'بانتظار تقديم الناقلين لعروضهم...' : 'Waiting for carriers to submit their bids...',
    carrierName:isAr ? 'مؤسسة ناقل' : 'Carrier Co.',
    bestPrice:  isAr ? 'أفضل سعر 🔥' : 'Best Price 🔥',
    bidValue:   isAr ? 'قيمة العرض' : 'Bid Amount',
    eta:        isAr ? 'وقت الوصول (ETA)' : 'ETA',
    hours:      isAr ? 'ساعة' : 'hrs',
    plate:      isAr ? 'الشاحنة / اللوحة' : 'Truck / Plate',
    notes:      isAr ? 'ملاحظات والتزام' : 'Notes & Commitment',
    acceptBtn:  isAr ? 'قبول العرض' : 'Accept Bid',
    accepted:   isAr ? 'تم اعتماد الناقل' : 'Carrier Accepted',
    rejected:   isAr ? 'تم الرفض' : 'Rejected',
    rating:     isAr ? 'تقييم ممتاز' : 'Excellent Rating',
    sar:        isAr ? 'ريال' : 'SAR',
    loadNotFound: isAr ? 'الحمولة غير موجودة' : 'Load not found',
    errorAccept: isAr ? 'حدث خطأ أثناء قبول العرض' : 'Error accepting bid',
  };

  useEffect(() => {
    if (loadId) {
      refreshBids(loadId).then(bids => setBidsForLoad(bids));
    }
  }, [loadId, refreshBids]);

  if (!isHydrated) return null;

  if (!load) {
    return <div className="p-8 text-text-muted">{t.loadNotFound}</div>;
  }

  const hasAccepted = bidsForLoad.some(b => b.status === 'ACCEPTED');

  const handleAccept = async (bidId: string) => {
    setAccepting(bidId);
    try {
      await acceptBid(bidId, load.id);
      // Refresh bids locally
      const updated = await refreshBids(loadId);
      setBidsForLoad(updated);
      // Brief delay for visual feedback then redirect
      setTimeout(() => router.push('/shipper/shipments'), 800);
    } catch (err) {
      console.error(err);
      alert(t.errorAccept);
    } finally {
      setAccepting(null);
    }
  };

  const lowestPerRoute = useMemo(() => {
    if (!load?.routes) return [];
    const minPrices = load.routes.map(() => Infinity);
    bidsForLoad.forEach(bid => {
      const prices = (bid as any).routePrices || [];
      prices.forEach((rp: any, i: number) => {
        if (rp.price < minPrices[i]) minPrices[i] = rp.price;
      });
    });
    return minPrices;
  }, [load?.routes, bidsForLoad]);

  return (
    <div className={`space-y-6 ${isAr ? 'font-ar' : 'font-en'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <Link href="/shipper/bids" className="inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-navy transition-colors mb-2">
        <svg className={`w-4 h-4 transform ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {t.backBtn}
      </Link>

      {/* Load Details Card */}
      <div className="bg-navy rounded-xl p-6 text-white relative overflow-hidden card-dark">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber opacity-10 mix-blend-overlay rounded-bl-full pointer-events-none" />
        <div className="flex justify-between items-start mb-6">
          <div className="w-full">
            <div className="text-white/60 text-sm mb-4 uppercase tracking-wider flex justify-between items-center w-full">
              <span>{load.refNumber}</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{load.cargoType}</span>
            </div>
            
            <div className="space-y-3">
              {load.routes.map((r, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className={`text-lg font-bold flex items-center gap-3 ${isAr ? 'font-display-ar' : ''} flex-1 text-white`}>
                    <span className="w-6 h-6 rounded bg-amber text-navy flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                    {r.origin}
                    <svg className={`w-4 h-4 text-amber transform ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {r.destination}
                  </div>
                  <div className="flex flex-col md:items-end gap-1 text-sm border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
                     <div className="flex items-center gap-2">
                        <span className="text-white/60">{r.truckType}</span>
                        <span className="bg-amber text-navy px-2 py-0.5 rounded font-bold">x{r.truckCount}</span>
                     </div>
                      {lowestPerRoute[i] !== Infinity && (
                        <div className="text-[10px] text-amber font-bold">{isAr ? 'أقل سعر متاح' : 'Lowest Available'}: {lowestPerRoute[i]} {t.sar}</div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
          <div><span className="block text-white/50 text-xs mb-1 font-bold">{t.weight}</span><span className="font-mono font-bold text-white">{load.cargoWeight} {t.tons}</span></div>
          <div className="w-px bg-white/10" />
          <div className="flex-1"><span className="block text-white/50 text-xs mb-1 font-bold">{t.notes}</span><span className="text-sm font-bold text-white line-clamp-1">{load.cargoContent}</span></div>
          {load.status === 'ACTIVE' && (
             <div className="text-right">
               <div className="text-[10px] text-white/60 uppercase mb-1">{t.auctionEnd}</div>
               <div className="font-mono text-amber font-bold">02:45:30</div>
             </div>
          )}
        </div>
      </div>

      {/* Bids Card */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-surface-mid flex justify-between items-center">
          <h2 className={`font-bold text-xl ${isAr ? 'font-display-ar' : ''} text-primary`}>
            {t.bidsTitle} <span className="font-mono text-sm bg-surface px-2 py-0.5 rounded text-text-muted ml-2">{bidsForLoad.length}</span>
          </h2>
          <div className="flex gap-1 bg-surface p-1 rounded-lg border border-surface-mid">
            <button onClick={() => setSortBy('PRICE')} className={`px-3 py-1 shadow-sm rounded text-xs font-bold transition-colors ${sortBy === 'PRICE' ? 'bg-surface-card text-primary' : 'bg-transparent text-text-muted hover:text-primary'}`}>{t.sortPrice}</button>
            <button onClick={() => setSortBy('RATING')} className={`px-3 py-1 shadow-sm rounded text-xs font-bold transition-colors ${sortBy === 'RATING' ? 'bg-surface-card text-primary' : 'bg-transparent text-text-muted hover:text-primary'}`}>{t.sortRating}</button>
          </div>
        </div>

        {bidsForLoad.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            {t.noBids}
          </div>
        ) : (
          <div className="divide-y divide-surface-mid">
            {[...bidsForLoad].sort((a, b) => {
               if (sortBy === 'PRICE') return a.price - b.price;
               const ratingA = (a.carrier as any)?.rating || 4.8;
               const ratingB = (b.carrier as any)?.rating || 4.8;
               return ratingB - ratingA;
            }).map((bid, index) => {
              const isLowest  = sortBy === 'PRICE' && index === 0;
              const isAccepted = bid.status === 'ACCEPTED';
              const isRejected = bid.status === 'REJECTED';
              const routePrices = (bid as any).routePrices || [];

              let rowClasses = 'p-5 flex flex-col md:flex-row gap-6 items-start md:items-center transition-colors hover:bg-surface/50 ';
              if (isLowest && !hasAccepted && bid.status === 'PENDING') rowClasses += 'bg-amber-dim/30 ';
              if (isAccepted) rowClasses += 'bg-teal-light/20 border-l-4 border-l-teal ';
              if (isRejected) rowClasses += 'opacity-50 grayscale bg-surface ';

              const carrierName = bid.carrier?.company || bid.carrier?.name || `${t.carrierName} ${bid.carrierId.slice(-1)}`;

              return (
                <div key={bid.id} className={rowClasses}>
                  {/* Column 1: Carrier Info */}
                  <div className="flex items-center gap-3 md:w-[25%] shrink-0">
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg">
                      {carrierName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-primary">{carrierName}</div>
                      <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                        <svg className="w-3 h-3 text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        {(bid.carrier as any)?.rating || 4.8}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Bid Routes & Breakdown (Occupies middle) */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {routePrices.map((rp: any, i: number) => (
                        <div key={i} className={`flex items-center justify-between p-2 rounded text-xs border ${rp.price === lowestPerRoute[i] ? 'bg-teal-light/20 border-teal/30 font-bold' : 'bg-surface border-sand'}`}>
                          <span className="text-text-muted">{rp.origin} → {rp.destination}</span>
                          <span className={rp.price === lowestPerRoute[i] ? 'text-teal' : 'text-primary'}>
                            {rp.price.toLocaleString()} {t.sar}
                            {rp.price === lowestPerRoute[i] && <span className="ml-1">🔥</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div><span className="text-text-muted mr-1">{t.eta}:</span><span className="font-bold">{bid.etaHours} {t.hours}</span></div>
                      <div><span className="text-text-muted mr-1">{t.plate}:</span><span className="font-bold font-mono">{bid.truckPlate}</span></div>
                    </div>
                    {bid.notes && (
                      <div className="bg-surface p-2 rounded text-xs mt-2 border border-sand italic">
                        <span className="text-text-muted block not-italic mb-1">{t.notes}</span>
                        {bid.notes}
                      </div>
                    )}
                  </div>

                  {/* Column 3: Price & Action */}
                  <div className="w-full md:w-[220px] shrink-0 text-left flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-r border-surface-mid pt-4 md:pt-0 pr-0 md:pr-6 md:rtl:pr-0 md:rtl:pl-6">
                    <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end w-full">
                      <span className="text-xs text-text-muted font-bold inline-block md:mb-1">
                        {isLowest && !hasAccepted ? t.bestPrice : t.bidValue}
                      </span>
                      <div className={`font-mono text-2xl font-bold flex items-baseline gap-1 ${isLowest && !hasAccepted ? 'text-amber' : 'text-primary'}`}>
                        {bid.price.toLocaleString()} <span className="text-sm font-sans">{t.sar}</span>
                      </div>
                    </div>

                    {!hasAccepted && bid.status === 'PENDING' && (
                      <button
                        onClick={() => handleAccept(bid.id)}
                        disabled={accepting === bid.id}
                        className={`w-full h-10 flex items-center justify-center rounded font-bold text-sm transition-colors ${isLowest ? 'bg-amber text-white hover:bg-amber-light' : 'border border-sand text-navy hover:border-amber'}`}>
                        {accepting === bid.id
                          ? <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          : t.acceptBtn}
                      </button>
                    )}

                    {isAccepted && (
                      <div className="w-full h-10 flex items-center justify-center rounded font-bold text-sm bg-teal text-white">
                        {t.accepted}
                      </div>
                    )}

                    {isRejected && (
                      <div className="w-full text-center text-xs text-text-muted font-bold pt-2">{t.rejected}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
