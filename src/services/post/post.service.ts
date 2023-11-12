import qs from 'qs';

import type {
  GetAllPostResponse,
  PostEntity,
  PostEntityRaw,
  PostRawResponse
} from './post.model';

import { Service } from '../base.service';
import { redirect } from 'next/dist/server/api-utils';

class PostService extends Service {
  constructor() {
    super();
  }

  public async getBySlug(slug: string): Promise<PostEntity | null> {
    const query = {
      locale: 'en',
      filters: {
        Slug: {
          $eq: slug
        }
      }
    };

    const endpoint = this.endpointFactory(`/api/posts`, query);

    const res = await fetch(endpoint, this.options);

    const response: PostRawResponse = await res.json();

    if (!response?.data?.[0]) {
      return null;
    }

    return PostService.toPost(response.data[0]);
  }

  public async getSeoMetadata(
    slug: string
  ): Promise<{ title?: string; description?: string | null }> {
    const post = await this.getBySlug(slug);

    return {
      title: post?.title ?? 'whoops, post not found',
      description: post?.summary ?? ''
    };
  }

  public async getAll(): Promise<GetAllPostResponse> {
    const query = {
      locale: ['en']
    };

    const endpoint = this.endpointFactory('/api/posts', query);

    const res = await fetch(endpoint, this.options);

    const response: PostRawResponse = await res.json();

    return {
      data: response.data.map(PostService.toPost),
      meta: response.meta
    };
  }

  static toPost(data: PostEntityRaw): PostEntity {
    return {
      id: data.id,
      title: data.attributes.Title,
      content: data.attributes.Content,
      category: data.attributes.Category,
      summary: data.attributes.Summary,
      featured: data.attributes.Featured,
      slug: data.attributes.Slug,

      createdAt: data.attributes.createdAt,
      updatedAt: data.attributes.updatedAt,
      publishedAt: data.attributes.publishedAt,
      locale: data.attributes.locale
    };
  }
}

const postService = new PostService();

export { postService };
