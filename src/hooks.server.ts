import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";

import {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
} from "$env/static/private";
import { adapter } from "$lib/prisma";

export const handle = SvelteKitAuth({
	adapter: adapter,
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
	],
});
