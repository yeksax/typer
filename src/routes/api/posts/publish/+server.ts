import { SUPABASE_SERVICE_ROLE, SUPABASE_URL } from "$env/static/private";
import { prisma } from "$lib/prisma";
import { Notifier } from "$lib/server/notifications.js";
import type { FullPost } from "$lib/types";
import type { Attachment, Post, User } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { error, json } from "@sveltejs/kit";
import { array, instance, object, safeParse, string } from "valibot"; // 0.76 kB

const PostSchema = object({
  content: string(),
  attachments: array(instance(File)),
});

export async function POST({ request, locals }) {
  const session = await locals.getSession();
  const pusher = locals.pusher;

  if (!session) {
    error(403, "Not authorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user!.email as string,
    },
    include: {
      preferences: true,
    },
  });

  if (!user) {
    error(404, "User not found");
  }

  const searchParams = new URL(request.url).searchParams;
  const replying_to: string | null = searchParams.get("replying_to");
  const quote_to: string | null = searchParams.get("quote_to");

  let replyingTo: (Post & { author: User; thread: { id: number }[] }) | null =
    null;

  if (replying_to) {
    replyingTo = await prisma.post.findFirst({
      where: {
        id: parseInt(replying_to),
      },
      include: {
        author: true,
        thread: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  if (quote_to) {
    replyingTo = await prisma.post.findFirst({
      where: {
        id: parseInt(quote_to),
      },
      include: {
        author: true,
        thread: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  await pusher.trigger(user.id, "publish-progress", 10);

  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

  formData.forEach((value, key) => {
    if (data[key]) {
      const previous = data[key];
      if (previous instanceof Array) {
        data[key] = [...previous, value];
      } else {
        data[key] = [previous, value];
      }
    } else {
      if (value instanceof File) {
        data[key] = [value];
      } else {
        data[key] = value;
      }
    }
  });
  data.attachments = (data.attachments as File[]).filter(
    (file) => file.size > 0
  );

  await pusher.trigger(user.id, "publish-progress", 30);

  const parsed = safeParse(PostSchema, data);
  if (!parsed.success) {
    await pusher.trigger(user.id, "publish-progress", 0);
    error(400, "Invalid data");
  }

  if (
    parsed.data.content.length === 0 &&
    parsed.data.attachments?.length === 0
  ) {
    await pusher.trigger(user.id, "publish-progress", 0);
    error(400, "Você precisa dizer algo eu acho...");
  }

  await pusher.trigger(user.id, "publish-progress", 40);

  const post: FullPost = await prisma.post.create({
    data: {
      thread:
        replying_to && replyingTo
          ? {
              connect: [
                ...replyingTo.thread.map((post) => ({ id: post.id })),
                { id: replyingTo.id },
              ],
            }
          : {},
      content: parsed.data.content,
      replied:
        replying_to && replyingTo
          ? {
              connect: {
                id: replyingTo.id,
              },
            }
          : {},
      repost:
        quote_to && replyingTo
          ? {
              connect: {
                id: replyingTo.id,
              },
            }
          : {},
      author: {
        connect: {
          email: session.user?.email as string,
        },
      },
    },
    include: {
      thread: {
        include: {
          attachments: true,
          _count: {
            select: {
              replies: true,
              likes: true,
              reposts: true,
            },
          },
        },
      },
      replies: {
        take: 3,
        select: {
          author: {
            select: {
              avatar: true,
            },
          },
        },
      },
      repost: {
        include: {
          attachments: true,
          author: {
            select: {
              displayName: true,
              avatar: true,
              name: true,
              tag: true,
              banner: true,
              username: true,
              biography: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                },
              },
            },
          },
        },
      },
      likes: true,
      author: {
        select: {
          displayName: true,
          avatar: true,
          name: true,
          tag: true,
          banner: true,
          username: true,
          biography: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      },
      attachments: true,
      _count: {
        select: {
          replies: true,
          likes: true,
          reposts: true,
        },
      },
    },
  });

  await pusher.trigger(user.id, "publish-progress", 50);

  const attachmentsCount = data.attachments.length;
  const attachments: Attachment[] = [];

  if (attachmentsCount > 0) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: {
        persistSession: false,
      },
    });

    for (let i = 0; i < attachmentsCount; i++) {
      const file = (data.attachments as File[])[i];
      const ext = file.name.split(".").pop();

      const { data: result } = await supabase.storage
        .from("typers")
        .upload(`${post.id}/${crypto.randomUUID()}.${ext}`, file, {
          cacheControl: (60 * 60 * 24 * 7).toString(),
          upsert: false,
        });

      if (result) {
        const url = supabase.storage.from("typers").getPublicUrl(result.path)
          .data.publicUrl;

        attachments.push(
          await prisma.attachment.create({
            data: {
              name: file.name,
              size: file.size,
              postId: post.id,
              type: file.type,
              url,
            },
          })
        );
      }

      await pusher.trigger(
        user.id,
        "publish-progress",
        60 + ((i + 1) / attachmentsCount) * 30
      );
    }
  }

  await pusher.trigger(user.id, "publish-progress", 80);

  post.attachments = attachments;

  if (replying_to && replyingTo) {
    await pusher.trigger(`post__${replyingTo.id}`, "new-reply", post);
  } else {
    await pusher.trigger(`typer`, "new-post", post);
  }

  if (replyingTo) {
    const notifier = new Notifier(locals.pusher, { id: replyingTo.authorId });
    notifier.handle({
      text: post.content,
      action: quote_to ? "QUOTE" : "REPLY",
      title: `$_0 seu post`,
      actors: [{ id: user.id as string }],
      redirect: `${post.author.username}/posts/${post.id}`,
      reference: `${post.repliedId}__reply__${post.id}`,
    });
  }

  await pusher.trigger(user.id, "publish-progress", 100);
  await pusher.trigger(user.id, "publish-progress", 0);

  return json({ ok: true });
}
