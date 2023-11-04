import clsx from 'clsx';
import Link from 'next/link';

import { Montserrat, Sometype_Mono } from 'next/font/google';
import { RiGithubLine, RiLinkedinLine } from 'react-icons/ri';

import type { Metadata } from 'next';

import '../styles/global.css';
import { Magnetize } from '../components';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
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
      <body className={bodyClass}>
        <header className="row-start-1 col-start-2 col-end-12 flex gap-2 items-center">
          <div>
            <Link href="/">
              <span className="font-mono font-bold text-2xl">l</span>
            </Link>
          </div>
          <div className="flex flex-grow" />
          <div className="flex gap-2">
            <Magnetize>
              <a
                href="https://linkedin.com/in/lkaric/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition-colors"
              >
                <RiLinkedinLine />
              </a>
            </Magnetize>
            <Magnetize>
              <a
                href="https://github.com/lkaric/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition-colors"
              >
                <RiGithubLine />
              </a>
            </Magnetize>
          </div>
        </header>
        <main className="row-start-2 col-start-2 col-end-12">{children}</main>
        <footer className="row-start-3 col-start-2 col-end-12">
          <Link href="/contact">contact</Link>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
