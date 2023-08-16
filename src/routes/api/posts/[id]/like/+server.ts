import { prisma } from "$lib/prisma";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({ params, locals }: RequestEvent) {
  const session = await locals.getSession();

  if(!session) {
    throw error(403, "Not authorized");
  }

  const { id } = params;

  await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: {
      likedBy: {
        connect: {
          email: session.user?.email as string
        }
      },
    },
  })
  
  return json({ ok: true });
}
