import type { Preferences } from "@prisma/client";
import { writable } from "svelte/store";
import type { _Notification } from "./types";

export const creatorState = writable({
  visible: true,
  locked: true,
  error: null as string | null,
  content: {
    body: "",
    attachments: [],
  },
});

export const lastPage = writable("/");
export const navigationHistory = writable<string[]>([]);
export const theme = writable<Preferences["theme"]>("SYSTEM_DEFAULT");

export const newFollows = writable<string[]>([]);
export const newUnfollows = writable<string[]>([]);

export const unreadNotifications = writable<number>(0);
export const notifications = writable<_Notification[]>([]);
