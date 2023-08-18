<script lang="ts">
  import { page } from "$app/stores";
  import { newFollows, newUnfollows } from "$lib/stores";
  import type { MinifiedUser } from "$lib/types";
  import { longhover } from "$lib/utils/hooks/long-hover";
  import { fly } from "svelte/transition";
  import FollowButton from "./follow-button.svelte";

  let [x, y] = [0, 0];

  export let user: MinifiedUser;

  let iFollow = false;
  let followsMe = false;
  let isMe = false;
  let visible = false;

  $: if ($page.data.user) {
    iFollow = $page.data.user.following
      .map((user: MinifiedUser) => user.username)
      .includes(user.username);
    followsMe = $page.data.user.followers
      .map((user: MinifiedUser) => user.username)
      .includes(user.username);

    isMe = user.username === $page.data.user.username;
  }

  let mouseOutTimer: NodeJS.Timeout | null = null;

  function longHoverHandler(
    e: CustomEvent & { detail: { x: number; y: number } }
  ) {
    [x, y] = [e.detail.x, e.detail.y];

    visible = true;
  }

  function handlePointerLeave() {
    mouseOutTimer = setTimeout(() => {
      visible = false;
    }, 250);
  }

  function handlePointerEnter() {
    if (mouseOutTimer) clearTimeout(mouseOutTimer);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="cursor-auto"
  on:pointerleave={handlePointerLeave}
  on:pointerenter={handlePointerEnter}
  on:click={(e) => {
    e.stopPropagation();
  }}>
  <a use:longhover on:longhover={longHoverHandler} href="/{user.username}">
    <slot /></a>

  {#if visible}
    <div
      in:fly={{ y: -10, duration: 150 }}
      out:fly={{ y: 10, duration: 150 }}
      class="w-[240px] fixed transition-all bg-white overflow-hidden dark:bg-zinc-850 border-black dark:border-zinc-950 rounded-lg border-b-4 border-2 z-50"
      style="left: {x}px; top: {y}px;">
      <div class="relative">
        <div
          class="h-[100px] bg-zinc-100 dark:bg-zinc-900 border-b-2 border-black dark:border-zinc-950">
          {#if user.banner && user.banner != "/banner.png"}
            <img
              src={user.banner}
              alt="banner de {user.name}"
              class="w-full h-full" />
          {/if}
        </div>

        <div class="absolute w-11 left-1/2 -translate-x-1/2 -bottom-4">
          <img
            src={user.avatar}
            alt="foto de {user.name}"
            class="rounded-md border-black border-2 dark:border-zinc-950" />
        </div>
      </div>

      <div
        class="px-4 md:py-3 py-2 mt-3 font-medium w-full flex flex-col gap-2 text-xs">
        <div class="flex justify-between gap-2 items-start">
          <a href="/{user.username}" class="flex flex-col truncate">
            <h3 class="font-semibold text-sm truncate">
              {user.displayName ?? user.name}
            </h3>
            <div class="text-xs opacity-75 truncate">
              <span>{user.name}#{user.tag}</span>
            </div>
          </a>
          {#if !isMe}
            <FollowButton class="text-xs w-max py-0.5" {user} />
          {/if}
        </div>

        <div class="font-medium">
          {user.biography}
        </div>

        <div class="flex justify-between">
          <a
            href="/{user.username}/following"
            class="hover:underline hover:opacity-100"
            >{user._count.following} Seguindo</a>
          <a
            href="/{user.username}/followers"
            class="hover:underline hover:opacity-100"
            >{user._count.followers +
              (!iFollow && $newFollows.includes(user.username) ? 1 : 0) -
              (iFollow && $newUnfollows.includes(user.username) ? 1 : 0)} Seguidores</a>
        </div>
      </div>
    </div>
  {/if}
</div>
