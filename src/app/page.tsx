import { Suspense } from 'react';
import { PostFeed, Search } from '../components';

import { postService } from '../services';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <div className="grid lg:grid-cols-6">
        <Search />
        <Suspense fallback={<p>Loading PostFeed</p>}>
          <PostFeed />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
