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
  import { router } from "$lib/utils/router";

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="{notification.isRead
    ? 'bg-white dark:bg-zinc-850'
    : 'bg-zinc-100 dark:bg-zinc-800'} flex gap-8 items-center cursor-pointer text-sm px-6 md:px-8 py-3 md:py-4 border-black dark:border-zinc-950 rounded-md border-2">
  <div
    on:click={() => router.push(`/${notification.redirect}`)}
    class="flex-1 flex flex-col gap-1">
    <div class="h-6">
      {#each actors as actor, i (actor.username)}
        <InformationCard user={actor}>
          <img
            src={actor.avatar}
            alt="foto de {actor.name}"
            class="slide-left rounded-md w-6 aspect-square absolute transition-all x-0"
            style="--x: {(actors.length - i - 1) * 1}rem; --i: {(actors.length -
              i -
              1) *
              100}ms" />
        </InformationCard>
      {/each}
    </div>

    <span class="mt-1">
      <InformationCard class="inline" user={actors[0]}>
        <span class="font-semibold">
          {actors.at(-1)?.name}
        </span>
      </InformationCard>
      {paramReplacing(notification.title, [actorsString])}
    </span>

    {#if notification.text}
      <div class="text-xs opacity-95 line-clamp-2">
        {notification.text}
      </div>
    {/if}
  </div>
  <svelte:component
    this={actionIcon}
    class="dark:fill-white dark:stroke-white fill-black stroke-black" />
</div>

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
