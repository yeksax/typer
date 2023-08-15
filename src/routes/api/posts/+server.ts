import { getPosts } from "$lib/server/posts";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function GET({ request, locals }: RequestEvent) {
  const session = await locals.getSession();

  const searchParams = new URL(request.url).searchParams;
  let page: string | number | null = searchParams.get("page");
  let per_page: string | number | null = searchParams.get("per_page");

  if (!page) {
    page = 1;
  }

  if (!per_page) {
    per_page = 10;
  }

  if (typeof page !== "number") {
    page = parseInt(page);
  }

  if (typeof per_page !== "number") {
    per_page = parseInt(per_page);
  }

  const data = await getPosts({
    session,
    page: page,
    per_page: per_page,
  });

  const next = new URL(request.url);
  next.searchParams.set("page", String(data.next));

  return json({
    ...(data.next ? { next } : {}),
    data: data.data,
  });
}
