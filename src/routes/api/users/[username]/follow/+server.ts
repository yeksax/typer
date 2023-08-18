import { prisma } from "$lib/prisma";
import { Notifier } from "$lib/server/notifications.js";
import { error, json } from "@sveltejs/kit";

export async function POST({ params, locals }) {
  const session = await locals.getSession();

  if (!session) {
    throw error(403, "Not authorized");
  }

  const { username } = params;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email as string,
    },
  })

  if (!user) {
    throw error(404, "User not found");
  }

  const target = await prisma.user.update({
    where: {
      username,
    },
    data: {
      followers: {
        connect: {
          email: session.user?.email as string,
        },
      },
    },
    select: {
      id: true,
    },
  });

  const notifier = new Notifier(locals.pusher, { id: target.id });

  const day = new Date().getDay();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const date = `${year}-${month}-${day}`;

  notifier.handle({
    action: "FOLLOW",
    actors: [{ id: user.id as string }],
    redirect: `${user.username}`,
    reference: `${target.id}__${date}__follows`,
    title: `te $_0`,
  });

  return json({ ok: true });
}
