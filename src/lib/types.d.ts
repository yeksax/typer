import type { File, Notification, Post } from "@prisma/client";

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
  content: string;
  createdAt: Date;
  author: MinifiedUser;

  _count: {
    like: number;
  }
}

interface _Notification extends Notification {
  notificationActors: MinifiedUser[]
}

interface _Post extends Post {
  replies:
    | {
        author: {
          avatar: string;
        };
      }[]
    | _Post[];
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
