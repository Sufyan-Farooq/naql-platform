'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ─── Types matching Prisma schema ───────────────────────────────────────────
export type UserRole   = 'SHIPPER' | 'CARRIER' | 'ADMIN';
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LoadStatus = 'ACTIVE' | 'PENDING_ASSIGNMENT' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
export type BidStatus  = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
export type TripStatus = 'ASSIGNED' | 'AT_PICKUP' | 'LOADED' | 'IN_TRANSIT' | 'AT_DELIVERY' | 'DELIVERED' | 'INVOICED';

export interface User {
  id: string;
  role: UserRole;
  status: UserStatus;
  name: string;
  company: string;
  email: string;
  phone?: string | null;
}

export interface LoadRoute {
  origin: string;
  destination: string;
  truckType: string;
  truckCount: number;
}

export interface Load {
  id: string;
  shipperId: string;
  shipper?: { name: string; company: string };
  refNumber: string;
  status: LoadStatus;
  cargoContent: string;
  cargoType: string;
  cargoWeight: number;
  routes: LoadRoute[];
  bidCloseTime: string;
  createdAt: string;
  isUrgent: boolean;
  bidsCount?: number;
  _count?: { bids: number };
  bids?: Bid[];
}

export interface Bid {
  id: string;
  loadId: string;
  carrierId: string;
  carrier?: { id: string; name: string; company: string; phone?: string };
  price: number;
  truckPlate: string;
  etaHours: number;
  notes?: string | null;
  routePrices?: { origin: string; destination: string; price: number }[];
  status: BidStatus;
  createdAt: string;
}

export interface TripEvent {
  title: string;
  titleEn: string;
  date: string;
  completed: boolean;
}

export interface Trip {
  id: string;
  loadId: string;
  carrierId: string;
  carrier?: { name: string; company: string; phone?: string };
  bidId: string;
  bid?: { price: number; truckPlate: string };
  status: TripStatus;
  progress: number;
  events: TripEvent[];
  load?: Load;
  updatedAt: string;
}

// ─── Context type ────────────────────────────────────────────────────────────
interface AppContextType {
  currentUser: User | null;
  isHydrated: boolean;
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  // Data
  loads: Load[];
  bids: Bid[];
  trips: Trip[];
  // Actions
  refreshLoads: () => Promise<void>;
  refreshBids: (loadId: string) => Promise<Bid[]>;
  refreshTrips: () => Promise<void>;
  postLoad: (data: Omit<Load, 'id' | 'createdAt' | 'status' | 'refNumber' | 'bidsCount' | '_count' | 'shipperId' | 'shipper' | 'isUrgent'> & { isUrgent?: boolean }) => Promise<void>;
  submitBid: (data: { loadId: string; price: number; truckPlate: string; etaHours: number; notes?: string; routePrices?: { origin: string; destination: string; price: number }[] }) => Promise<void>;
  acceptBid: (bidId: string, loadId: string) => Promise<void>;
  updateTripStatus: (tripId: string, newStatus: TripStatus) => Promise<void>;
  logout: () => Promise<void>;
  // Selectors (legacy compat)
  getLoadsForCurrentUser: () => Load[];
  getBidsForLoad: (loadId: string) => Bid[];
  getTripsForCurrentUser: () => Trip[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [langState, setLangState] = useState<'ar' | 'en'>('ar');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [loads, setLoads] = useState<Load[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  // ── Language / Theme helpers ─────────────────────────────
  const setLang = (l: 'ar' | 'en') => {
    setLangState(l);
    document.documentElement.lang = l;
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('naql_lang', l);
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('naql_theme', t);
  };

  // ── Bootstrap: load session user + preferences ───────────
  useEffect(() => {
    const savedTheme = (localStorage.getItem('naql_theme') as 'light' | 'dark') || 'light';
    const savedLang  = (localStorage.getItem('naql_lang') as 'ar' | 'en') || 'ar';

    setThemeState(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setLangState(savedLang);
    document.documentElement.lang = savedLang;
    document.documentElement.dir  = savedLang === 'ar' ? 'rtl' : 'ltr';

    // Fetch current user from session
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {})
      .finally(() => setIsHydrated(true));
  }, []);

  // ── Data fetchers ────────────────────────────────────────
  const refreshLoads = useCallback(async () => {
    const res = await fetch('/api/loads');
    if (res.ok) {
      const data = await res.json();
      setLoads(data.loads ?? []);
    }
  }, []);

  const refreshBids = useCallback(async (loadId: string): Promise<Bid[]> => {
    const res = await fetch(`/api/loads/${loadId}/bids`);
    if (res.ok) {
      const data = await res.json();
      // Merge bids into state for this load
      setBids(prev => {
        const others = prev.filter(b => b.loadId !== loadId);
        return [...others, ...(data.bids ?? [])];
      });
      return data.bids ?? [];
    }
    return [];
  }, []);

  const refreshTrips = useCallback(async () => {
    const res = await fetch('/api/trips');
    if (res.ok) {
      const data = await res.json();
      setTrips(data.trips ?? []);
    }
  }, []);

  // Auto-refresh loads when user is set
  useEffect(() => {
    if (currentUser) {
      refreshLoads();
      refreshTrips();
    }
  }, [currentUser, refreshLoads, refreshTrips]);

  // ── Actions ──────────────────────────────────────────────
  const postLoad = async (data: Parameters<AppContextType['postLoad']>[0]) => {
    const res = await fetch('/api/loads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to post load');
    }
    await refreshLoads();
  };

  const submitBid = async (data: Parameters<AppContextType['submitBid']>[0]) => {
    const res = await fetch(`/api/loads/${data.loadId}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit bid');
    }
    await refreshBids(data.loadId);
    await refreshLoads();
  };

  const acceptBid = async (bidId: string, loadId: string) => {
    const res = await fetch(`/api/bids/${bidId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to accept bid');
    }
    await refreshLoads();
    await refreshBids(loadId);
    await refreshTrips();
  };

  const updateTripStatus = async (tripId: string, newStatus: TripStatus) => {
    const res = await fetch(`/api/trips/${tripId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update trip');
    }
    await refreshTrips();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setLoads([]);
    setBids([]);
    setTrips([]);
    window.location.href = '/auth/login';
  };

  // ── Legacy selectors ─────────────────────────────────────
  const getLoadsForCurrentUser = () => loads;
  const getBidsForLoad = (loadId: string) => bids.filter(b => b.loadId === loadId);
  const getTripsForCurrentUser = () => trips;

  return (
    <AppContext.Provider value={{
      currentUser, isHydrated,
      lang: langState, setLang,
      theme, setTheme,
      loads, bids, trips,
      refreshLoads, refreshBids, refreshTrips,
      postLoad, submitBid, acceptBid, updateTripStatus, logout,
      getLoadsForCurrentUser, getBidsForLoad, getTripsForCurrentUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
