import { SUPABASE_SERVICE_ROLE, SUPABASE_URL } from "$env/static/private";
import { prisma } from "$lib/prisma";
import type { _Post } from "$lib/types";
import type { Attachment } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { error, json } from "@sveltejs/kit";
import { array, instance, object, optional, safeParse, string } from "valibot"; // 0.76 kB
import type { RequestEvent } from "../$types";

const PostSchema = object({
  content: string(),
  attachments: array(instance(File)),
});

export async function POST({ request, locals }: RequestEvent) {
  const session = await locals.getSession();
  const pusher = locals.pusher;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
      persistSession: false,
    },
  });

  if (!session) {
    throw error(403, "Not authorized");
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
    throw error(403, "Not authorized");
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
    throw error(400, "Invalid data");
  }

  if (
    parsed.data.content.length === 0 &&
    parsed.data.attachments?.length === 0
  ) {
    await pusher.trigger(user.id, "publish-progress", 0);
    throw error(400, "Você precisa dizer algo eu acho...");
  }

  await pusher.trigger(user.id, "publish-progress", 40);

  const post: _Post = await prisma.post.create({
    data: {
      content: parsed.data.content,
      author: {
        connect: {
          email: session.user?.email as string,
        },
      },
    },
    include: {
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
        },
      },
      likedBy: true,
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
          likedBy: true,
          reposts: true,
        },
      },
    },
  });

  await pusher.trigger(user.id, "publish-progress", 50);

  const attachmentsCount = data.attachments.length;
  const attachments: Attachment[] = [];

  if (attachmentsCount > 0) {
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
  await pusher.trigger("typer", "new-post", post);

  await pusher.trigger(user.id, "publish-progress", 100);
  await pusher.trigger(user.id, "publish-progress", 0);

  return json({ ok: true });
}
