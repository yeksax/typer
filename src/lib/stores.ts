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
