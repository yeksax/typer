import { prisma } from "$lib/prisma";
import type { Preferences } from "@prisma/client";
import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";

export async function POST({ request, locals }: RequestEvent) {
  const session = await locals.getSession();

  if (!session) {
    throw error(403, "Not authorized");
  }

  const data = (await request.json()) as Record<keyof Preferences, any>;

  if (!data) {
    throw error(400, "Invalid request");
  } else {
    await prisma.user.update({
      where: {
        email: session.user!.email as string,
      },
      data: {
        preferences: {
          update: {
            data,
          },
        },
      },
    });
  }

  return json({ ok: true });
}
