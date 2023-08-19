import { prisma } from "$lib/prisma.js";
import { error, json } from "@sveltejs/kit";

export async function POST({ locals }) {
  
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

  await prisma.notification.updateMany({
    where: {
      receiverId: user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return json({ ok: true });
}
