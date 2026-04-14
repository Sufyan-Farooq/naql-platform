import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'NAQL (نقل) | Saudi Freight Aggregator',
  description: 'One Point of Contact. Bigger Buying Power. Better Rates. — منصة نقل للشحن بالسعودية',
};

// Anti-flash script — runs before React hydrates to apply saved theme/lang
const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('naql_theme') || 'light';
      var l = localStorage.getItem('naql_lang') || 'ar';
      document.documentElement.setAttribute('data-theme', t);
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
