import { prisma } from "$lib/prisma";
import { getPost } from "$lib/server/posts";
import { Time } from "$lib/utils/time";

export const load = async ({ params, locals }) => {
  const { username, typeid } = params;
  const session = await locals.getSession();

  const post = await getPost({ session, id: typeid });
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return {
    path: [
      `<strong>${user?.displayName ?? user?.name}</strong> em ${
        new Time(post!.createdAt).full
      }`,
    ],
    back: `/typer`,
    post,
  };
};
