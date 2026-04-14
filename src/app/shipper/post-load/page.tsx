'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function PostLoadPage() {
  const router = useRouter();
  const { postLoad, lang } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [cargoType, setCargoType] = useState('FTL');
  const [cargoContent, setCargoContent] = useState('');
  const [weight, setWeight] = useState('');
  const [bidMode, setBidMode] = useState('open'); // open or blind
  
  // Multi-Route State
  const [routes, setRoutes] = useState<any[]>([
    { origin: '', destination: '', truckType: '', truckCount: 1 }
  ]);

  const isAr = lang === 'ar';

  const t = {
    title: isAr ? 'إضافة حمولة جديدة (منصة المزاد)' : 'Post a New Load (Auction)',
    step1: isAr ? 'تفاصيل البضاعة' : 'Cargo Details',
    step2: isAr ? 'مسارات الشحن' : 'Shipping Routes',
    step3: isAr ? 'إعدادات المزاد' : 'Bid Settings',
    step4: isAr ? 'مراجعة ونشر' : 'Review & Post',
    
    cargoTypeLabel: isAr ? 'نوع الشحن' : 'Shipment Type',
    ftl: isAr ? 'شاحنة كاملة FTL' : 'Full Truckload (FTL)',
    ltl: isAr ? 'حمولة جزئية LTL' : 'Less than Truckload (LTL)',
    
    descLabel: isAr ? 'وصف البضاعة *' : 'Cargo Description *',
    descPlaceholder: isAr ? 'مثال: مواد بناء، طبالي خشبية، قطع غيار...' : 'e.g. Construction materials, wooden pallets, spare parts...',
    weightLabel: isAr ? 'الوزن التقريبي الإجمالي' : 'Total Approximate Weight',
    tons: isAr ? 'طن' : 'Tons',
    
    truckLabel: isAr ? 'نوع الشاحنة' : 'Truck Type',
    truckCountLabel: isAr ? 'عدد الشاحنات' : 'Trucks Needed',
    truckSelect: isAr ? 'اختر النوع...' : 'Select type...',
    tFlatbed: isAr ? 'مسطحة / Flatbed' : 'Flatbed',
    tReefer: isAr ? 'مبردة / Refrigerated' : 'Refrigerated',
    tCurtain: isAr ? 'جوانب / Curtainsider' : 'Curtainsider',
    tBox: isAr ? 'صندوق / Box Truck' : 'Box Truck',
    tLowbed: isAr ? 'لوبد / Lowbed' : 'Lowbed (Heavy)',
    
    pickupLabel: isAr ? 'مكان الاستلام' : 'Pickup',
    deliveryLabel: isAr ? 'مكان التسليم' : 'Delivery',
    citySelect: isAr ? 'المدينة...' : 'City...',
    riyadh: isAr ? 'الرياض' : 'Riyadh',
    jeddah: isAr ? 'جدة' : 'Jeddah',
    dammam: isAr ? 'الدمام' : 'Dammam',
    makkah: isAr ? 'مكة المكرمة' : 'Makkah',
    madinah: isAr ? 'المدينة المنورة' : 'Madinah',
    
    addRoute: isAr ? '+ إضافة مسار جديد' : '+ Add Another Route',
    removeRoute: isAr ? 'حذف' : 'Remove',
    
    bidTypeTitle: isAr ? 'آلية المزاد' : 'Auction Mechanism',
    openBid: isAr ? 'مزاد مفتوح (موصى به)' : 'Open Auction (Recommended)',
    openBidDesc: isAr ? 'يرى الناقلون جميع العروض المقدمة من الآخرين، مما يشجع على التنافس وتخفيض السعر.' : 'Carriers see all bids submitted by others, encouraging competition and lowering the price.',
    blindBid: isAr ? 'مزاد مغطى (سري)' : 'Blind Auction',
    blindBidDesc: isAr ? 'يقدم كل ناقل أفضل سعر لديه دون رؤية العروض الأخرى.' : 'Each carrier submits their best price without seeing other offers.',
    
    maxPriceLabel: isAr ? 'أقصى سعر تقبله (اختياري)' : 'Maximum Acceptable Price (Optional)',
    maxPriceHint: isAr ? 'لن يتم عرض هذا السعر للناقلين، وستُرفض العروض التي تتجاوزه تلقائياً.' : 'This price will not be shown to carriers, and bids exceeding it will be automatically rejected.',
    sar: isAr ? 'ريال' : 'SAR',
    
    reviewTitle: isAr ? 'ملخص الحمولة والمسارات' : 'Load & Routes Summary',
    routeLabel: isAr ? 'المسارات' : 'Routes',
    typeLabel: isAr ? 'نوع الشحنة' : 'Shipment Type',
    revWeightLabel: isAr ? 'الوزن الإجمالي' : 'Total Weight',
    docsTitle: isAr ? 'إرفاق مستندات (اختياري)' : 'Attach Documents (Optional)',
    docsDesc: isAr ? 'مثل: بوليصة المستودع، التغليف (PDF, JPG)' : 'e.g. Warehouse receipt, packing list (PDF, JPG)',
    
    btnPrev: isAr ? 'السابق' : 'Previous',
    btnNext: isAr ? 'التالي' : 'Next',
    btnConfirm: isAr ? 'تأكيد ونشر' : 'Confirm & Post',
  };

  const steps = [
    { title: t.step1 },
    { title: t.step2 },
    { title: t.step3 },
    { title: t.step4 },
  ];

  const handleAddRoute = () => {
    setRoutes([...routes, { origin: '', destination: '', truckType: '', truckCount: 1 }]);
  };

  const handleRemoveRoute = (index: number) => {
    if (routes.length > 1) {
      setRoutes(routes.filter((_, i) => i !== index));
    }
  };

  const handleRouteChange = (index: number, field: string, value: any) => {
    const newRoutes = [...routes];
    newRoutes[index][field] = value;
    setRoutes(newRoutes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      await postLoad({
        cargoType,
        cargoContent,
        cargoWeight: Number(weight),
        routes,
        bidCloseTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      });
      router.push('/shipper/bids');
    } catch (err) {
      console.error('Failed to post load:', err);
      alert(isAr ? 'فشل في نشر الحمولة. يرجى التأكد من ملء جميع الحقول.' : 'Failed to post load. Please ensure all fields are filled.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-surface-mid overflow-hidden min-h-[600px] flex flex-col ${isAr ? 'font-display-ar' : ''}`}>
      <div className="bg-navy p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 grain pointer-events-none" />
        <h1 className="text-2xl font-bold mb-8 relative z-10">{t.title}</h1>
        
        <div className="step-indicator relative z-10 w-full mb-2">
          {steps.map((s, idx) => {
            const num = idx + 1;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <React.Fragment key={num}>
                <div className={`step-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                   {isDone ? <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : num}
                </div>
                {idx < steps.length - 1 && <div className={`step-line ${step > num ? 'done' : ''}`} />}
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex justify-between relative z-10 text-xs font-bold text-white/50">
          {steps.map((s, idx) => (
             <span key={idx} className={`w-16 text-center ${step === idx + 1 ? 'text-amber' : ''}`}>{s.title}</span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 flex-1 flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in fade-in max-w-2xl mx-auto">
              <div>
                <label className="naql-label">{t.cargoTypeLabel}</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all text-center font-bold ${cargoType === 'FTL' ? 'border-amber bg-amber-dim text-amber' : 'border-surface-mid text-text-muted hover:border-sand'}`}>
                    <input type="radio" name="ct" className="hidden" checked={cargoType === 'FTL'} onChange={() => setCargoType('FTL')} />
                    {t.ftl}
                  </label>
                  <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all text-center font-bold ${cargoType === 'LTL' ? 'border-amber bg-amber-dim text-amber' : 'border-surface-mid text-text-muted hover:border-sand'}`}>
                    <input type="radio" name="ct" className="hidden" checked={cargoType === 'LTL'} onChange={() => setCargoType('LTL')} />
                    {t.ltl}
                  </label>
                </div>
              </div>

              <div>
                <label className="naql-label">{t.descLabel}</label>
                <textarea 
                  required
                  className="naql-input h-24 py-3 resize-none" 
                  placeholder={t.descPlaceholder}
                  value={cargoContent}
                  onChange={(e) => setCargoContent(e.target.value)}
                />
              </div>

              <div className="w-1/2">
                <label className="naql-label">{t.weightLabel}</label>
                <div className="flex gap-2">
                  <input type="number" required placeholder="0" min="1" className="naql-input font-mono text-xl text-center w-full" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  <div className="bg-surface border border-surface-mid whitespace-nowrap px-4 rounded-md flex items-center font-bold text-text-muted">{t.tons}</div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in fade-in">
              <div className="overflow-x-auto pb-4">
                <table className="w-full naql-table">
                  <thead>
                    <tr>
                      <th className="w-[20%]">{t.pickupLabel}</th>
                      <th className="w-[20%]">{t.deliveryLabel}</th>
                      <th className="w-[25%]">{t.truckLabel}</th>
                      <th className="w-[15%]">{t.truckCountLabel}</th>
                      <th className="w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route, idx) => (
                      <tr key={idx} className="border-b border-surface-mid">
                        <td className="py-4 px-2">
                           <select required className="naql-input" value={route.origin} onChange={(e) => handleRouteChange(idx, 'origin', e.target.value)}>
                              <option value="" disabled>{t.citySelect}</option>
                              <option value={t.riyadh}>{t.riyadh}</option>
                              <option value={t.jeddah}>{t.jeddah}</option>
                              <option value={t.dammam}>{t.dammam}</option>
                              <option value={t.makkah}>{t.makkah}</option>
                              <option value={t.madinah}>{t.madinah}</option>
                           </select>
                        </td>
                        <td className="py-4 px-2">
                           <select required className="naql-input" value={route.destination} onChange={(e) => handleRouteChange(idx, 'destination', e.target.value)}>
                              <option value="" disabled>{t.citySelect}</option>
                              <option value={t.riyadh}>{t.riyadh}</option>
                              <option value={t.jeddah}>{t.jeddah}</option>
                              <option value={t.dammam}>{t.dammam}</option>
                              <option value={t.makkah}>{t.makkah}</option>
                              <option value={t.madinah}>{t.madinah}</option>
                           </select>
                        </td>
                        <td className="py-4 px-2">
                           <select required className="naql-input" value={route.truckType} onChange={(e) => handleRouteChange(idx, 'truckType', e.target.value)}>
                              <option value="" disabled>{t.truckSelect}</option>
                              <option value={t.tFlatbed}>{t.tFlatbed}</option>
                              <option value={t.tReefer}>{t.tReefer}</option>
                              <option value={t.tCurtain}>{t.tCurtain}</option>
                              <option value={t.tBox}>{t.tBox}</option>
                              <option value={t.tLowbed}>{t.tLowbed}</option>
                           </select>
                        </td>
                        <td className="py-4 px-2">
                           <input type="number" required min="1" className="naql-input text-center font-mono" value={route.truckCount} onChange={(e) => handleRouteChange(idx, 'truckCount', parseInt(e.target.value))} />
                        </td>
                        <td className="py-4 px-2 text-center">
                           {routes.length > 1 && (
                             <button type="button" onClick={() => handleRemoveRoute(idx)} className="text-error font-bold text-xs hover:underline">
                               {t.removeRoute}
                             </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={handleAddRoute} className="btn-ghost w-full border-dashed border-2">
                {t.addRoute}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in fade-in max-w-2xl mx-auto">
               <div>
                <label className="naql-label text-base font-bold text-navy mb-4">{t.bidTypeTitle}</label>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => setBidMode('open')} className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${bidMode === 'open' ? 'border-amber bg-amber-dim' : 'border-surface-mid'}`}>
                     <div className="flex items-center gap-3 mb-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bidMode === 'open' ? 'border-amber' : 'border-sand'}`}>
                           {bidMode === 'open' && <div className="w-2.5 h-2.5 rounded-full bg-amber" />}
                        </div>
                        <span className="font-bold">{t.openBid}</span>
                     </div>
                     <p className="text-sm text-text-muted pr-8 leading-relaxed">{t.openBidDesc}</p>
                  </div>
                  
                  <div onClick={() => setBidMode('blind')} className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${bidMode === 'blind' ? 'border-amber bg-amber-dim' : 'border-surface-mid'}`}>
                     <div className="flex items-center gap-3 mb-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bidMode === 'blind' ? 'border-amber' : 'border-sand'}`}>
                           {bidMode === 'blind' && <div className="w-2.5 h-2.5 rounded-full bg-amber" />}
                        </div>
                        <span className="font-bold">{t.blindBid}</span>
                     </div>
                     <p className="text-sm text-text-muted pr-8 leading-relaxed">{t.blindBidDesc}</p>
                  </div>
                </div>
              </div>

              <div>
                 <label className="naql-label">{t.maxPriceLabel}</label>
                 <div className="flex gap-2 w-1/2">
                    <input type="number" placeholder="4500" min="1" className="naql-input font-mono text-lg text-center w-full" />
                    <div className="bg-surface border border-surface-mid whitespace-nowrap px-4 rounded-md flex items-center font-bold text-text-muted">{t.sar}</div>
                  </div>
                  <p className="text-xs text-text-muted mt-2">{t.maxPriceHint}</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in fade-in space-y-6">
              <div className="bg-surface rounded-xl p-8 border border-sand">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t.reviewTitle}
                </h3>
                
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="col-span-2">
                    <span className="block text-text-muted text-xs mb-2 uppercase tracking-wide font-bold">{t.routeLabel}</span>
                    <div className="space-y-2">
                       {routes.map((r, i) => (
                         <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-surface-mid">
                            <div className="flex items-center gap-4">
                               <span className="w-6 h-6 rounded bg-navy text-white flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                               <span className="font-bold text-navy">{r.origin}</span>
                               <svg className={`w-4 h-4 text-amber transform ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                               <span className="font-bold text-navy">{r.destination}</span>
                            </div>
                            <div className="text-xs">
                               <span className="bg-surface px-2 py-1 rounded text-text-muted mr-2">{r.truckType}</span>
                               <span className="font-bold text-amber">x{r.truckCount}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div><span className="block text-text-muted text-xs mb-1 uppercase font-bold">{t.typeLabel}</span><strong>{cargoType}</strong></div>
                  <div><span className="block text-text-muted text-xs mb-1 uppercase font-bold">{t.revWeightLabel}</span><strong className="font-mono">{weight} {t.tons}</strong></div>
                  <div className="col-span-2"><span className="block text-text-muted text-xs mb-1 uppercase font-bold">{t.descLabel}</span><strong className="leading-relaxed bg-white p-4 rounded block border border-surface-mid mt-1">{cargoContent}</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-surface-mid flex justify-between">
          <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost" style={{ visibility: step > 1 ? 'visible' : 'hidden'}}>
            {t.btnPrev}
          </button>
          
          <button type="submit" formNoValidate={step < 4} className="btn-primary w-40" disabled={isSubmitting}>
             {isSubmitting ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : step < 4 ? t.btnNext : t.btnConfirm}
          </button>
        </div>
      </form>
    </div>
  );
}
