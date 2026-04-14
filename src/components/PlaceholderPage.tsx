'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';

interface Props {
  titleAr: string;
  titleEn: string;
}

export default function PlaceholderPage({ titleAr, titleEn }: Props) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';

  const title = isAr ? titleAr : titleEn;
  const subtitle = isAr 
    ? 'هذه الصفحة ستكون متاحة قريباً. الشاشة غير مشمولة في النموذج الأولي الحالي بناءً على الأولويات.'
    : 'This page will be available soon. It is currently not included in the priority prototype.';

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-navy mb-2" style={{ fontFamily: isAr ? 'Tajawal, Cairo, sans-serif' : 'DM Sans, sans-serif' }}>
        {title}
      </h1>
      <p className="text-text-muted max-w-md">{subtitle}</p>
    </div>
  );
}
