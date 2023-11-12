import qs from 'qs';

abstract class Service {
  readonly basePath: RequestInfo = '';
  readonly options: RequestInit = {};
  readonly isPreview: boolean = false;

  constructor() {
    this.basePath = process.env.STRAPI_BASE_URI ?? '';
    this.options = {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
      }
    };

    if (process.env.APPLICATION_PREVIEW) {
      this.isPreview = true;
    }
  }

  public endpointFactory(path: string, query?: Record<string, any>) {
    let endpoint = `${this.basePath}${path}`;

    const parsedQuery = qs.stringify(query, { encode: false });

    if (query) {
      endpoint = `${endpoint}?${parsedQuery}`;
    }

    const operator = endpoint.includes('?') ? '&' : '?';

    if (this.isPreview) {
      endpoint = `${endpoint}${operator}publicationState=preview`;
    }

    return endpoint;
  }
}

export { Service };
