import { prisma } from "$lib/prisma";
import type { FullPost } from "$lib/types";
import type { Session } from "@auth/core/types";
import type { Post } from "@prisma/client";

interface PostFecthOptions {
  session: Session | null;
}

interface PostFetchSingleOptions extends PostFecthOptions {
  id: string;
}

interface PostFetchManyOptions extends PostFecthOptions {
  page: number;
  per_page: number;
  options?: {
    replyingTo?: Post["id"] | null;
  };
}

export async function getPost({
  session,
  id,
}: PostFetchSingleOptions): Promise<FullPost | null> {
  return await prisma.post.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      thread: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
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
          likes: {
            select: {
              id: true,
            },
            where: session
              ? {
                  email: session.user?.email as string,
                }
              : {
                  id: "",
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
      likes: {
        select: {
          id: true,
        },
        where: session
          ? {
              email: session.user?.email as string,
            }
          : {
              id: "",
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
      _count: {
        select: {
          replies: true,
          likes: true,
          reposts: true,
        },
      },
    },
  });
}

export async function getPosts({
  session,
  page,
  per_page,
  options,
}: PostFetchManyOptions) {
  const posts = (await prisma.post.findMany({
    take: per_page + 1,
    skip: (page - 1) * per_page,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      deleted: false,
      repliedId: options?.replyingTo || null,
    },
    include: {
      thread: {
        include: {
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
      },
      repost: {
        include: {
          author: true,
          attachments: true,
        },
      },
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
      likes: {
        select: {
          id: true,
        },
        where: session
          ? {
              email: session.user?.email as string,
            }
          : {
              id: "",
            },
      },
      attachments: true,
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
      _count: {
        select: {
          replies: true,
          likes: true,
          reposts: true,
        },
      },
    },
  })) satisfies FullPost[];

  return {
    next: posts.length === per_page + 1 ? page + 1 : null,
    data: posts.slice(0, per_page),
  };
}
