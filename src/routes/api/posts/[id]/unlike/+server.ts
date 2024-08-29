import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { prisma } from "$lib/prisma";
import { Notifier } from "$lib/server/notifications";

export async function POST({ params, locals }: RequestEvent) {
  const session = await locals.getSession();

  if (!session) {
    error(403, "Not authorized");
  }

  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email as string,
    },
  });

  if (!user) {
    error(404, "User not found");
  }

  const post = await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: {
      likes: {
        disconnect: {
          email: session.user?.email as string,
        },
      },
    },
    include: {
      author: true,
    },
  });

  const notifier = new Notifier(locals.pusher, { id: post.author.id });

  notifier.removeParticipation(`${post.author.id}__${post.id}__like`, [
    { id: user.id as string },
  ]);

  return json({ ok: true });
}
