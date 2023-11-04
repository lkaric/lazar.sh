import type {
  GetAllPostResponse,
  PostEntity,
  PostEntityRaw,
  PostRawResponse
} from './post.model';

class PostService {
  public async getAll(): Promise<GetAllPostResponse> {
    const options: RequestInit = {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
      }
    };

    const isPreview = process.env.APPLICATION_PREVIEW;

    const uri = `${process.env.STRAPI_BASE_URI}/api/posts${
      isPreview ? '?publicationState=preview' : ''
    }`;

    const res = await fetch(uri, options);

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
