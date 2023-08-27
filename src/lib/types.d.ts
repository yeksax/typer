import type { Attachment, File, Notification, Post } from "@prisma/client";

interface MinifiedUser {
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
}

interface MinifiedPost {
  id: number;
  content: string;
  createdAt: Date;
  author: MinifiedUser;
  attachments: Attachment[];

  _count: {
    likes: number;
    replies: number;
    reposts: number;
  };
}

interface _Notification extends Notification {
  notificationActors: MinifiedUser[];
}

interface FullPost extends Post {
  replies:
    | {
        author: {
          avatar: string;
        };
      }[]
    | FullPost[];
  thread?: (Post & {
    attachments: File[];
    _count: {
      replies: number;
      likes: number;
      reposts: number;
    };
  })[];
  repost:
    | (Post & {
        attachments: File[];
        author: MinifiedUser;
      })
    | null;
  author: MinifiedUser;
  attachments: File[];
  likes: {
    id: string;
  }[];
  _count: {
    replies: number;
    likes: number;
    reposts: number;
  };
}

interface SelectOption {
  label: string;
  value: string;
}