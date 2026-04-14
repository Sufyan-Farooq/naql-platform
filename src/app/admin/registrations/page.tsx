'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';

type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface RegistrationUser {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string | null;
  crNumber: string | null;
  role: 'SHIPPER' | 'CARRIER';
  status: UserStatus;
  createdAt: string;
  _count: { loads: number; bids: number };
}

export default function RegistrationsPage() {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';

  const [users, setUsers] = useState<RegistrationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [updating, setUpdating] = useState<string | null>(null);

  const t = {
    title:    isAr ? 'طلبات التسجيل' : 'Registration Requests',
    sub:      isAr ? 'مراجعة طلبات الانضمام للمنصة والموافقة عليها أو رفضها' : 'Review, approve or reject platform registration requests',
    all:      isAr ? 'الكل' : 'All',
    pending:  isAr ? 'بانتظار الموافقة' : 'Pending',
    approved: isAr ? 'تمت الموافقة' : 'Approved',
    rejected: isAr ? 'مرفوض' : 'Rejected',
    shipper:  isAr ? 'شاحن' : 'Shipper',
    carrier:  isAr ? 'ناقل' : 'Carrier',
    name:     isAr ? 'الاسم' : 'Name',
    company:  isAr ? 'الشركة' : 'Company',
    role:     isAr ? 'الدور' : 'Role',
    cr:       isAr ? 'السجل التجاري' : 'CR Number',
    date:     isAr ? 'تاريخ التسجيل' : 'Registered',
    status:   isAr ? 'الحالة' : 'Status',
    actions:  isAr ? 'الإجراءات' : 'Actions',
    approve:  isAr ? 'موافقة' : 'Approve',
    reject:   isAr ? 'رفض' : 'Reject',
    reset:    isAr ? 'إعادة تعيين' : 'Reset',
    empty:    isAr ? 'لا توجد طلبات مطابقة' : 'No matching requests',
    loads:    isAr ? 'أحمال' : 'loads',
    bids:     isAr ? 'عروض' : 'bids',
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterRole) params.set('role', filterRole);
    if (filterStatus) params.set('status', filterStatus);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, [filterRole, filterStatus]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateStatus = async (userId: string, status: UserStatus) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
      }
    } finally {
      setUpdating(null);
    }
  };

  const statusColor: Record<UserStatus, string> = {
    PENDING: 'text-amber bg-amber-dim border-amber/30',
    APPROVED: 'text-teal bg-teal-light/20 border-teal/30',
    REJECTED: 'text-red-500 bg-red-50 border-red-200',
  };
  const statusLabel: Record<UserStatus, string> = {
    PENDING: t.pending,
    APPROVED: t.approved,
    REJECTED: t.rejected,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-1 ${isAr ? 'font-display-ar' : ''}`} style={{ color: 'var(--text-primary-dark)' }}>{t.title}</h1>
        <p className="text-text-muted">{t.sub}</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        {/* Status filter */}
        <div className="flex gap-1 bg-surface border border-surface-mid rounded-lg p-1">
          {[['', t.all], ['PENDING', t.pending], ['APPROVED', t.approved], ['REJECTED', t.rejected]].map(([v, l]) => (
            <button key={v} onClick={() => setFilterStatus(v)}
              className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${filterStatus === v ? 'bg-amber text-white' : 'text-text-muted hover:text-navy'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Role filter */}
        <div className="flex gap-1 bg-surface border border-surface-mid rounded-lg p-1">
          {[['', t.all], ['SHIPPER', t.shipper], ['CARRIER', t.carrier]].map(([v, l]) => (
            <button key={v} onClick={() => setFilterRole(v)}
              className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${filterRole === v ? 'bg-navy text-white' : 'text-text-muted hover:text-navy'}`}>
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
                {[t.name, t.company, t.role, t.cr, t.date, t.status, t.actions].map(h => (
                  <th key={h} className="px-4 py-3 text-start font-bold text-text-muted text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-surface-mid">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-surface-mid rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-text-muted">{t.empty}</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-surface-mid hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold" style={{ color: 'var(--text-primary-dark)' }}>{u.name}</div>
                    <div className="text-xs text-text-muted">{u.email}</div>
                    {(u._count.loads > 0 || u._count.bids > 0) && (
                      <div className="text-xs text-text-muted mt-0.5 font-mono">
                        {u._count.loads > 0 && `${u._count.loads} ${t.loads}`}
                        {u._count.loads > 0 && u._count.bids > 0 && ' · '}
                        {u._count.bids > 0 && `${u._count.bids} ${t.bids}`}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 font-medium">{u.company}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'SHIPPER' ? 'bg-amber-dim text-amber' : 'bg-teal-light/20 text-teal'}`}>
                      {u.role === 'SHIPPER' ? t.shipper : t.carrier}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-text-muted">{u.crNumber || '—'}</td>
                  <td className="px-4 py-4 text-xs text-text-muted">{new Date(u.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-GB')}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded border text-xs font-bold ${statusColor[u.status]}`}>
                      {statusLabel[u.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {u.status !== 'APPROVED' && (
                        <button onClick={() => updateStatus(u.id, 'APPROVED')} disabled={updating === u.id}
                          className="px-3 py-1.5 bg-teal text-white rounded text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                          {updating === u.id ? '...' : t.approve}
                        </button>
                      )}
                      {u.status !== 'REJECTED' && (
                        <button onClick={() => updateStatus(u.id, 'REJECTED')} disabled={updating === u.id}
                          className="px-3 py-1.5 bg-red-500 text-white rounded text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                          {updating === u.id ? '...' : t.reject}
                        </button>
                      )}
                      {u.status !== 'PENDING' && (
                        <button onClick={() => updateStatus(u.id, 'PENDING')} disabled={updating === u.id}
                          className="px-3 py-1.5 border border-surface-mid text-text-muted rounded text-xs font-bold hover:border-amber transition-colors disabled:opacity-50">
                          {t.reset}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
