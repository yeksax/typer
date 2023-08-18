import { prisma } from "$lib/prisma";
import { Notifier } from "$lib/server/notifications";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({ params, locals }: RequestEvent) {
  const session = await locals.getSession();

  if (!session) {
    throw error(403, "Not authorized");
  }

  const { id } = params;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email as string,
    },
  });

  if (!user) {
    throw error(404, "User not found");
  }

  const post = await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    include: {
      author: true,
    },
    data: {
      likes: {
        connect: {
          email: session.user?.email as string,
        },
      },
    },
  });

  const notifier = new Notifier(locals.pusher, { id: post.author.id });

  notifier.handle({
    action: "LIKE",
    actors: [{ id: user.id as string }],
    redirect: `${post.author.username}/posts/${post.id}`,
    reference: `${post.author.id}__${post.id}__like`,
    text: post.content,
    title: `$_0 seu post`,
  });

  return json({ ok: true });
}
