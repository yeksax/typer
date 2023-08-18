import { prisma } from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();

  const user = await prisma.user.findFirst({
    where: {
      email: String(session?.user?.email),
    },
    include: {
      preferences: true,
      followers: {
        select: {
          username: true,
        },
      },
      following: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          notifications: {
            where: {
              isRead: false,
            },
          },
        },
      },
    },
  });

  const preferences = user?.preferences;

  return {
    session,
    user,
    preferences,
    theme: preferences?.theme || "SYSTEM_DEFAULT",
  };
};
