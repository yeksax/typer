import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";
import PusherServer from "pusher";

import {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  PUSHER_APP_ID,
  PUSHER_APP_SECRET,
} from "$env/static/private";
import { adapter } from "$lib/prisma";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { PUBLIC_PUSHER_APP_KEY } from "$env/static/public";

const PROTECTED_ROUTES = [
  "/dashboard/**",
  "/profile",
  "/notifications",
  "/settings/**",
];

function regexCreator(route: string) {
  let regexString = route;
  if (!route.includes("**")) {
    return new RegExp(regexString + "$");
  }

  regexString = regexString.replaceAll("/**", ".*");
  return new RegExp("^" + regexString);
}

async function authorization({ event, resolve }: any) {
  const session = await event.locals.getSession();
  let isRouteProtected = false;
  const url = new URL(event.request.url);

  for (let i = 0; i < PROTECTED_ROUTES.length; i++) {
    const regex = regexCreator(PROTECTED_ROUTES[i]);
    isRouteProtected = regex.test(url.pathname);
    if (isRouteProtected) {
      break;
    }
  }

  if (!session && isRouteProtected) {
    throw redirect(303, "/signin?next=" + url.pathname);
  }

  return resolve(event);
}

const pusherServer = new PusherServer({
	appId: PUSHER_APP_ID,
	key: PUBLIC_PUSHER_APP_KEY,
	secret: PUSHER_APP_SECRET,
	cluster: "sa1",
});

export const handle: Handle = sequence(
  SvelteKitAuth({
    adapter: adapter,
    providers: [
      GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
      Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
    ],
  }),
  authorization,
  async ({ event, resolve }) => {
    event.locals.pusher = pusherServer

    return await resolve(event)
  }
);
