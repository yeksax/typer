import { prisma } from "$lib/prisma";
import { error, json } from "@sveltejs/kit";

export async function POST({ params, locals }) {
  const session = await locals.getSession();

  if (!session) {
    throw error(403, "Not authorized");
  }

  const { username } = params;

  await prisma.user.update({
    where: {
      username,
    },
    data: {
      followers: {
        disconnect: {
          email: session.user?.email as string,
        },
      },
    },
  });

  return json({ ok: true });
}
