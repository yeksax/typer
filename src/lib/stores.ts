import type { Preferences } from "@prisma/client";
import { writable } from "svelte/store";
import type { MinifiedPost, _Notification } from "./types";

interface PathOption {
  floatingOnly?: boolean;
  hidden?: boolean;
}

export const creator = writable({
  pathOptions: {
    "/typer": {},
    "/(titleheader)/[username]/type/[typeid]": {
      floatingOnly: true,
    },
  } as Record<string, PathOption>,
  visible: true,
  locked: true,
  error: null as string | null,
  inResponseTo: null as number | null,
  replyingTo: null as MinifiedPost | null,
  quotingTo: null as MinifiedPost | null,
  content: {
    body: "",
    attachments: null as null | FileList,
    maxImages: 4,
    maxFiles: 2,
    maxVideos: 1,
  },
});

export const lastPage = writable("/");
export const navigationHistory = writable<string[]>([]);
export const theme = writable<Preferences["theme"]>("SYSTEM_DEFAULT");

export const newFollows = writable<string[]>([]);
export const newUnfollows = writable<string[]>([]);

export const newLikes = writable<number[]>([]);
export const newUnlikes = writable<number[]>([]);

export const newReplies = writable<{ [key: number]: number }>({});
export const newQuotes = writable<{ [key: number]: number }>({});

export const unreadNotifications = writable<number>(0);
export const notifications = writable<_Notification[]>([]);

export const scrollPosition = writable<Record<string, number>>({});

export const navigationStatus = writable<"default" | "minified">("default");

