import { headerLogoStyle, headerStyle } from './Header.css';

import { UnderlineLink } from '../UnderlineLink';

const Header: React.FC = () => {
  return (
    <header className={headerStyle}>
      <UnderlineLink href="/">
        <h1 className={headerLogoStyle}>laz·ar</h1>
      </UnderlineLink>
      <UnderlineLink href="/blog">
        <p>blog</p>
      </UnderlineLink>
      <UnderlineLink href="/gallery">
        <p>gallery</p>
      </UnderlineLink>
    </header>
  );
};

export { Header };
