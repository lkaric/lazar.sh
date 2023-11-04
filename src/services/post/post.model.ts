import { BaseRawResponse } from '../common.model';

interface PostEntityRaw {
  id: number;
  attributes: {
    Title: string;
    Content: string;
    Category: string | null;
    Summary: string | null;
    Featured: boolean;
    Slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    locale: string;
  };
}

type PostRawResponse = BaseRawResponse<PostEntityRaw>;

interface PostEntity {
  id: number;
  title: string;
  content: string;
  category: string | null;
  summary: string | null;
  featured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
}

type GetAllPostResponse = BaseRawResponse<PostEntity>;

export type { PostEntityRaw, PostRawResponse, PostEntity, GetAllPostResponse };
