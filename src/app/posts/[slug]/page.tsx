import { useRemarkSync } from 'react-remark';

import rehypeHighlight from 'rehype-highlight';

import { postService } from '../../../services';

import type { Metadata } from 'next';

interface PostProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params
}: PostProps): Promise<Metadata> {
  const { title, description } = await postService.getSeoMetadata(params.slug);

  return {
    title: `${title} | lazar.sh`,
    description
  };
}

export default async function Post({ params: { slug } }: PostProps) {
  const data = await postService.getBySlug(slug);

  // TODO: Handle missed slugs gracefully.
  const reactContent = useRemarkSync(data?.content ?? '', {
    rehypePlugins: [rehypeHighlight as any],
    remarkToRehypeOptions: {
      allowDangerousHtml: true
    }
  });

  if (!data) {
    return <h2>Not found</h2>;
  }

  return (
    <div className="grid lg:grid-cols-6">
      <div className="col-start-2 col-end-6">
        <div className="my-6">
          <h1 className="text-3xl font-semibold">{data.title}</h1>
        </div>
        {reactContent}
      </div>
    </div>
  );
}
