import { createInfiniteQuery } from "@tanstack/svelte-query";

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
    customFN: ({
      pageParam,
    }: {
      pageParam?: number | undefined;
    }) => Promise<{ next?: string; data: T[] }>;
  };
}) {
  const query = async ({
    pageParam = 1,
  }): Promise<{ next?: string; data: T[] }> =>
    await fetch(`${queryURL}?page=${pageParam}&per_page=${limit || 10}`).then(
      (r) => r.json()
    );

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
