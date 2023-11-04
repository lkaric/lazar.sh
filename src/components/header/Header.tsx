import Link from 'next/link';

import { RiGithubLine, RiLinkedinLine } from 'react-icons/ri';
import { MdOutlineAlternateEmail } from 'react-icons/md';

import { Magnetize } from '../magnetize';

const Header: React.FC = () => {
  return (
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
            className="hover:text-orange-600 transition-colors p-2"
            aria-label="Linkedin"
          >
            <RiLinkedinLine />
          </a>
        </Magnetize>
        <Magnetize>
          <a
            href="https://github.com/lkaric/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-600 transition-colors p-2"
            aria-label="Github"
          >
            <RiGithubLine />
          </a>
        </Magnetize>
        <Magnetize>
          <Link
            href="/contact"
            className="hover:text-orange-600 transition-colors p-2"
            aria-label="Contact"
          >
            <MdOutlineAlternateEmail />
          </Link>
        </Magnetize>
      </div>
    </header>
  );
};

export { Header };
