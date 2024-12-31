'use client';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

import {
  underlineLinkPathStyle,
  underlineLinkStyle,
} from './UnderlineLink.css';

interface UnderlineLinkProps extends LinkProps {
  children: React.ReactNode;
}

const UnderlineLink: React.FC<UnderlineLinkProps> = ({ children, ...rest }) => {
  const pathname = usePathname();

  return (
    <Link {...rest} className={underlineLinkStyle}>
      {pathname === rest.href && (
        <svg
          width="69"
          height="5"
          viewBox="0 0 69 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={underlineLinkPathStyle}
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            d="M1 3.50001C4.83333 2.33334 14 0.300005 20 1.50001C27.5 3.00001 29.5 2 32.5 2C61.0701 2.00001 56 3.83333 68 4.5"
            stroke="#FFCC00"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </Link>
  );
};

export { UnderlineLink };
