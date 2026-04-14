'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';

interface AdminLoad {
  id: string;
  refNumber: string;
  status: string;
  origin: string;
  destination: string;
  cargoType: string;
  cargoWeight: number;
  truckType: string;
  pickupDate: string;
  createdAt: string;
  isUrgent: boolean;
  shipper: { name: string; company: string; email: string };
  _count: { bids: number };
  bids: Array<{ carrier: { name: string; company: string } }>;
  trip: { status: string; progress: number } | null;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'text-teal bg-teal-light/20 border-teal/30',
  PENDING_ASSIGNMENT: 'text-amber bg-amber-dim border-amber/30',
  IN_TRANSIT: 'text-blue-600 bg-blue-50 border-blue-200',
  DELIVERED: 'text-green-600 bg-green-50 border-green-200',
  COMPLETED: 'text-gray-600 bg-gray-100 border-gray-300',
  CANCELLED: 'text-red-500 bg-red-50 border-red-200',
};

export default function AdminLoadsPage() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [loads, setLoads] = useState<AdminLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const t = {
    title:    isAr ? 'الأحمال والطلبات' : 'Loads & Orders',
    sub:      isAr ? 'جميع أحمال المنصة عبر كل الشاحنين' : 'All platform loads across all shippers',
    all:      isAr ? 'الكل' : 'All',
    active:   isAr ? 'نشط' : 'Active',
    pending:  isAr ? 'قيد التعيين' : 'Pending',
    transit:  isAr ? 'في الطريق' : 'In Transit',
    delivered:isAr ? 'تم التسليم' : 'Delivered',
    completed:isAr ? 'مكتمل' : 'Completed',
    load:     isAr ? 'الحمولة' : 'Load',
    shipper:  isAr ? 'الشاحن' : 'Shipper',
    route:    isAr ? 'المسار' : 'Route',
    cargo:    isAr ? 'البضاعة' : 'Cargo',
    bids:     isAr ? 'العروض' : 'Bids',
    carrier:  isAr ? 'الناقل' : 'Carrier',
    status:   isAr ? 'الحالة' : 'Status',
    date:     isAr ? 'التاريخ' : 'Date',
    urgent:   isAr ? 'عاجل' : 'Urgent',
    noLoads:  isAr ? 'لا توجد أحمال' : 'No loads found',
  };

  const statusLabels: Record<string, string> = {
    ACTIVE: t.active, PENDING_ASSIGNMENT: t.pending,
    IN_TRANSIT: t.transit, DELIVERED: t.delivered, COMPLETED: t.completed,
  };

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/loads?${params}`);
    const data = await res.json();
    setLoads(data.loads ?? []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-1 ${isAr ? 'font-display-ar' : ''}`} style={{ color: 'var(--text-primary-dark)' }}>{t.title}</h1>
        <p className="text-text-muted">{t.sub}</p>
      </div>

      {/* Status filter */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {[['', t.all], ['ACTIVE', t.active], ['PENDING_ASSIGNMENT', t.pending], ['IN_TRANSIT', t.transit], ['DELIVERED', t.delivered], ['COMPLETED', t.completed]].map(([v, l]) => (
            <button key={v} onClick={() => setStatusFilter(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${statusFilter === v ? 'bg-navy text-white' : 'bg-surface border border-surface-mid text-text-muted hover:text-navy'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-mid)', borderBottom: '1px solid var(--border)' }}>
                {[t.load, t.shipper, t.route, t.cargo, t.bids, t.carrier, t.status, t.date].map(h => (
                  <th key={h} className="px-4 py-3 text-start text-xs font-bold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-mid">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-surface-mid rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : loads.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-text-muted">{t.noLoads}</td></tr>
              ) : loads.map(load => (
                <tr key={load.id} className="border-b border-surface-mid hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs font-bold text-navy">{load.refNumber}</div>
                    {load.isUrgent && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 rounded">{t.urgent}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: 'var(--text-primary-dark)' }}>{load.shipper.company}</div>
                    <div className="text-xs text-text-muted">{load.shipper.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-sm" style={{ color: 'var(--text-primary-dark)' }}>{load.origin} → {load.destination}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs">{load.cargoType}</div>
                    <div className="font-mono text-xs text-text-muted">{load.cargoWeight}t</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold bg-surface-mid px-2 py-0.5 rounded text-navy">{load._count.bids}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {load.bids[0] ? (
                      <div>
                        <div className="font-medium">{load.bids[0].carrier.company}</div>
                        <div className="text-text-muted">{load.bids[0].carrier.name}</div>
                      </div>
                    ) : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded border text-xs font-bold ${STATUS_COLORS[load.status] || ''}`}>
                      {statusLabels[load.status] || load.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{new Date(load.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
