import { EmailShuffle } from '@/components';

import { homeMainStyle } from './style.css';

const HomePage = () => {
  return (
    <main className={homeMainStyle}>
      <EmailShuffle />
    </main>
  );
};

export default HomePage;
