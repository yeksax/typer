<script lang="ts">
  import type { _Notification } from "$lib/types";
  import {
    HeartIcon,
    UserPlusIcon,
    MessageSquareIcon,
    HelpCircleIcon,
  } from "svelte-feather-icons";
  import InformationCard from "../user/information-card.svelte";
  import { paramReplacing } from "$lib/utils/string";

  export let notification: _Notification;

  const actors = notification.notificationActors;

  let actorsString = "";
  let enumAction = notification.action;
  let actionIcon: typeof HelpCircleIcon;

  let singleAction = "";
  let pluralAction = "";

  if (enumAction === "FOLLOW") {
    actionIcon = UserPlusIcon;
    singleAction = "seguiu";
    pluralAction = "seguiram";
  }

  if (enumAction === "LIKE") {
    actionIcon = HeartIcon;
    singleAction = "curtiu";
    pluralAction = "curtiram";
  }

  if (enumAction === "REPLY") {
    actionIcon = MessageSquareIcon;
    singleAction = "respondeu";
    pluralAction = "responderam";
  }

  if (actors) {
    if (actors.length > 1) actorsString = `e outros ${pluralAction} `;
    else actorsString = `${singleAction} `;
  }
</script>

<a
  href={notification.redirect}
  class="flex flex-col gap-1 text-sm px-6 py-2 border-black dark:border-zinc-950 rounded-md border-2">
  <div class="h-7 mb-2">
    {#each actors as actor, i (actor.username)}
      <InformationCard user={actor}>
        <img
          src={actor.avatar}
          alt="foto de {actor.name}"
          class="slide-left rounded-md w-7 aspect-square absolute transition-all x-0"
          style="--x: {(actors.length - i - 1) * 1}rem; --i: {(actors.length -
            i -
            1) *
            100}ms" />
      </InformationCard>
    {/each}
  </div>

  <h3>
    <InformationCard user={actors[0]}>
      <span class="font-semibold">
        {actors.at(-1)?.name}
      </span>
    </InformationCard>
    {paramReplacing(notification.title, [actorsString])}
  </h3>

  <div class="text-xs opacity-75">
    {notification.text}
  </div>
</a>

<style lang="scss">
  .slide-left {
    animation: slide-left 0.25s forwards ease-in-out;
    animation-delay: var(--i);
  }

  @keyframes slide-left {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(var(--x));
    }
  }
</style>
