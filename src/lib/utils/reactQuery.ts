import { createInfiniteQuery } from "@tanstack/svelte-query";
import axios from "axios";

export function infiniteQuery<T>({
  queryKeys,
  queryURL,
  limit,
  options,
}: {
  queryKeys: string[];
  queryURL: string;
  limit?: number;
  options?: {
    params?: Record<string, string>;
    customFN?: ({
      pageParam,
    }: {
      pageParam?: number | undefined;
    }) => Promise<{ next?: string; data: T[] }>;
  };
}) {
  const query = async ({
    pageParam = 1,
  }): Promise<{ next?: string; data: T[] }> => {
    const params = new URLSearchParams();

    params.append("page", String(pageParam));
    params.append("per_page", String(limit || 10));
    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        params.append(key, value);
      }
    }

    return (
      await axios.get(`${queryURL}`, {
        params,
      })
    ).data;
  };

  return createInfiniteQuery({
    queryKey: queryKeys,
    queryFn: options?.customFN || query,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.next) {
        const nextUrl = new URLSearchParams(new URL(lastPage.next).search);
        const nextCursor = nextUrl.get("page");
        if (nextCursor) {
          return +nextCursor;
        }
      }
      return undefined;
    },
  });
}
