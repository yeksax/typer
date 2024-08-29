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
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    title: `${user?.displayName ?? user?.name} em ${new Time(post!.createdAt).default}`,
    back: '/typer',
    post,
  };
};
