import dayjs from 'dayjs';
import Link from 'next/link';

import type { PostEntity } from '../../services';

type PostProps = PostEntity;

const Post: React.FC<PostProps> = ({
  slug,
  title,
  summary,
  updatedAt,
  publishedAt
}) => {
  const isPreview = process.env.APPLICATION_PREVIEW;

  return (
    <Link
      href={`/post/${slug}`}
      className="col-start-2 col-end-6 group/post p-2"
    >
      <div className="flex items-center">
        <h6 className="group-hover/post:text-orange-600 transition-colors">
          {title}
        </h6>
        <span className="flex-grow" />
        <p className="text-xs text-zinc-400">/{slug}</p>
      </div>
      <p className="text-xs text-zinc-400 my-1 line-clamp-2 h-8">{summary}</p>
      <div className="text-xs">
        {publishedAt && (
          <span className="group-hover/post:text-zinc-400 transition-colors">
            {dayjs(publishedAt).format('MMMM DD, YY')}
          </span>
        )}
        {isPreview && (
          <div>
            <span className="pr-2 group-hover/post:text-zinc-400 transition-colors">
              {dayjs(updatedAt).format('MMMM DD, YY')}
            </span>
            <span className="text-red-400">preview</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export { Post };
