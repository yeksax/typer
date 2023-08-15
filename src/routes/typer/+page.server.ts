import type { Actions, Load } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

const newPostSchema = z.object({
  content: z.string(),
  attachments: z.array(z.instanceof(File)),
});

export const load: Load = async () => {
  const form = await superValidate(newPostSchema);

  return {
    form,
    metadata: {
      title: {
        absolute: "Typer",
      },
    },
  };
};

export const actions: Actions = {};
