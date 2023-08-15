import type { AuthError, Session } from "@supabase/supabase-js";
import { writable } from "svelte/store";

interface CreatorState {
  visible: boolean;
  locked: boolean;
  content: {
    body: string;
    attachments: File[];
  };
}

export const creatorState = writable({
  visible: true,
  locked: true,
  content: {
    body: "",
    attachments: [],
  },
});

export const creatorForm = writable({});