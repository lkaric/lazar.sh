import { Post } from '..';

import { postService } from '../../services';

const PostFeed: React.FC = async () => {
  const blogs = await postService.getAll();

  return blogs && blogs.data.map(post => <Post {...post} key={post.id} />);
};

export { PostFeed };
