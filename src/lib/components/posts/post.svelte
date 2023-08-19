<script lang="ts">
  import { router } from "$lib/utils/router";
  import { cubicInOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import type { _Post } from "../../types";
  import InformationCard from "../user/information-card.svelte";
  import PostStats from "./post-stats.svelte";
  import PostBody from "./post-body.svelte";

  export let post: _Post;
  export let showStats = true;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  in:fly={{ y: -5, opacity: 0, duration: 500, easing: cubicInOut }}
  on:pointerup={() => router.push(`/${post.author.username}/type/${post.id}`)}
  class="post rounded-lg cursor-pointer border-2 bg-white dark:bg-zinc-850 dark:hover:bg-zinc-800 transition-all border-black dark:border-zinc-950 flex flex-col gap-1 px-6 py-3 text-sm">
  <InformationCard user={post.author}>
    <div class="flex gap-4">
      <img
        class="rounded-md w-9 aspect-square"
        src={post.author.avatar}
        alt="foto de {post.author.name}" />

      <div class="flex flex-col justify-between truncate">
        <h3 class="font-semibold truncate">
          {post.author.displayName ?? post.author.name}
        </h3>
        <span class="text-xs truncate">
          {post.author.name}#{post.author.tag}
        </span>
      </div>
    </div>
  </InformationCard>

  <div class="flex gap-4">
    <span class="w-9" />
    <div class="flex flex-col gap-2 flex-1">
      <PostBody {post} />

      {#if showStats}
        <PostStats {post} />
      {/if}
    </div>
  </div>
</div>
