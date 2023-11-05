import { Suspense } from 'react';
import { Search, PostFeed } from '../components';

import { postService } from '../services';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  const postsPromise = postService.getAll();

  return (
    <>
      <div className="grid lg:grid-cols-6">
        <Search />
        <Suspense fallback={<p>Loading PostFeed</p>}>
          <PostFeed postsPromise={postsPromise} />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
