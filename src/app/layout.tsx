import { Montserrat, Sometype_Mono } from 'next/font/google';
import clsx from 'clsx';

import { Footer, Header } from '../components';

import '../styles/global.css';

import type { Metadata } from 'next';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
});

const sometype_mono = Sometype_Mono({
  subsets: ['latin'],
  variable: '--font-sometype_mono'
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'lazar.sh',
  description: 'Personal cave'
};

const RootLayout = ({ children }: RootLayoutProps) => {
  const bodyClass = clsx(
    montserrat.className,
    sometype_mono.variable,
    'min-h-screen',
    'grid',
    'gap-1',
    'grid-cols-12',
    'grid-rows-layout',
    'dark:bg-gray-950',
    'dark:text-zinc-50'
  );

  return (
    <html lang="en" className="dark">
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
        <main className="row-start-2 col-start-2 col-end-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
