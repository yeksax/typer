import { prisma } from "$lib/prisma.js";
import type { _Notification } from "$lib/types.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ locals, request }) {
  const session = await locals.getSession();

  if (!session) {
    throw error(403, "Not authorized");
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

  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email as string,
    },
    include: {
      notifications: {
        take: per_page + 1,
        skip: (page - 1) * per_page,
        orderBy: {
          updatedAt: "desc",
        },
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
      },
    },
  });

  if (!user) {
    throw error(404, "User not found");
  }

  const notifications = user.notifications as _Notification[];

  await prisma.notification.updateMany({
    where: {
      receiverId: user.id,
      isRead: false,
    },
    data: {
      isRead: true,
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
