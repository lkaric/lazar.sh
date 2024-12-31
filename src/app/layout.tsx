import { type Metadata } from 'next';
import { Montserrat, Sometype_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { body, theme } from '@/style';
import clsx from 'clsx';

import '@/style/reset.css';
import { Header } from '@/components';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const sometype_mono = Sometype_Mono({
  subsets: ['latin'],
  variable: '--font-sometype_mono',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'lazar.sh',
  description: 'Personal cave',
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const bodyClass = clsx(montserrat.className, sometype_mono.variable, body);

  return (
    <html lang="en" className={theme}>
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className={bodyClass}>
        <Header />
        {children}
      </body>
      <SpeedInsights />
      <Analytics />
    </html>
  );
}
