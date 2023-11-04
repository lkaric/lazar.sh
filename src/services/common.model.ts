interface BaseRawResponse<T> {
  data: Array<T>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: 1;
      total: 1;
    };
  };
}

export type { BaseRawResponse };
