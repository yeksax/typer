import { PUBLIC_PUSHER_APP_KEY } from "$env/static/public";
import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(PUBLIC_PUSHER_APP_KEY!, {
	cluster: "sa1",
});
