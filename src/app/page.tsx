'use client';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
   ───────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   COUNTER HOOK
   ───────────────────────────────────────────── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─────────────────────────────────────────────
   SVG SAUDI MAP COMPONENT (Accurate shape)
   ───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   SVG SAUDI ARABIA REALISTIC MAP COMPONENT
   ───────────────────────────────────────────── */
function SaudiMap() {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  // Pixel-perfect mapping to KSA geographical landmarks on the SVG
  const cities = [
    { id: 'tabuk', name: 'تبوك', x: 200, y: 300, traffic: 340 },
    { id: 'riyadh', name: 'الرياض', x: 550, y: 500, traffic: 1240 },
    { id: 'jeddah', name: 'جدة', x: 220, y: 560, traffic: 890 },
    { id: 'dammam', name: 'الدمام', x: 740, y: 480, traffic: 560 },
    { id: 'abha', name: 'أبها', x: 340, y: 780, traffic: 470 },
  ];

  const getPos = (id: string) => {
    const c = cities.find(city => city.id === id);
    return c ? `${c.x} ${c.y}` : '0 0';
  };

  const routes = [
    { id: 'r-j', path: `M${getPos('riyadh')} L${getPos('jeddah')}`, active: true },
    { id: 'r-d', path: `M${getPos('riyadh')} L${getPos('dammam')}`, active: true },
    { id: 'r-t', path: `M${getPos('riyadh')} L${getPos('tabuk')}`, active: false },
    { id: 'r-a', path: `M${getPos('riyadh')} L${getPos('abha')}`, active: false },
    { id: 'j-a', path: `M${getPos('jeddah')} L${getPos('abha')}`, active: false },
  ];

  const activeHover = cities.find(c => c.id === activeCity);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none flex justify-center items-center" aria-hidden="true" style={{ minHeight: '450px' }}>
      
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[340px] h-[340px] rounded-full bg-amber/5 filter blur-[100px]" />
      </div>

      {/* Tooltip Overlay (HTML based for easy styling) */}
      <div 
        className={`absolute top-4 right-4 bg-surface/90 backdrop-blur border border-amber/30 p-4 rounded-xl shadow-2xl z-20 pointer-events-none transition-all duration-300 ${activeCity ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="text-amber font-bold text-lg mb-1">{activeHover?.name}</div>
        <div className="text-white/70 text-xs font-mono">Live Shipments: <span className="text-white">{activeHover?.traffic}</span></div>
        <div className="text-green-400 text-xs font-mono mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Active Hub
        </div>
      </div>

      <svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[110%] relative z-10" preserveAspectRatio="xMidYMid meet">
        
        {/* Genuine High-Fidelity KSA Map Path */}
        <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)">
          <path
            d="M2199 9455 l-44 -44 -465 -136 c-256 -75 -475 -139 -488 -143 -22 -7 -7 -27 205 -268 125 -143 234 -267 241 -276 11 -14 3 -22 -66 -64 -79 -47 -79 -47 -117 -133 -21 -47 -42 -90 -47 -96 -5 -5 -88 -26 -184 -46 -96 -20 -176 -38 -178 -40 -2 -2 -32 -47 -67 -100 -45 -68 -92 -121 -160 -182 l-97 -87 -271 43 -272 44 -14 -27 c-18 -35 -54 -227 -64 -347 -9 -98 -48 -215 -95 -288 -17 -25 -16 -27 3 -58 l21 -32 0 26 c0 36 22 54 48 40 24 -13 99 -17 128 -7 45 16 199 -169 228 -273 14 -50 27 -72 76 -121 33 -34 63 -73 66 -88 12 -57 28 -84 76 -127 32 -29 53 -57 60 -81 5 -21 28 -59 51 -85 23 -27 69 -104 102 -171 59 -121 66 -129 141 -174 17 -10 18 -15 6 -48 -22 -59 8 -109 65 -111 16 0 89 -88 114 -137 10 -20 19 -48 19 -61 0 -14 17 -40 45 -67 44 -43 45 -46 45 -105 0 -79 -8 -105 -31 -105 -25 0 -24 -6 10 -49 48 -61 111 -167 111 -187 1 -46 57 -79 102 -60 11 5 23 1 35 -14 20 -24 124 -80 148 -80 8 0 32 -15 52 -33 21 -19 59 -48 85 -66 29 -19 50 -42 53 -56 3 -14 7 -36 10 -48 2 -13 29 -57 59 -98 41 -57 57 -89 69 -142 9 -43 25 -80 44 -102 63 -77 75 -95 61 -95 -8 0 -20 6 -27 13 -16 14 -16 16 33 -88 21 -44 44 -88 53 -97 8 -9 19 -34 23 -55 8 -31 6 -41 -11 -59 -21 -22 -49 -135 -49 -199 0 -24 8 -52 21 -70 11 -16 32 -55 45 -85 27 -58 27 -120 2 -175 -9 -20 -3 -38 43 -125 44 -84 60 -105 87 -117 27 -11 31 -17 22 -28 -8 -10 -6 -16 9 -27 11 -8 37 -46 58 -85 27 -49 55 -85 90 -112 46 -37 57 -41 106 -41 51 0 59 -3 103 -44 27 -24 76 -57 109 -74 50 -25 64 -38 82 -76 20 -40 27 -46 53 -46 16 0 30 -1 30 -2 0 -2 7 -21 14 -43 12 -34 12 -41 -1 -50 -12 -9 -6 -19 35 -57 40 -38 51 -57 66 -111 18 -67 36 -92 71 -99 20 -4 21 -8 8 -68 -3 -18 2 -31 16 -44 13 -12 21 -31 21 -52 0 -46 15 -81 38 -88 25 -8 68 -72 75 -112 3 -18 20 -53 37 -80 16 -26 30 -55 30 -65 0 -9 7 -22 15 -29 8 -6 26 -32 40 -57 19 -32 39 -50 69 -63 24 -10 53 -32 65 -49 12 -17 42 -44 65 -61 48 -32 76 -89 96 -191 10 -52 13 -56 35 -51 31 5 75 -40 75 -78 0 -18 10 -33 30 -48 36 -27 63 -86 55 -122 -4 -19 1 -32 20 -50 14 -13 25 -32 25 -42 0 -23 1 -23 59 6 53 27 81 62 81 101 0 21 5 25 31 25 33 0 33 4 3 79 -17 41 -17 60 -3 173 l12 88 47 35 c67 49 123 49 187 0 62 -47 115 -61 173 -46 25 7 52 19 61 27 10 9 38 14 80 14 66 0 135 -26 867 -326 l112 -46 0 -265 c0 -146 4 -263 9 -261 4 2 272 301 595 665 323 365 590 663 593 663 4 0 351 81 772 180 l766 181 741 261 741 260 157 514 c86 283 154 520 150 527 -20 35 -208 333 -216 342 -6 6 -14 3 -23 -9 -13 -18 -34 -16 -607 63 -326 45 -605 84 -619 87 -20 4 -84 78 -267 308 -210 264 -241 308 -244 342 -3 34 -8 41 -42 58 -32 16 -42 17 -59 7 -13 -9 -23 -9 -29 -3 -17 17 1 61 43 107 33 36 38 46 25 51 -8 3 -27 -3 -42 -15 -27 -21 -27 -21 -41 -1 -12 17 -21 19 -75 13 l-62 -6 -38 44 c-26 30 -46 44 -65 45 -21 0 -29 8 -39 35 -7 19 -13 44 -13 56 -1 12 -14 36 -31 53 -33 34 -38 47 -48 140 -7 62 -9 66 -45 85 -33 18 -137 123 -137 139 0 4 14 0 30 -9 17 -9 30 -13 30 -9 0 3 -13 22 -30 41 -16 18 -30 43 -30 55 0 11 -16 38 -35 59 -26 29 -35 48 -35 73 0 44 11 51 43 26 l25 -20 16 25 c9 14 16 45 16 72 0 43 -4 51 -44 88 -47 43 -62 79 -52 120 6 24 7 25 32 9 41 -28 38 -8 -6 40 -34 37 -49 46 -76 46 -18 0 -39 7 -46 16 -7 9 -34 39 -59 68 -25 28 -52 61 -58 74 -9 16 -18 21 -29 17 -44 -18 -48 -16 -72 35 -13 28 -39 65 -57 81 l-34 29 30 0 c37 0 44 11 25 38 -12 18 -25 22 -69 22 -44 0 -56 4 -65 20 -8 14 -21 20 -46 20 -28 0 -36 5 -44 26 -13 33 -13 77 0 69 6 -3 10 -16 11 -28 0 -19 2 -18 11 6 12 34 -3 61 -63 109 -56 45 -95 125 -104 213 -11 107 -6 105 -220 105 l-183 0 -26 34 c-14 19 -26 47 -26 62 0 15 -16 55 -35 89 l-34 62 -219 32 c-169 26 -224 31 -240 22 -11 -6 -38 -11 -59 -11 -47 0 -802 78 -811 84 -4 2 -292 240 -640 528 l-632 524 -163 72 c-145 64 -192 92 -398 234 -129 88 -243 164 -254 169 -11 4 -144 31 -295 59 -151 28 -280 53 -286 55 -6 2 -31 -16 -55 -40z"
            stroke="var(--amber)"
            strokeWidth="15"
            fill="var(--amber)"
            fillOpacity="0.08"
            strokeLinejoin="round"
            className="opacity-80"
          />
          <path d="M3520 1444 c0 -4 8 -12 17 -19 14 -11 15 -15 4 -28 -10 -13 -10 -21 1 -44 7 -15 21 -29 31 -31 14 -3 17 4 17 35 0 50 -20 87 -48 91 -12 2 -22 0 -22 -4z" fill="var(--amber)" fillOpacity="0.08" stroke="var(--amber)" strokeWidth="15" />
          <path d="M3487 1364 c-9 -10 17 -55 51 -88 27 -25 34 -27 59 -19 33 11 53 7 53 -12 0 -7 7 -16 16 -19 45 -17 47 44 3 85 -37 34 -49 36 -49 9 0 -33 -55 -27 -77 8 -25 38 -42 50 -56 36z" fill="var(--amber)" fillOpacity="0.08" stroke="var(--amber)" strokeWidth="15" />
        </g>

        {/* --- CONNECTING ROUTES (Background Tracks) --- */}
        {routes.map(r => (
          <path
            key={r.id + '-track'}
            d={r.path}
            stroke="var(--amber)"
            strokeWidth="2"
            fill="none"
            opacity="0.15"
            strokeLinecap="round"
          />
        ))}

        {/* --- CONNECTING ROUTES (Live Traffic Dots) --- */}
        {routes.map((r, i) => (
          <path
            key={r.id + '-traffic'}
            d={r.path}
            stroke="var(--amber)"
            strokeWidth={r.active ? "3.5" : "2.5"}
            strokeDasharray="4 60"
            fill="none"
            opacity={r.active ? "0.9" : "0.5"}
            strokeLinecap="round"
            style={{ animation: `traffic ${r.active ? '3s' : '5s'} linear infinite`, animationDelay: `${i * 0.5}s` }}
          />
        ))}

        {/* --- REGIONAL NODES --- */}
        {cities.map(c => (
          <g 
            key={c.id} 
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setActiveCity(c.id)}
            onMouseLeave={() => setActiveCity(null)}
            style={{ transformOrigin: `${c.x}px ${c.y}px`, transform: activeCity === c.id ? 'scale(1.2)' : 'scale(1)' }}
          >
            {/* Outer Interactive Area */}
            <circle cx={c.x} cy={c.y} r="35" fill="transparent" />
            
            {/* Primary Dot */}
            <circle cx={c.x} cy={c.y} r={c.id === 'riyadh' ? 12 : 8} fill="var(--amber)" opacity={activeCity === c.id || activeCity === null ? "1" : "0.4"} className="transition-opacity duration-300" />
            
            {/* Pulsing Aura */}
            <circle cx={c.x} cy={c.y} r={c.id === 'riyadh' ? 34 : 22} fill="var(--amber)" opacity="0.15" className="pulse-amber" />
            
            {/* City Label */}
            <text 
              x={c.x - (c.id === 'riyadh' ? 45 : 30)} 
              y={c.y - (c.id === 'riyadh' ? 30 : 20)} 
              fill="var(--amber)" 
              fontSize={c.id === 'riyadh' ? 24 : 18} 
              fontFamily="IBM Plex Mono" 
              fontWeight="bold"
              opacity={activeCity && activeCity !== c.id ? "0.2" : "1"}
              className="transition-opacity duration-300 pointer-events-none"
            >
              {c.name}
            </text>
          </g>
        ))}
      </svg>
      
      <style>{`
        @keyframes traffic {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -64; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ICON HELPERS
   ───────────────────────────────────────────── */
const Icon = ({ d, size = 24 }: { d: string; size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  check:    'M5 13l4 4L19 7',
  truck:    'M1 3h13v11H1zM16 6h4l2 4v4h-6V6zM5.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  box:      'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  snowflake:'M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07',
  crane:    'M4 22V12M4 12l4-8M4 12h16M20 12V22M8 4h8v8H8V4zM12 4v8',
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  map:      'M1 6l7-4 8 4 7-4v14l-7 4-8-4-7 4V6z',
  bid:      'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
  verified: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  waybill:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  payment:  'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  gps:      'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  invoice:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  whatsapp: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  arabic:   'M4 6h16M4 12h12M4 18h8',
  sun:      'M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M19.79 17.5l-.87-.5M4.21 6.5l.87.5M21 12h-1M4 12H3m15.36-5.64L17 7.72M7 16.28l-1.36 1.36M17 16.28l1.36 1.36M7 7.72L5.64 6.36M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon:     'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  menu:     'M4 6h16M4 12h16M4 18h16',
  close:    'M6 18L18 6M6 6l12 12',
  star:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  phone:    'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  mail:     'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  location: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
};

/* ─────────────────────────────────────────────
   TESTIMONIALS DATA
   ───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    nameAr: 'أحمد الزهراني',
    nameEn: 'Ahmed Al-Zahrani',
    roleAr: 'مدير لوجستيات، شركة الريم التجارية',
    roleEn: 'Logistics Manager, Al-Reem Trading Co.',
    quoteAr: 'وفّرنا 23% من تكاليف الشحن منذ انضمامنا لمنصة نقل. المزاد المفتوح غيّر طريقة تفكيرنا في التسعير.',
    quoteEn: 'We saved 23% on freight costs since joining NAQL. The open auction changed how we think about pricing.',
    rating: 5,
    initials: 'أ',
  },
  {
    nameAr: 'محمد القحطاني',
    nameEn: 'Mohammed Al-Qahtani',
    roleAr: 'صاحب أسطول، شركة اليسر للنقل',
    roleEn: 'Fleet Owner, Al-Yusr Transport',
    quoteAr: 'قبل نقل كنا نبحث عن حمولات يدوياً. الآن نستقبل طلبات يومياً وشاحناتنا محجوزة دائماً.',
    quoteEn: 'Before NAQL we searched for loads manually. Now we receive requests daily and our trucks are always booked.',
    rating: 5,
    initials: 'م',
  },
  {
    nameAr: 'سلمى العمري',
    nameEn: 'Salma Al-Omari',
    roleAr: 'مديرة العمليات، مجموعة الأمل الغذائية',
    roleEn: 'Operations Director, Al-Amal Food Group',
    quoteAr: 'الناقلون الموثّقون والفواتير الإلكترونية المتوافقة مع زاتكا جعلت الامتثال أسهل بكثير.',
    quoteEn: 'Verified carriers and ZATCA-compliant e-invoices made compliance so much easier.',
    rating: 5,
    initials: 'س',
  },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────── */
export default function LandingPage() {
  const { lang, setLang, theme, setTheme } = useAppContext();
  const router = useRouter();
  const isAr = lang === 'ar';

  // Scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reveal animations
  useReveal();

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // How it Works toggle
  const [flowTab, setFlowTab] = useState<'shipper' | 'carrier'>('shipper');

  // Testimonial carousel
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  // Contact form
  const [contactForm, setContactForm] = useState({ 
    type: 'shipper', // 'shipper' | 'carrier'
    name: '', email: '', countryCode: '+966', mobile: '', company: '', 
    // Shipper
    cargoType: '', cargoWeight: '', typeOfTruck: '', noOfTrucks: '', repeatOrder: '',
    // Carrier
    fleetSize: '', operationalRegions: '', truckTypesAvailable: [] as string[], otherTruckTypes: '', regularContracts: '',
    // Global
    source: '', message: '' 
  });
  const [contactSent, setContactSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counters
  const cities   = useCounter(200);
  const tons     = useCounter(600000);
  const km       = useCounter(2500000);
  const carriers = useCounter(1200);

  /* ── TRANSLATIONS ── */
  const t = {
    // Nav
    navHome:        isAr ? 'الرئيسية'      : 'Home',
    navHow:         isAr ? 'كيف نعمل'      : 'How It Works',
    navServices:    isAr ? 'خدماتنا'        : 'Services',
    navWhy:         isAr ? 'لماذا نقل'     : 'Why NAQL',
    navContact:     isAr ? 'اتصل بنا'       : 'Contact',
    navLogin:       isAr ? 'تسجيل الدخول'  : 'Sign In',
    navStart:       isAr ? 'ابدأ الآن'      : 'Get Started',
    // Hero
    heroTag:        isAr ? 'منصة الشحن الأولى في السعودية' : 'Saudi Arabia\'s #1 Freight Platform',
    heroTitle1:     isAr ? 'وصّل شحنتك'    : 'Freight.',
    heroTitle2:     isAr ? 'بأفضل سعر'     : 'Simplified.',
    heroTitle3:     isAr ? ''              : 'Transparent.',
    heroSub:        isAr
      ? 'نقطة تواصل واحدة — قوة شراء أكبر — أسعار أفضل. منصة نقل تربط الشاحنين بأسطول ضخم من الناقلين الموثوقين عبر مزاد مفتوح وشفاف.'
      : 'One contact point. Bigger buying power. Better rates. NAQL connects shippers with a massive fleet of verified carriers through a transparent open auction.',
    btnShipper:     isAr ? 'أنا شاحن'      : 'I\'m a Shipper',
    btnCarrier:     isAr ? 'أنا ناقل'       : 'I\'m a Carrier',
    statCities:     isAr ? 'مدينة مغطاة'   : 'Cities Covered',
    statTons:       isAr ? 'طن تم نقلها'   : 'Tons Moved',
    statKm:         isAr ? 'كم مقطوعة'     : 'Km Driven',
    statCarriers:   isAr ? 'ناقل موثّق'    : 'Verified Carriers',
    // How it works
    howTitle:       isAr ? 'كيف نعمل'      : 'How It Works',
    howSub:         isAr ? 'عملية بسيطة من ثلاث خطوات تُعيد تعريف الشحن في المملكة' : 'A simple three-step process that redefines freight in Saudi Arabia',
    tabShipper:     isAr ? 'للشاحنين'      : 'For Shippers',
    tabCarrier:     isAr ? 'للناقلين'       : 'For Carriers',
    shipperSteps: isAr ? [
      { num:'01', title:'سجّل وأضف شركتك', desc:'أنشئ حساباً، أضف بياناتك التجارية واحصل على التحقق خلال 24 ساعة' },
      { num:'02', title:'انشر حمولتك واستقبل العروض', desc:'صف الشحنة، حدد المسار والمواعيد وافتح باب المزايدة للناقلين' },
      { num:'03', title:'اختر وتابع وادفع', desc:'قارن العروض، اختر الأنسب، تتبع الشحنة لحظياً وادفع بأمان' },
    ] : [
      { num:'01', title:'Register Your Company', desc:'Create an account, add your business details and get verified within 24 hours' },
      { num:'02', title:'Post Your Load & Receive Bids', desc:'Describe your cargo, set the route and timeline, and open bidding to carriers' },
      { num:'03', title:'Choose, Track & Pay', desc:'Compare bids, select the best offer, track your shipment live, and pay securely' },
    ],
    carrierSteps: isAr ? [
      { num:'01', title:'سجّل أسطولك', desc:'أضف شاحناتك ومستنداتها للحصول على شارة الناقل الموثّق' },
      { num:'02', title:'تصفح الأحمال وقدّم عرضك', desc:'اطلع على الحمولات المتاحة في منطقتك وأرسل سعرك التنافسي' },
      { num:'03', title:'نفّذ الرحلة واستلم المدفوعات', desc:'أنجز الشحنة، ارفع إثبات التسليم واستلم مدفوعاتك في 3-5 أيام' },
    ] : [
      { num:'01', title:'Register Your Fleet', desc:'Add your trucks and documents to get the Verified Carrier badge' },
      { num:'02', title:'Browse Loads & Submit Bids', desc:'View available loads in your area and submit your competitive price' },
      { num:'03', title:'Complete Trip & Get Paid', desc:'Deliver the shipment, upload proof of delivery and receive payment in 3-5 days' },
    ],
    // Services
    servicesTitle:  isAr ? 'خدماتنا'        : 'Our Services',
    servicesSub:    isAr ? 'حلول شحن شاملة لكل احتياجات أعمالك في المملكة والخليج' : 'Comprehensive freight solutions for all your business needs across Saudi Arabia and the GCC',
    services: isAr ? [
      { icon: ICONS.truck,     title: 'شاحنة كاملة / FTL',        desc: 'حجز شاحنة كاملة لشحناتك الكبيرة بأفضل الأسعار المزايَد عليها' },
      { icon: ICONS.box,       title: 'حمولة جزئية / LTL',        desc: 'شارك في الشاحنة مع آخرين ووفّر في التكلفة لشحناتك الصغيرة' },
      { icon: ICONS.snowflake, title: 'شحن مبرّد',                desc: 'ناقلون متخصصون في نقل المواد الغذائية والطبية التي تتطلب تبريداً' },
      { icon: ICONS.crane,     title: 'شحن ثقيل وبضائع كبيرة',   desc: 'معدات وأوناش لنقل الآليات والمعدات الثقيلة وذات الأبعاد الكبيرة' },
      { icon: ICONS.shield,    title: 'مواد خطرة وكيميائية',      desc: 'ناقلون مرخصون لنقل المواد الخطرة وفق اشتراطات الهيئات السعودية' },
      { icon: ICONS.map,       title: 'شحن عبر دول الخليج',       desc: 'مسارات منتظمة للمملكة والإمارات والكويت والبحرين وقطر وعُمان' },
    ] : [
      { icon: ICONS.truck,     title: 'Full Truck Load (FTL)',     desc: 'Reserve a full truck for your large shipments at the best auctioned prices' },
      { icon: ICONS.box,       title: 'Less Than Truck (LTL)',     desc: 'Share truck space with others and cut costs for smaller shipments' },
      { icon: ICONS.snowflake, title: 'Refrigerated Transport',   desc: 'Specialized carriers for food and medical goods requiring temperature control' },
      { icon: ICONS.crane,     title: 'Heavy & Oversized Freight', desc: 'Equipment and cranes for moving heavy machinery and oversized loads' },
      { icon: ICONS.shield,    title: 'Hazardous Materials',       desc: 'Licensed carriers for dangerous goods per Saudi regulatory requirements' },
      { icon: ICONS.map,       title: 'Cross-border GCC',          desc: 'Regular routes across KSA, UAE, Kuwait, Bahrain, Qatar and Oman' },
    ],
    // Why NAQL
    whyTitle:       isAr ? 'لماذا نقل؟'    : 'Why NAQL?',
    whySub:         isAr ? 'ليس مجرد منصة — نحن شركاؤك في النمو' : 'Not just a platform — we are your growth partners',
    features: isAr ? [
      { icon: ICONS.bid,       title: 'مزاد عروض شفاف',            desc: 'الشاحنون يرون جميع عروض الناقلين — تنافسية حقيقية' },
      { icon: ICONS.verified,  title: 'ناقلون موثّقون ومُقيَّمون', desc: 'كل ناقل خضع لمراجعة الوثائق والتصنيف بالنجوم' },
      { icon: ICONS.waybill,   title: 'بوليصات بيان متوافقة',       desc: 'توليد تلقائي لبوليصات الشحن متوافقة مع وزارة النقل' },
      { icon: ICONS.payment,   title: 'دفع آمن بالضمان',           desc: 'الأموال محتجزة في الضمان ولا تُحرَّر إلا بعد التسليم' },
      { icon: ICONS.gps,       title: 'تتبع فوري GPS',              desc: 'اعرف موقع شحنتك في أي لحظة على الخريطة' },
      { icon: ICONS.invoice,   title: 'فواتير ZATCA الإلكترونية',   desc: 'فواتير موافقة لمتطلبات هيئة الزكاة والضريبة' },
      { icon: ICONS.whatsapp,  title: 'إشعارات واتساب',            desc: 'تنبيهات فورية عبر واتساب لكل حدث في شحنتك' },
      { icon: ICONS.arabic,    title: 'دعم عربي متكامل',           desc: 'المنصة عربية أولاً مع دعم كامل للغة والثقافة المحلية' },
    ] : [
      { icon: ICONS.bid,       title: 'Transparent Bid Auction',   desc: 'Shippers see all carrier offers — real competition drives better prices' },
      { icon: ICONS.verified,  title: 'Verified & Rated Carriers', desc: 'Every carrier is document-verified and star-rated by shippers' },
      { icon: ICONS.waybill,   title: 'Bayan-Compliant Waybills',  desc: 'Auto-generated waybills compliant with Saudi Ministry of Transport' },
      { icon: ICONS.payment,   title: 'Secure Escrow Payments',    desc: 'Funds held in escrow and released only upon confirmed delivery' },
      { icon: ICONS.gps,       title: 'Real-time GPS Tracking',    desc: 'Know your shipment\'s location at any moment on the map' },
      { icon: ICONS.invoice,   title: 'ZATCA e-Invoicing',         desc: 'Invoices compliant with Saudi Tax Authority Phase 2 requirements' },
      { icon: ICONS.whatsapp,  title: 'WhatsApp Notifications',    desc: 'Instant WhatsApp alerts for every shipment event' },
      { icon: ICONS.arabic,    title: 'Full Arabic Support',       desc: 'Arabic-first platform with full local language and culture support' },
    ],
    // Stats
    statsTitle:     isAr ? 'أرقام تتحدث عن نفسها' : 'Numbers That Speak for Themselves',
    // Testimonials
    testimonialsTitle: isAr ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say',
    // Contact
    contactTitle:   isAr ? 'تواصل معنا أو اطلب عرضاً' : 'Contact Us or Request a Demo',
    contactSub:     isAr ? 'يرجى تعبئة النموذج أدناه وسيقوم فريقنا بالتواصل معك خلال 24 ساعة عمل.' : 'Fill out the form below and our team will reach out to you in 24 business hours.',
    fName:          isAr ? 'الاسم الكامل'         : 'Name',
    fEmail:         isAr ? 'البريد الإلكتروني'    : 'Email Address',
    fCountryCode:   isAr ? 'رمز الدولة'           : 'Country Code',
    fMobile:        isAr ? 'رقم الجوال'           : 'Phone',
    fMobilePlaceholder: isAr ? 'أدخل الرقم بدون "0"' : 'enter the number without the "0"',
    fCompany:       isAr ? 'اسم الشركة'           : 'Company Name',
    
    // Shipper Specific
    fCargoType:     isAr ? 'نوع البضاعة'          : 'Cargo Type',
    fCargoWeight:   isAr ? 'وزن البضاعة'          : 'Cargo Weight',
    fTypeOfTruck:   isAr ? 'نوع الشاحنة'          : 'Type of Truck',
    fNumTrucks:     isAr ? 'عدد الشاحنات'         : 'No. of Trucks',
    fRepeatOrder:   isAr ? 'هل سيكون هذا الطلب متكررًا؟' : 'Will this be a repeat order?',
    
    // Carrier Specific
    fFleetSize:     isAr ? 'حجم الأسطول (عدد الشاحنات)' : 'Fleet Size (Number of Trucks)',
    fOpRegions:     isAr ? 'مناطق التشغيل'        : 'Operational Regions',
    fAvailableTrucks:isAr ? 'أنواع الشاحنات المتوفرة' : 'Truck Types Available',
    fOtherTrucks:   isAr ? 'أنواع شاحنات أخرى'    : 'Other Truck Types',
    fRegularContracts:isAr ? 'هل أنت مهتم بالعقود المنتظمة؟' : 'Are You Interested in Regular Contracts?',
    
    // Global End
    fSource:        isAr ? 'كيف تعرفت علينا؟'     : 'What brought you here?',
    fDiscuss:       isAr ? 'ما الذي تود مناقشته؟'  : 'What would you like to discuss?',
    fY:             isAr ? 'نعم'                   : 'Yes',
    fN:             isAr ? 'لا'                    : 'No',
    fSelectOne:     isAr ? 'اختر...'               : 'Select one...',
    fTypeLabel:     isAr ? 'أنا مسجل كـ'           : 'I am a',
    fTypeShipper:   isAr ? 'شاحن أعمال'              : 'Business Shipper',
    fTypeCarrier:   isAr ? 'مزود / ناقل'             : 'Carrier / Supplier',
    fSubmit:        isAr ? 'إرسال الطلب'           : 'Send Request',
    fSent:          isAr ? 'تم إرسال طلبك! سنتواصل معك قريباً.' : 'Request sent! We\'ll be in touch shortly.',
    infoEmail:      'info@naql.sa',
    infoPhone:      '+966 11 234 5678',
    infoAddress:    isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
    // Footer
    footerTagline:  isAr ? 'منصة الشحن الأولى في السعودية' : 'Saudi Arabia\'s freight platform',
    footerLinks:    isAr ? 'روابط سريعة'  : 'Quick Links',
    footerServices: isAr ? 'خدماتنا'      : 'Services',
    footerContact:  isAr ? 'تواصل معنا'   : 'Contact',
    footerPrivacy:  isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
    footerTerms:    isAr ? 'الشروط والأحكام'  : 'Terms & Conditions',
    footerCopy:     isAr ? '© 2025 نقل — جميع الحقوق محفوظة' : '© 2025 NAQL — All rights reserved',
  };

  /* ── CITIES DROPDOWN ── */
  const cities_list = isAr
    ? ['الرياض','جدة','الدمام','مكة المكرمة','المدينة المنورة','الخبر','الطائف','تبوك','أبها','نجران']
    : ['Riyadh','Jeddah','Dammam','Makkah','Madinah','Khobar','Taif','Tabuk','Abha','Najran'];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (resp.ok) {
        setContactSent(true);
      } else {
        const err = await resp.json();
        console.error('Submission failed:', err.error);
        alert(isAr ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' : 'Error sending request. Please try again.');
      }
    } catch (err) {
      console.error('Contact Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary-dark)', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════ */}
      <nav
        className="fixed w-full z-50 transition-all duration-300"
        style={{
          background: isScrolled ? 'var(--surface)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          padding: isScrolled ? '12px 0' : '20px 0',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div style={{ width:38,height:38,borderRadius:6,background:'var(--amber)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M2 14L6 6l4 6 4-8 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 4l-4 0 0 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span
              className="font-display-ar font-bold text-xl hidden sm:block transition-colors"
              style={{ color: 'var(--text-primary-dark)' }}
            >
              {isAr ? 'نقل | NAQL' : 'NAQL | نقل'}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="hidden md:flex items-center gap-8 font-medium text-sm transition-colors"
            style={{ color: 'var(--text-primary-dark)' }}
          >
            {[['#how-it-works', t.navHow], ['#services', t.navServices], ['#why-naql', t.navWhy], ['#contact', t.navContact]].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-amber transition-colors" style={{ color: 'inherit', textDecoration: 'none' }}>
                {label}
              </a>
            ))}
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              style={{
                width:36, height:36, borderRadius:6,
                background: 'var(--surface-mid)',
                border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                color: 'var(--text-primary-dark)',
                transition: 'all 0.2s',
              }}
            >
              <Icon d={isDark ? ICONS.sun : ICONS.moon} size={18} />
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              style={{
                padding:'6px 12px', borderRadius:6, border:'1px solid var(--border)', cursor:'pointer',
                fontSize:13, fontWeight:700,
                background: 'var(--surface-mid)',
                color: 'var(--text-primary-dark)',
                transition: 'all 0.2s',
              }}
            >
              {isAr ? 'EN' : 'عربي'}
            </button>

            <Link
              href="/auth/login"
              className="btn-ghost hidden sm:inline-flex"
              style={{
                color: 'var(--text-primary-dark)',
                borderColor: 'var(--border)',
              }}
            >
              {t.navLogin}
            </Link>
            <Link href="/auth/register/shipper" className="btn-primary text-sm">
              {t.navStart}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--text-primary-dark)', background:'none', border:'none', cursor:'pointer' }}
            >
              <Icon d={mobileMenuOpen ? ICONS.close : ICONS.menu} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background:'var(--surface-mid)', padding:'20px 24px', borderTop:'1px solid var(--border)' }}>
            {[['#how-it-works', t.navHow], ['#services', t.navServices], ['#why-naql', t.navWhy], ['#contact', t.navContact]].map(([href, label]) => (
              <a
                key={href} href={href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display:'block', padding:'14px 0', color:'var(--text-primary-dark)', textDecoration:'none', fontSize:16, borderBottom:'1px solid var(--border)' }}
              >
                {label}
              </a>
            ))}
            <div style={{ marginTop:16, display:'flex', gap:12 }}>
              <Link href="/auth/login" className="btn-ghost" style={{ flex:1, color:'var(--text-primary-dark)', borderColor:'var(--border)' }} onClick={() => setMobileMenuOpen(false)}>
                {t.navLogin}
              </Link>
              <Link href="/auth/register/shipper" className="btn-primary" style={{ flex:1 }} onClick={() => setMobileMenuOpen(false)}>
                {t.navStart}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
      <section
        className="grain relative overflow-hidden transition-colors duration-300"
        style={{
          background:'var(--surface-mid)',
          minHeight:'100vh',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          paddingTop:120,
          paddingBottom:80,
        }}
      >
        {/* Background glow */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'20%', right:'5%', width:500, height:500, borderRadius:'50%', background:'var(--amber)', opacity: 0.08, filter:'blur(100px)' }} />
          <div style={{ position:'absolute', bottom:'10%', left:'5%', width:400, height:400, borderRadius:'50%', background:'var(--teal)', opacity: 0.1, filter:'blur(120px)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:32, flexWrap:'wrap' }}>
            {/* Left: Text */}
            <div style={{ flex:'1 1 380px', minWidth:280, maxWidth:'600px' }}>
              {/* Tag */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--amber-dim)', border:'1px solid rgba(232,131,10,0.3)', borderRadius:4, padding:'6px 14px', marginBottom:24 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--amber)' }} />
                <span style={{ color:'var(--amber)', fontSize:13, fontWeight:600 }}>{t.heroTag}</span>
              </div>

              <h1
                className={isAr ? 'font-display-ar' : 'font-display-en'}
                style={{ fontSize:'clamp(2.2rem, 4.5vw, 4rem)', lineHeight:1.1, color:'var(--text-primary-dark)', marginBottom:24, fontWeight:900 }}
              >
                {t.heroTitle1}<br />
                <span style={{ color:'var(--amber)' }}>{t.heroTitle2}</span>
                {t.heroTitle3 && <> <span style={{ color:'var(--amber)', display:'block' }}>{t.heroTitle3}</span></>}
              </h1>

              <p style={{ fontSize:'1.1rem', color:'var(--text-muted)', maxWidth:480, lineHeight:1.8, marginBottom:36 }}>
                {t.heroSub}
              </p>

              <div style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:48 }}>
                <button
                  onClick={() => router.push('/auth/register/shipper')}
                  className="btn-primary"
                  style={{ height:52, padding:'0 32px', fontSize:16 }}
                >
                  {t.btnShipper}
                </button>
                <button
                  onClick={() => router.push('/auth/register/carrier')}
                  className="btn-outline-amber"
                  style={{ height:52, padding:'0 32px', fontSize:16, background:'transparent' }}
                >
                  {t.btnCarrier}
                </button>
              </div>

              {/* Stats bar */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:24 }}>
                {[
                  { n:'+200', label:t.statCities },
                  { n:'+600K', label:t.statTons },
                  { n:'+2.5M', label:t.statKm },
                ].map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:16 }}>
                    {i > 0 && <div style={{ width:1, height:32, background:'var(--border)' }} />}
                    <div>
                      <div className="font-mono" style={{ fontSize:22, fontWeight:700, color:'var(--amber)' }}>{s.n}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: SVG Map */}
            <div style={{ flex:'1 1 320px', minWidth:280 }}>
              <SaudiMap />
            </div>
          </div>
        </div>

        {/* Amber divider */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'var(--amber)', opacity:0.3 }} />
      </section>

      {/* ══════════════════════════════════════
          TICKER
          ══════════════════════════════════════ */}
      <div style={{ background:'var(--amber)', overflow:'hidden', padding:'14px 0' }} aria-hidden="true">
        <div className="ticker-inner">
          {[...Array(2)].map((_, gi) => (
            <div key={gi} style={{ display:'flex', alignItems:'center', gap:0, whiteSpace:'nowrap' }}>
              {(isAr
                ? ['شاحنة كاملة FTL','حمولة جزئية LTL','شحن مبرّد','شحن ثقيل','مواد خطرة','عبر الخليج','تتبع GPS','فواتير ZATCA','بوليصات بيان']
                : ['Full Truck Load','Less Than Truck','Refrigerated','Heavy Hauling','Hazardous','Cross-border GCC','GPS Tracking','ZATCA Invoicing','Bayan Waybills']
              ).map((s, i) => (
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:24 }}>
                  <span style={{ color:'#0D1B2A', fontWeight:700, fontSize:14, fontFamily: isAr ? 'Tajawal,Cairo,sans-serif' : 'Syne,sans-serif', padding:'0 32px' }}>{s}</span>
                  <span style={{ color:'rgba(13,27,42,0.4)', fontSize:10 }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding:'96px 0', background:'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal" style={{ marginBottom:64, textAlign:'center' }}>
            <h2
              className={isAr ? 'font-display-ar' : 'font-display-en'}
              style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'var(--text-primary-dark)', marginBottom:16 }}
            >
              {t.howTitle}
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:'1.05rem', maxWidth:540, margin:'0 auto' }}>{t.howSub}</p>
            <div style={{ width:60, height:2, background:'var(--amber)', margin:'24px auto 0' }} />
          </div>

          {/* Toggle */}
          <div className="reveal reveal-delay-1" style={{ display:'flex', justifyContent:'center', marginBottom:56 }}>
            <div style={{ display:'inline-flex', background:'var(--surface-mid)', borderRadius:8, border:'1px solid var(--border)', padding:4, gap:4 }}>
              {(['shipper','carrier'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFlowTab(tab)}
                  style={{
                    padding:'10px 28px', borderRadius:6, border:'none', cursor:'pointer',
                    fontWeight:700, fontSize:14,
                    background: flowTab === tab ? 'var(--amber)' : 'transparent',
                    color: flowTab === tab ? 'white' : 'var(--text-muted)',
                    transition:'all 0.2s',
                    fontFamily: isAr ? 'Tajawal,Cairo,sans-serif' : 'inherit',
                  }}
                >
                  {tab === 'shipper' ? t.tabShipper : t.tabCarrier}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:32 }}>
            {(flowTab === 'shipper' ? t.shipperSteps : t.carrierSteps).map((step, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ position:'relative' }}>
                {/* Connector line */}
                {i < 2 && (
                  <div style={{
                    position:'absolute', top:24, [isAr ? 'left' : 'right']:-16, width:32, height:2,
                    background:'var(--amber)', opacity:0.4,
                    display:'none',
                  }} className="connector-line" />
                )}
                <div
                  className="card feature-block"
                  style={{ padding:32, height:'100%', borderTop:'3px solid var(--amber)', background:'var(--surface-card)', borderColor:'var(--border)' }}
                >
                  <div
                    className="font-mono"
                    style={{ fontSize:'3.5rem', fontWeight:900, color:'var(--amber)', opacity:0.3, lineHeight:1, marginBottom:20 }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className={isAr ? 'font-display-ar' : ''}
                    style={{ fontSize:'1.15rem', fontWeight:700, color:'var(--text-primary-dark)', marginBottom:12 }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES
          ══════════════════════════════════════ */}
      <section id="services" style={{ padding:'96px 0', background:'var(--surface-mid)', position:'relative', overflow:'hidden' }} className="grain transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6" style={{ position:'relative' }}>
          <div className="reveal" style={{ marginBottom:64, textAlign:'center' }}>
            <h2
              className={isAr ? 'font-display-ar' : 'font-display-en'}
              style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'var(--text-primary-dark)', marginBottom:16 }}
            >
              {t.servicesTitle}
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:'1.05rem', maxWidth:540, margin:'0 auto' }}>{t.servicesSub}</p>
            <div style={{ width:60, height:2, background:'var(--amber)', margin:'24px auto 0' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {t.services.map((s, i) => (
              <div
                key={i}
                className={`service-card reveal reveal-delay-${Math.min(i + 1, 5)}`}
                style={{
                  background:'var(--surface-card)',
                  borderRadius:8,
                  border:'1px solid var(--border)',
                  borderTop:'3px solid var(--amber)',
                  padding:28,
                  cursor:'default',
                }}
              >
                <div style={{ color:'var(--amber)', marginBottom:16, width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--amber-dim)', borderRadius:6 }}>
                  <Icon d={s.icon} size={22} />
                </div>
                <h3
                  className={isAr ? 'font-display-ar' : ''}
                  style={{ fontSize:'1.05rem', fontWeight:700, color:'var(--text-primary-dark)', marginBottom:10 }}
                >
                  {s.title}
                </h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY NAQL
          ══════════════════════════════════════ */}
      <section id="why-naql" style={{ padding:'96px 0', background:'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal" style={{ marginBottom:64, textAlign:'center' }}>
            <h2
              className={isAr ? 'font-display-ar' : 'font-display-en'}
              style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'var(--text-primary-dark)', marginBottom:16 }}
            >
              {t.whyTitle}
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:'1.05rem', maxWidth:540, margin:'0 auto' }}>{t.whySub}</p>
            <div style={{ width:60, height:2, background:'var(--amber)', margin:'24px auto 0' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {t.features.map((f, i) => (
              <div
                key={i}
                className={`card feature-block reveal reveal-delay-${Math.min(i % 4 + 1, 4)}`}
                style={{ padding:24, borderTop:'2px solid var(--amber)' }}
              >
                <div style={{ color:'var(--amber)', marginBottom:14, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--amber-dim)', borderRadius:6 }}>
                  <Icon d={f.icon} size={20} />
                </div>
                <h3 className={isAr ? 'font-display-ar' : ''} style={{ fontSize:'0.95rem', fontWeight:700, color:'var(--text-primary-dark)', marginBottom:8 }}>
                  {f.title}
                </h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.825rem', lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS COUNTER
          ══════════════════════════════════════ */}
      <section style={{ background:'var(--amber)', padding:'80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal" style={{ textAlign:'center', marginBottom:48 }}>
            <h2
              className={isAr ? 'font-display-ar' : 'font-display-en'}
              style={{ fontSize:'clamp(1.6rem,3vw,2.5rem)', fontWeight:900, color:'#0D1B2A' }}
            >
              {t.statsTitle}
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:32 }}>
            {[
              { ref:cities.ref,   count:cities.count,   suffix:'+', label:t.statCities,   note:'مدينة' },
              { ref:tons.ref,     count:tons.count,     suffix:'+', label:t.statTons,     note:'طن', comma:true },
              { ref:km.ref,       count:km.count,       suffix:'+', label:t.statKm,       note:'كم', comma:true },
              { ref:carriers.ref, count:carriers.count, suffix:'+', label:t.statCarriers, note:'' },
            ].map((s, i) => (
              <div key={i} ref={s.ref as React.RefObject<HTMLDivElement>} className={`reveal reveal-delay-${i + 1}`} style={{ textAlign:'center' }}>
                <div className="font-mono" style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:900, color:'#0D1B2A', lineHeight:1 }}>
                  {s.suffix}{s.comma ? s.count.toLocaleString() : s.count}
                </div>
                <div style={{ marginTop:8, fontSize:'1rem', fontWeight:700, color:'rgba(13,27,42,0.75)', fontFamily: isAr ? 'Tajawal,Cairo,sans-serif' : 'inherit' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════ */}
      <section style={{ padding:'96px 0', background:'var(--surface-mid)' }} className="grain transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6">
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <h2
              className={isAr ? 'font-display-ar' : 'font-display-en'}
              style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:900, color:'var(--text-primary-dark)', marginBottom:12 }}
            >
              {t.testimonialsTitle}
            </h2>
            <div style={{ width:60, height:2, background:'var(--amber)', margin:'16px auto 0' }} />
          </div>

          <div className="reveal reveal-delay-1 testimonial-carousel">
            <div className="testimonial-track" style={{ transform:`translateX(${isAr ? '' : '-'}${testimonialIdx * 100}%)` }}>
              {TESTIMONIALS.map((t2, i) => (
                <div key={i} className="testimonial-slide" style={{ padding:'0 8px' }}>
                  <div
                    className="testimonial-card"
                    style={{
                      background:'var(--surface-card)',
                      border: i === testimonialIdx ? '1px solid var(--amber)' : '1px solid var(--border)',
                      borderRadius:8,
                      padding:40,
                      boxShadow: i === testimonialIdx ? '0 0 30px rgba(232,131,10,0.08)' : 'none',
                      transition:'border-color 0.3s, box-shadow 0.3s',
                    }}
                  >
                    {/* Stars */}
                    <div style={{ display:'flex', gap:4, marginBottom:20, color:'var(--amber)' }}>
                      {Array(t2.rating).fill(0).map((_,si) => <Icon key={si} d={ICONS.star} size={18} />)}
                    </div>
                    <blockquote
                      className={isAr ? 'font-display-ar' : ''}
                      style={{ fontSize:'1.1rem', color:'var(--text-primary-dark)', lineHeight:1.8, marginBottom:28, fontStyle:'italic' }}
                    >
                      "{isAr ? t2.quoteAr : t2.quoteEn}"
                    </blockquote>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--amber-dim)', border:'1px solid rgba(232,131,10,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--amber)', fontWeight:700, fontSize:16 }}>
                        {t2.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight:700, color:'var(--text-primary-dark)', fontSize:'0.95rem' }}>{isAr ? t2.nameAr : t2.nameEn}</div>
                        <div style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginTop:3 }}>{isAr ? t2.roleAr : t2.roleEn}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:28 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                style={{
                  width: i === testimonialIdx ? 24 : 8, height:8,
                  borderRadius:4, border:'none', cursor:'pointer',
                  background: i === testimonialIdx ? 'var(--amber)' : 'var(--border)',
                  transition:'width 0.3s, background 0.3s',
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT / DEMO FORM
          ══════════════════════════════════════ */}
      <section id="contact" style={{ padding:'96px 0', background:'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal" style={{ textAlign:'center', marginBottom:64 }}>
            <h2
              className={isAr ? 'font-display-ar' : 'font-display-en'}
              style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:900, color:'var(--text-primary-dark)', marginBottom:12 }}
            >
              {t.contactTitle}
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:'1rem' }}>{t.contactSub}</p>
            <div style={{ width:60, height:2, background:'var(--amber)', margin:'20px auto 0' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:48, alignItems:'start' }} className="contact-grid">
            {/* Form */}
            <div className="card reveal" style={{ padding:40 }}>
              {contactSent ? (
                <div style={{ textAlign:'center', padding:'48px 0' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--teal-light)', border:'2px solid var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:'var(--teal)' }}>
                    <Icon d={ICONS.check} size={28} />
                  </div>
                  <p style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary-dark)' }}>{t.fSent}</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  {/* TYPE SELECTOR AT TOP */}
                  <div style={{ marginBottom: 24 }}>
                    <label className="naql-label text-sm mb-2 opacity-70 block">{t.fTypeLabel}</label>
                    <div style={{ display:'flex', gap:12 }}>
                      {(['shipper','carrier'] as const).map((tp) => (
                        <button
                          key={tp} type="button"
                          onClick={() => setContactForm({...contactForm, type:tp})}
                          style={{
                            flex:1, height:48, borderRadius:8, border:'1.5px solid', cursor:'pointer', fontWeight:700, fontSize:15,
                            borderColor: contactForm.type === tp ? 'var(--amber)' : 'var(--border)',
                            background:  contactForm.type === tp ? 'var(--amber)' : 'transparent',
                            color:       contactForm.type === tp ? 'var(--surface)' : 'var(--text-primary-dark)',
                            transition:'all 0.15s',
                          }}
                        >
                          {tp === 'shipper' ? t.fTypeShipper : t.fTypeCarrier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SHARED FIELDS */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:20, marginBottom: 20 }}>
                    <div>
                      <label className="naql-label">{t.fName}</label>
                      <input className="naql-input" required value={contactForm.name} onChange={e => setContactForm({...contactForm, name:e.target.value})} placeholder="John Corney" />
                    </div>
                    <div>
                      <label className="naql-label">{t.fEmail}</label>
                      <input className="naql-input" type="email" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email:e.target.value})} placeholder="you@company.com" />
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:20, marginBottom: 20 }}>
                    <div>
                      <label className="naql-label">{t.fCountryCode}</label>
                      <select className="naql-input" value={contactForm.countryCode} onChange={e => setContactForm({...contactForm, countryCode:e.target.value})}>
                        <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
                        <option value="+971">🇦🇪 UAE (+971)</option>
                        <option value="+973">🇧🇭 Bahrain (+973)</option>
                        <option value="+965">🇰🇼 Kuwait (+965)</option>
                        <option value="+968">🇴🇲 Oman (+968)</option>
                        <option value="+974">🇶🇦 Qatar (+974)</option>
                      </select>
                    </div>
                    <div>
                      <label className="naql-label">{t.fMobile}</label>
                      <input className="naql-input" type="tel" required value={contactForm.mobile} onChange={e => setContactForm({...contactForm, mobile:e.target.value})} placeholder={t.fMobilePlaceholder} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label className="naql-label">{t.fCompany}</label>
                    <input className="naql-input" required value={contactForm.company} onChange={e => setContactForm({...contactForm, company:e.target.value})} placeholder="e.g. Al Hamra Logistics" />
                  </div>

                  <div style={{ width: '100%', height: 1, background: 'var(--border)', margin: '32px 0' }} />

                  {/* SHIPPER FIELDS */}
                  {contactForm.type === 'shipper' && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom: 20 }}>
                      <div>
                        <label className="naql-label">{t.fCargoType}</label>
                        <select className="naql-input" value={contactForm.cargoType} onChange={e => setContactForm({...contactForm, cargoType:e.target.value})}>
                          <option value="">{t.fSelectOne}</option>
                          <option value="Dry">Dry Goods</option>
                          <option value="Refrigerated">Refrigerated</option>
                          <option value="Dangerous">Dangerous Goods</option>
                        </select>
                      </div>
                      <div>
                        <label className="naql-label">{t.fCargoWeight}</label>
                        <input className="naql-input" value={contactForm.cargoWeight} onChange={e => setContactForm({...contactForm, cargoWeight:e.target.value})} placeholder="e.g. 15 tons" />
                      </div>
                      <div>
                        <label className="naql-label">{t.fTypeOfTruck}</label>
                        <select className="naql-input" value={contactForm.typeOfTruck} onChange={e => setContactForm({...contactForm, typeOfTruck:e.target.value})}>
                          <option value="">{t.fSelectOne}</option>
                          <option value="Flatbed">Flatbed Trailer</option>
                          <option value="Curtain">Curtain Trailer</option>
                          <option value="Reefer">Reefer Trailer</option>
                        </select>
                      </div>
                      <div>
                        <label className="naql-label">{t.fNumTrucks}</label>
                        <select className="naql-input" value={contactForm.noOfTrucks} onChange={e => setContactForm({...contactForm, noOfTrucks:e.target.value})}>
                          <option value="">{t.fSelectOne}</option>
                          <option value="1-5">1-5</option>
                          <option value="5-20">5-20</option>
                          <option value="20+">20+</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="naql-label">{t.fRepeatOrder}</label>
                        <div style={{ display:'flex', gap: 24, marginTop: 8 }}>
                          <label style={{ display:'flex', alignItems:'center', gap: 8, cursor:'pointer' }}>
                            <input type="radio" name="repeat" checked={contactForm.repeatOrder === 'Yes'} onChange={() => setContactForm({...contactForm, repeatOrder:'Yes'})} /> {t.fY}
                          </label>
                          <label style={{ display:'flex', alignItems:'center', gap: 8, cursor:'pointer' }}>
                            <input type="radio" name="repeat" checked={contactForm.repeatOrder === 'No'} onChange={() => setContactForm({...contactForm, repeatOrder:'No'})} /> {t.fN}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARRIER FIELDS */}
                  {contactForm.type === 'carrier' && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom: 20 }}>
                      <div>
                        <label className="naql-label">{t.fFleetSize}</label>
                        <select className="naql-input" value={contactForm.fleetSize} onChange={e => setContactForm({...contactForm, fleetSize:e.target.value})}>
                          <option value="">{t.fSelectOne}</option>
                          <option value="1-5">1-5 Trucks</option>
                          <option value="6-20">6-20 Trucks</option>
                          <option value="21+">21+ Trucks</option>
                        </select>
                      </div>
                      <div>
                        <label className="naql-label">{t.fOpRegions}</label>
                        <input className="naql-input" value={contactForm.operationalRegions} onChange={e => setContactForm({...contactForm, operationalRegions:e.target.value})} placeholder="e.g. Jeddah, Madinah" />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="naql-label">{t.fAvailableTrucks}</label>
                        <div style={{ display:'flex', flexWrap:'wrap', gap: 8, marginTop: 8, marginBottom: 16 }}>
                          {['High Sides Trailer', 'Short Sides Trailer', 'Flatbed Trailer', 'Curtain Trailer'].map(tr => (
                            <button
                              key={tr} type="button"
                              onClick={() => {
                                const selected = contactForm.truckTypesAvailable;
                                setContactForm({...contactForm, truckTypesAvailable: selected.includes(tr) ? selected.filter(x => x !== tr) : [...selected, tr]});
                              }}
                              style={{
                                padding: '6px 14px', borderRadius: 20, border: '1px solid', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                                borderColor: contactForm.truckTypesAvailable.includes(tr) ? 'var(--amber)' : 'var(--border)',
                                color: contactForm.truckTypesAvailable.includes(tr) ? (isDark ? 'var(--amber)' : 'white') : 'var(--text-muted)',
                                background: contactForm.truckTypesAvailable.includes(tr) ? (isDark ? 'var(--amber-dim)' : 'var(--amber)') : 'transparent',
                              }}
                            >{tr}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="naql-label">{t.fOtherTrucks}</label>
                        <input className="naql-input" value={contactForm.otherTruckTypes} onChange={e => setContactForm({...contactForm, otherTruckTypes:e.target.value})} placeholder="e.g. Dry Van, Pick-up Truck" />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="naql-label">{t.fRegularContracts}</label>
                        <div style={{ display:'flex', gap: 24, marginTop: 8 }}>
                          <label style={{ display:'flex', alignItems:'center', gap: 8, cursor:'pointer', color: 'var(--text-primary)' }}>
                            <input type="radio" name="contracts" checked={contactForm.regularContracts === 'Yes'} onChange={() => setContactForm({...contactForm, regularContracts:'Yes'})} /> {t.fY}
                          </label>
                          <label style={{ display:'flex', alignItems:'center', gap: 8, cursor:'pointer', color: 'var(--text-primary)' }}>
                            <input type="radio" name="contracts" checked={contactForm.regularContracts === 'No'} onChange={() => setContactForm({...contactForm, regularContracts:'No'})} /> {t.fN}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ width: '100%', height: 1, background: 'var(--border)', margin: '32px 0' }} />

                  {/* GLOBAL BOTTOM */}
                  <div style={{ marginBottom: 20 }}>
                    <label className="naql-label">{t.fSource}</label>
                    <select className="naql-input" value={contactForm.source} onChange={e => setContactForm({...contactForm, source:e.target.value})}>
                      <option value="">{t.fSelectOne}</option>
                      <option value="Google">Google / Search</option>
                      <option value="Social">Social Media</option>
                      <option value="Referral">Referral / Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="naql-label">{t.fDiscuss}</label>
                    <textarea
                      className="naql-textarea"
                      placeholder="Your message here..."
                      value={contactForm.message}
                      onChange={e => setContactForm({...contactForm, message:e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={isSubmitting}
                    style={{ 
                      width:'100%', marginTop:32, height:52, fontSize:16,
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        {isAr ? 'جاري الإرسال...' : 'Sending...'}
                      </>
                    ) : t.fSubmit}
                  </button>
                  <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                  `}</style>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="reveal reveal-delay-2">
              <div className="card-dark" style={{ padding:32, borderRadius:8, marginBottom:20, background:'var(--surface-mid)', border:'1px solid var(--border)' }}>
                <div style={{ borderTop:'2px solid var(--amber)', paddingTop:20, marginBottom:24 }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--text-primary-dark)', marginBottom:4 }}>NAQL — نقل</div>
                  <div style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{t.footerTagline}</div>
                </div>
                {[
                  { icon:ICONS.phone,    label:t.infoPhone },
                  { icon:ICONS.mail,     label:t.infoEmail },
                  { icon:ICONS.location, label:t.infoAddress },
                ].map((info, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                    <div style={{ width:36, height:36, borderRadius:6, background:'var(--amber-dim)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--amber)', flexShrink:0 }}>
                      <Icon d={info.icon} size={18} />
                    </div>
                    <div style={{ color:'var(--text-primary-dark)', fontSize:'0.9rem' }}>{info.label}</div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/966112345678"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  width:'100%', height:52, borderRadius:8, textDecoration:'none',
                  background:'#25D366', color:'white', fontWeight:700, fontSize:15,
                  transition:'opacity 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.opacity='0.9')}
                onMouseOut={e => (e.currentTarget.style.opacity='1')}
              >
                <Icon d={ICONS.whatsapp} size={20} />
                {isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer style={{ background:'var(--navy-mid)', borderTop:'1px solid var(--amber)', padding:'56px 0 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.5fr', gap:48, paddingBottom:48, flexWrap:'wrap' }}>
            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:6, background:'var(--amber)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                    <path d="M2 14L6 6l4 6 4-8 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 4l-4 0 0 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ color:'var(--text-navy)', fontWeight:700, fontSize:'1.2rem', fontFamily: isAr ? 'Tajawal,Cairo,sans-serif' : 'Syne,sans-serif' }}>
                  {isAr ? 'نقل | NAQL' : 'NAQL | نقل'}
                </span>
              </div>
              <p style={{ color:'var(--text-navy)', opacity:0.6, fontSize:'0.875rem', lineHeight:1.8, maxWidth:280 }}>
                {t.footerTagline}
              </p>
              <div style={{ display:'flex', gap:12, marginTop:20 }}>
                {['LinkedIn','X','Instagram'].map(s => (
                  <a key={s} href="#" style={{ width:34, height:34, borderRadius:6, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-navy)', opacity:0.5, fontSize:12, textDecoration:'none', transition:'all 0.2s' }}
                     onMouseOver={e => { e.currentTarget.style.background='rgba(232,131,10,0.15)'; e.currentTarget.style.color='var(--amber)'; e.currentTarget.style.opacity='1'; }}
                     onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='var(--text-navy)'; e.currentTarget.style.opacity='0.5'; }}
                  >{s[0]}</a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div style={{ color:'var(--text-navy)', opacity:0.5, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:20 }}>{t.footerLinks}</div>
              {[['#how-it-works', t.navHow], ['#services', t.navServices], ['#why-naql', t.navWhy], ['#contact', t.navContact], ['/auth/login', t.navLogin]].map(([href, label]) => (
                <a key={href} href={href} style={{ display:'block', color:'var(--text-navy)', opacity:0.65, fontSize:'0.875rem', marginBottom:12, textDecoration:'none', transition:'color 0.15s' }}
                   onMouseOver={e => { e.currentTarget.style.color='var(--amber)'; e.currentTarget.style.opacity='1'; }}
                   onMouseOut={e => { e.currentTarget.style.color='var(--text-navy)'; e.currentTarget.style.opacity='0.65'; }}
                >{label}</a>
              ))}
            </div>

            {/* Services */}
            <div>
              <div style={{ color:'var(--text-navy)', opacity:0.5, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:20 }}>{t.footerServices}</div>
              {(isAr ? ['شاحنة كاملة FTL','حمولة جزئية LTL','شحن مبرّد','شحن ثقيل','مواد خطرة','عبر الخليج'] : ['Full Truck - FTL','Less Than Truck - LTL','Refrigerated','Heavy Hauling','Hazardous','Cross-border GCC']).map(s => (
                <div key={s} style={{ color:'var(--text-navy)', opacity:0.65, fontSize:'0.875rem', marginBottom:12 }}>{s}</div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ color:'var(--text-navy)', opacity:0.5, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:20 }}>{t.footerContact}</div>
              {[
                { icon:ICONS.phone,    label:t.infoPhone },
                { icon:ICONS.mail,     label:t.infoEmail },
                { icon:ICONS.location, label:t.infoAddress },
              ].map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                  <div style={{ color:'var(--amber)', flexShrink:0 }}><Icon d={c.icon} size={16} /></div>
                  <div style={{ color:'var(--text-navy)', opacity:0.65, fontSize:'0.85rem' }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', padding:'20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div style={{ color:'var(--text-navy)', opacity:0.4, fontSize:'0.8rem' }}>{t.footerCopy}</div>
            <div style={{ display:'flex', gap:20, alignItems:'center' }}>
              {[t.footerPrivacy, t.footerTerms].map(l => (
                <a key={l} href="#" style={{ color:'var(--text-navy)', opacity:0.4, fontSize:'0.8rem', textDecoration:'none' }}
                   onMouseOver={e => { e.currentTarget.style.color='var(--amber)'; e.currentTarget.style.opacity='1'; }}
                   onMouseOut={e => { e.currentTarget.style.color='var(--text-navy)'; e.currentTarget.style.opacity='0.4'; }}
                >{l}</a>
              ))}
              <button
                onClick={() => setLang(isAr ? 'en' : 'ar')}
                style={{ padding:'4px 12px', borderRadius:4, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'var(--text-navy)', opacity:0.6, cursor:'pointer', fontSize:12, fontWeight:600, transition:'all 0.15s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='var(--amber)'; e.currentTarget.style.color='var(--amber)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.color='var(--text-navy)'; }}
              >
                {isAr ? '🌐 English' : '🌐 عربي'}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive contact grid fix */}
      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          footer > div > div:first-child > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          footer > div > div:first-child > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes draw-route {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
