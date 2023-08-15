import { prisma } from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.getSession();

  const user = await prisma.user.findFirst({
    where: {
      email: String(session?.user?.email),
    },
    include: {
      _count: {
        select: {
          notifications: true,
        },
      },
    },
  });

  const preferences = await prisma.preferences.findFirst({
    where: {
      userId: String(user?.id),
    },
  });

  return {
    session,
    user,
    preferences,
    theme: preferences?.theme || "SYSTEM_DEFAULT",
  };
};
