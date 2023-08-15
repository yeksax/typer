import type { File, Post } from "@prisma/client";

interface _Post extends Post {
  replies: {
    author: {
      avatar: string;
    };
  }[];
  thread?: (Post & {
    attachments: File[];
    _count: {
      replies: number;
      likedBy: number;
    };
  })[];
  repost:
    | (Post & {
        attachments: File[];
      })
    | null;
  author: {
    _count: {
      following: number;
      followers: number;
    };
    displayName: string | null;
    username: string;
    avatar: string;
    banner: string;
    biography: string;
    name: string;
    tag: string;
  };
  attachments: File[];
  likedBy: {
    id: string;
  }[];
  _count: {
    replies: number;
    likedBy: number;
    reposts: number;
  };
}
