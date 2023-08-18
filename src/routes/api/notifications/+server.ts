import { prisma } from "$lib/prisma.js";
import type { _Notification } from "$lib/types.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ locals, request }) {
  const session = await locals.getSession();

  if (!session) {
    throw error(403, "Not authorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email as string,
    },
  });

  if (!user) {
    throw error(404, "User not found");
  }

  const searchParams = new URL(request.url).searchParams;
  let page: string | number | null = searchParams.get("page");
  let per_page: string | number | null = searchParams.get("per_page");

  if (!page) {
    page = 1;
  }
  if (!per_page) {
    per_page = 50;
  }

  if (typeof page !== "number") {
    page = parseInt(page);
  }
  if (typeof per_page !== "number") {
    per_page = parseInt(per_page);
  }

  const notifications: _Notification[] = await prisma.notification.findMany({
    where: {
      receiverId: user.id,
    },
    take: per_page + 1,
    skip: (page - 1) * per_page,
    include: {
      notificationActors: {
        select: {
          avatar: true,
          username: true,
          name: true,
          tag: true,
          banner: true,
          biography: true,
          displayName: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      },
    },
  });

  const hasMore = notifications.length === per_page + 1;

  const next = new URL(request.url);
  next.searchParams.set("page", String(page + 1));

  return json({
    ...(hasMore ? { next } : {}),
    data: notifications,
  });
}
