import type { Preferences } from "@prisma/client";
import { writable } from "svelte/store";

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
