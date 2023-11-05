'use client';

import { use, useEffect, useState } from 'react';
import { Post } from '../post';

import type { GetAllPostResponse } from '../../services';

interface PostFeedProps {
  postsPromise: Promise<GetAllPostResponse>;
}

const PostFeed: React.FC<PostFeedProps> = ({ postsPromise }) => {
  const response = use(postsPromise);

  const [posts, setPosts] = useState<GetAllPostResponse | null>(null);

  useEffect(() => {
    setPosts(response);
  }, [response]);

  return posts && posts?.data.map(post => <Post {...post} key={post.id} />);
};

export { PostFeed };
