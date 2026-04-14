'use client';

import { useAppContext, Load } from '@/context/AppContext';
import { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export default function CarrierLoadBoard() {
  const { lang, currentUser, submitBid } = useAppContext();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidNotes, setBidNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Filtering State
  const [originFilter, setOriginFilter] = useState<string>('');
  const [destFilter, setDestFilter] = useState<string>('');
  const [truckFilter, setTruckFilter] = useState<{ flatbed: boolean, reefer: boolean }>({ flatbed: true, reefer: true });

  const isAr = lang === 'ar';

  const t = {
    filterTitle:    isAr ? 'تصفية التفضيلات' : 'Filter Preferences',
    filterClear:    isAr ? 'مسح' : 'Clear',
    filterFrom:     isAr ? 'من مدينة' : 'From City',
    filterTo:       isAr ? 'إلى مدينة' : 'To City',
    filterTruck:    isAr ? 'نوع الشاحنة المطلوبة' : 'Required Truck Type',
    flatbed:        isAr ? 'مسطحة (Flatbed)' : 'Flatbed',
    reefer:         isAr ? 'مبردة (Reefer)' : 'Reefer',
    live:           isAr ? 'يتم التحديث مباشرة' : 'Live Updates',
    boardTitle:     isAr ? 'لوحة الأحمال المتاحة' : 'Available Load Board',
    sortNewest:     isAr ? 'الأحدث' : 'Newest',
    sortExpiring:   isAr ? 'ينتهي قريباً' : 'Expiring Soon',
    sortNearest:    isAr ? 'الأقرب لي' : 'Nearest to Me',
    emptyBoard:     isAr ? 'لا توجد حمولات نشطة تطابق بحثك' : 'No active loads match your search',
    weight:         isAr ? 'الوزن' : 'Weight',
    pickup:         isAr ? 'تاريخ الاستلام' : 'Pickup Date',
    remaining:      isAr ? 'متبقي' : 'remaining',
    offers:         isAr ? 'عروض' : 'bids',
    submitBidBtn:   isAr ? 'قدّم عرضك' : 'Submit Bid',
    modalTitle:     isAr ? 'إرسال عرض للرحلة' : 'Submit Bid for Trip',
    route:          isAr ? 'المسار' : 'Route',
    cargo:          isAr ? 'البضاعة' : 'Cargo',
    marketAvg:      isAr ? 'متوسط السوق لهذا المسار' : 'Market average for this route',
    priceLabel:     isAr ? 'عرض السعر المقترح (ريال سعودي) *' : 'Your Bid Price (SAR) *',
    truckLabel:     isAr ? 'اختر الشاحنة للرحلة *' : 'Select Truck for this Trip *',
    notesLabel:     isAr ? 'ملاحظات للشاحن (اختياري)' : 'Notes to Shipper (optional)',
    notesPlaceholder: isAr ? 'أضف أي تفاصيل أخرى عن عرضك والشاحنة...' : 'Add any details about your bid or truck...',
    summaryTitle:   isAr ? 'ملخص العرض' : 'Bid Summary',
    basePrice:      isAr ? 'السعر الأساسي' : 'Base Price',
    commission:     isAr ? 'عمولة منصة نقل (5%)' : 'NAQL Commission (5%)',
    netProfit:      isAr ? 'صافي الربح' : 'Net Profit',
    sar:            isAr ? 'ر.س' : 'SAR',
    confirm:        isAr ? 'تأكيد وإرسال العرض' : 'Confirm & Submit Bid',
    successTitle:   isAr ? 'تم إرسال عرضك بنجاح!' : 'Bid Submitted Successfully!',
    successSub:     isAr ? 'سيتلقى الشاحن عرضك. يمكنك متابعة حالة عرضك من شاشة "عروضي".' : 'The shipper will receive your bid. Track it in "My Bids".',
    errAlready:     isAr ? 'قدّمت عرضاً لهذه الحمولة مسبقاً' : 'You already submitted a bid for this load',
    errFailed:      isAr ? 'فشل إرسال العرض. حاول مرة أخرى.' : 'Failed to submit bid. Try again.',
    tons:           isAr ? 'طن' : 't',
    hours:          isAr ? 'ساعة' : 'hrs',
    riyadh:         isAr ? 'الرياض' : 'Riyadh',
    jeddah:         isAr ? 'جدة' : 'Jeddah',
    dammam:         isAr ? 'الدمام' : 'Dammam',
  };

  useEffect(() => {
    fetch('/api/loads')
      .then(r => r.ok ? r.json() : { loads: [] })
      .then(d => setLoads(d.loads ?? []))
      .finally(() => setLoadingData(false));

    const id = setInterval(() => {
      fetch('/api/loads').then(r => r.ok ? r.json() : { loads: [] }).then(d => setLoads(d.loads ?? []));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const [routePrices, setRoutePrices] = useState<Record<number, string>>({});

  useEffect(() => {
    if (selectedLoad) {
      const initial: Record<number, string> = {};
      selectedLoad.routes?.forEach((_, i) => { initial[i] = ''; });
      setRoutePrices(initial);
    }
  }, [selectedLoad]);

  // Auto-calculate total price
  useEffect(() => {
    const total = Object.values(routePrices).reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
    setBidPrice(total > 0 ? total.toString() : '');
  }, [routePrices]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoad || !currentUser) return;
    setIsSubmitting(true);
    setError('');

    try {
      const routesArray = selectedLoad.routes.map((r, i) => ({
        origin: r.origin,
        destination: r.destination,
        price: parseFloat(routePrices[i] || '0')
      }));

      await submitBid({
        loadId: selectedLoad.id,
        price: parseFloat(bidPrice.replace(/[^\d.]/g, '')),
        truckPlate: 'أ ب ج 1234',
        etaHours: 24,
        notes: bidNotes || undefined,
        routePrices: routesArray
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedLoad(null);
        setBidPrice('');
        setBidNotes('');
        setRoutePrices({});
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg.includes('already') ? t.errAlready : t.errFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLoads = useMemo(() => {
    return loads.filter(load => {
      if (originFilter) {
        if (!load.routes?.some(r => r.origin === originFilter)) return false;
      }
      if (destFilter) {
        if (!load.routes?.some(r => r.destination === destFilter)) return false;
      }
      
      // Truck type check - if any route matches carrier's active filters
      const matchesTruck = load.routes?.some(r => {
        const isReefer = r.truckType.includes('Refrigerated') || r.truckType.includes('مبردة');
        const isFlatbed = r.truckType.includes('Flatbed') || r.truckType.includes('مسطحة');
        if (truckFilter.flatbed && isFlatbed) return true;
        if (truckFilter.reefer && isReefer) return true;
        // If it's a type not in the simple filter, we might want to show it anyway or filter it out?
        // For now, if no filters match the route truck type, it's filtered.
        return false;
      }) ?? true;

      if (!matchesTruck) return false;
      
      return true;
    });
  }, [loads, originFilter, destFilter, truckFilter]);

  const uniqueOrigins = useMemo(() => {
    const origins = new Set<string>();
    loads.forEach(l => l.routes?.forEach(r => origins.add(r.origin)));
    return Array.from(origins);
  }, [loads]);

  const uniqueDests = useMemo(() => {
    const dests = new Set<string>();
    loads.forEach(l => l.routes?.forEach(r => dests.add(r.destination)));
    return Array.from(dests);
  }, [loads]);

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)] relative">
      <div className="w-[280px] bg-surface-card rounded-xl border border-surface-mid p-5 shrink-0 flex flex-col h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-primary">{t.filterTitle}</h3>
          <button onClick={() => { setOriginFilter(''); setDestFilter(''); setTruckFilter({ flatbed: true, reefer: true }); }} className="text-xs text-text-muted hover:text-amber">{t.filterClear}</button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="naql-label">{t.filterFrom}</label>
            <div className="flex gap-2 flex-wrap">
              {uniqueOrigins.length === 0 && <span className="text-xs text-text-muted italic">{isAr ? 'لا توجد مدن متاحة' : 'No origins available'}</span>}
              {uniqueOrigins.map(city => (
                <span key={city} onClick={() => setOriginFilter(originFilter === city ? '' : city)} className={`chip cursor-pointer ${originFilter === city ? 'selected' : ''}`}>{city}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="naql-label">{t.filterTo}</label>
            <div className="flex gap-2 flex-wrap">
              {uniqueDests.length === 0 && <span className="text-xs text-text-muted italic">{isAr ? 'لا توجد مدن متاحة' : 'No destinations available'}</span>}
              {uniqueDests.map(city => (
                <span key={city} onClick={() => setDestFilter(destFilter === city ? '' : city)} className={`chip cursor-pointer ${destFilter === city ? 'selected' : ''}`}>{city}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="naql-label">{t.filterTruck}</label>
            <div className="grid border border-surface-mid rounded bg-surface p-1 gap-1">
              <label className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                <input type="checkbox" checked={truckFilter.flatbed} onChange={e => setTruckFilter({...truckFilter, flatbed: e.target.checked})} className="accent-amber w-4 h-4" />
                <span className="text-sm font-medium">{t.flatbed}</span>
              </label>
              <label className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                <input type="checkbox" checked={truckFilter.reefer} onChange={e => setTruckFilter({...truckFilter, reefer: e.target.checked})} className="accent-amber w-4 h-4" />
                <span className="text-sm font-medium">{t.reefer}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-dim text-amber rounded mb-2 text-xs font-bold font-mono border border-amber/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber pulse-amber" />
              {t.live}
            </div>
            <h2 className={`text-2xl font-bold flex items-center gap-3 ${isAr ? 'font-display-ar' : ''}`} style={{ color: 'var(--text-primary-dark)' }}>
              {t.boardTitle}
              <span className="bg-navy text-white text-sm py-0.5 px-2 rounded-full font-mono">{filteredLoads.length}</span>
            </h2>
          </div>
          <div className="flex gap-4 border-b border-surface-mid">
            <button className="px-4 py-2 text-sm font-bold border-b-2 border-amber text-amber">{t.sortNewest}</button>
            <button className="px-4 py-2 text-sm font-bold border-b-2 border-transparent text-text-muted hover:text-navy">{t.sortExpiring}</button>
            <button className="px-4 py-2 text-sm font-bold border-b-2 border-transparent text-text-muted hover:text-navy">{t.sortNearest}</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          {loadingData ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 h-48 animate-pulse bg-surface-mid" />)}
            </div>
          ) : filteredLoads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted">
              <svg className="w-16 h-16 opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p>{t.emptyBoard}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredLoads.map(load => {
                const closeDate = new Date(load.bidCloseTime);
                const isUrgent = closeDate.getTime() - Date.now() < 1000 * 60 * 60 * 2;
                const bidsCount = load._count?.bids ?? load.bidsCount ?? 0;

                return (
                  <div key={load.id} onClick={() => setSelectedLoad(load)}
                    className={`card p-5 cursor-pointer flex flex-col hover:border-amber transition-colors ${load.isUrgent ? 'card-amber-border' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="inline-flex items-center bg-surface-mid rounded-full pr-1 pl-4 py-1">
                        <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-xs ml-2">N</div>
                        <span className="font-bold text-sm">
                           {load.routes?.[0]?.origin || '---'} ← {load.routes?.[0]?.destination || '---'}
                           {load.routes?.length > 1 && <span className="text-[10px] bg-amber text-navy px-1.5 rounded ml-2">+{load.routes.length - 1}</span>}
                        </span>
                      </div>
                      <button className="text-text-muted hover:text-amber">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-teal-light text-teal rounded text-xs font-bold">{load.cargoType}</span>
                      <span className="px-2 py-1 bg-surface-mid text-navy rounded text-xs font-bold">{isAr ? 'إجمالي الشاحنات' : 'Total Trucks'}: {load.routes?.reduce((acc, r) => acc + (r.truckCount || 0), 0)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6 flex-1">
                      <div><span className="text-text-muted block text-xs">{t.weight}</span><span className="font-bold font-mono">{load.cargoWeight} {t.tons}</span></div>
                      <div><span className="text-text-muted block text-xs">{t.offers}</span><span className="font-bold font-mono">{bidsCount}</span></div>
                      <div className="col-span-2 text-text-muted text-xs truncate">{load.cargoContent}</div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-surface-mid flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 ${isUrgent ? 'countdown-urgent' : 'countdown-normal'} text-sm font-bold`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {formatDistanceToNow(closeDate, { locale: isAr ? ar : enUS, addSuffix: false })} {t.remaining}
                        </div>
                      </div>
                      
                      {(load.bids?.length || 0) > 0 ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-teal-light/30 text-teal rounded-lg font-bold text-sm border border-teal/20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          {isAr ? 'تم تقديم عرضك' : 'Bid Submitted'}
                        </div>
                      ) : (
                        <button className="btn-primary h-10 px-4 text-sm" onClick={e => { e.stopPropagation(); setSelectedLoad(load); }}>
                          {t.submitBidBtn}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedLoad && (
        <div className="absolute inset-0 bg-surface z-50 rounded-xl border border-surface-mid flex flex-col shadow-2xl overflow-hidden fade-in">
          {showSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-amber">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-amber mb-6 shadow-xl">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className={`text-3xl font-bold text-navy mb-2 ${isAr ? 'font-display-ar' : ''}`}>{t.successTitle}</h2>
              <p className="text-navy/80 text-lg">{t.successSub}</p>
            </div>
          ) : (
            <>
              <div className="h-16 flex items-center justify-between px-6 border-b border-surface-mid bg-surface">
                <div className="flex items-center gap-4">
                  <button onClick={() => { setSelectedLoad(null); setError(''); }} className="w-8 h-8 flex items-center justify-center hover:bg-surface-mid rounded-full">
                    <svg className={`w-5 h-5 transform ${isAr ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                  <h2 className={`text-xl font-bold ${isAr ? 'font-display-ar' : ''}`} style={{ color: 'var(--text-primary-dark)' }}>{t.modalTitle}</h2>
                </div>
                <div className="font-mono font-bold text-navy bg-surface-card px-3 py-1.5 rounded">{selectedLoad.refNumber}</div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-8 overflow-y-auto">
                   <div className="bg-navy text-white rounded-xl p-6 mb-8 relative overflow-hidden card-dark">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber opacity-10 mix-blend-overlay rounded-bl-full pointer-events-none" />
                    <div className="text-white/60 text-sm mb-4 uppercase tracking-wider">{t.route}</div>
                    
                    <div className="space-y-3">
                       {selectedLoad.routes?.map((r, i) => (
                         <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
                            <span className="w-6 h-6 rounded bg-amber text-navy flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                             <span className="font-bold text-white">{r.origin}</span>
                             <svg className={`w-4 h-4 text-amber transform ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                             <span className="font-bold text-white">{r.destination}</span>
                             <div className="mr-auto text-xs bg-white/10 px-2 py-1 rounded text-white">
                                {r.truckType} <span className="text-amber font-bold ml-1">x{r.truckCount}</span>
                             </div>
                         </div>
                       ))}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-6 mt-4 border-t border-white/10">
                      <div><span className="block text-white/50 text-xs mb-1">{t.weight}</span><span className="font-mono font-bold text-white">{selectedLoad.cargoWeight} {t.tons}</span></div>
                      <div className="w-px bg-white/10" />
                      <div><span className="block text-white/50 text-xs mb-1">{isAr ? 'نوع البضاعة' : 'Cargo Type'}</span><span className="font-bold text-sm text-white">{selectedLoad.cargoType}</span></div>
                      <div className="w-px bg-white/10" />
                      <div><span className="block text-white/50 text-xs mb-1">{t.cargo}</span><span className="font-bold text-sm text-white">{selectedLoad.cargoContent}</span></div>
                    </div>
                  </div>

                  {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-medium">{error}</div>}

                  <form id="bidForm" onSubmit={handleBidSubmit} className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-amber-dim p-6 rounded-xl border border-amber/10">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-navy">{isAr ? 'عرض السعر لكل مسار' : 'Bid Price per Route'}</h3>
                          <p className="text-xs text-text-muted mt-1">{isAr ? 'يرجى إدخال السعر لكل جزء من الرحلة' : 'Please enter the price for each leg of the trip'}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {selectedLoad.routes?.map((r, i) => (
                          <div key={i} className="flex items-center gap-4 bg-surface p-3 rounded-lg border border-sand shadow-sm hover:border-amber transition-colors">
                            <div className="flex-1">
                              <div className="text-xs font-bold text-navy mb-1">{r.origin} → {r.destination}</div>
                              <div className="text-[10px] text-text-muted">{r.truckType} x{r.truckCount}</div>
                            </div>
                            <div className="relative">
                              <input 
                                type="number" 
                                required
                                className="w-32 naql-input h-10 pr-10 text-center font-mono font-bold" 
                                placeholder="0"
                                value={routePrices[i] || ''}
                                onChange={e => setRoutePrices({...routePrices, [i]: e.target.value})}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted">{t.sar}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-amber/10 flex justify-between items-center">
                        <span className="font-bold text-navy">{isAr ? 'إجمالي مبلغ العرض' : 'Total Bid Amount'}</span>
                        <div className="text-right">
                          <span className="text-2xl font-mono font-bold text-amber">{parseFloat(bidPrice || '0').toLocaleString()}</span>
                          <span className="text-sm font-bold text-navy ml-1">{t.sar}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card p-6 border-sand bg-surface">
                      <label className="naql-label">{t.notesLabel}</label>
                      <textarea className="naql-input h-24 py-3 resize-none" placeholder={t.notesPlaceholder} value={bidNotes} onChange={e => setBidNotes(e.target.value)} />
                    </div>
                  </form>
                </div>

                <div className="w-[320px] bg-surface border-r border-surface-mid p-6 flex flex-col shrink-0">
                  <h3 className="font-bold mb-6 pb-4 border-b border-sand">{t.summaryTitle}</h3>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between text-sm"><span>{t.basePrice}</span><span className="font-mono font-bold">{bidPrice || '0'} {t.sar}</span></div>
                    <div className="flex justify-between text-sm text-error"><span>{t.commission}</span><span className="font-mono font-bold">-{Math.floor(Number(bidPrice || 0) * 0.05)} {t.sar}</span></div>
                    <div className="border-t border-sand my-2 pt-4 flex justify-between font-bold">
                      <span>{t.netProfit}</span>
                      <span className="font-mono text-xl text-teal">{Math.floor(Number(bidPrice || 0) * 0.95)} {t.sar}</span>
                    </div>
                  </div>

                  <button form="bidForm" type="submit" className="btn-primary w-full h-[56px] text-lg font-bold shadow-lg shadow-amber/20 mt-4" disabled={isSubmitting || !bidPrice}>
                    {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : t.confirm}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
