<script lang="ts">
  import { router } from "$lib/utils/router";
  import { twMerge } from "tailwind-merge";
  import type { FullPost, MinifiedUser } from "../../types";
  import Time from "../time.svelte";
  import InformationCard from "../user/information-card.svelte";
  import PostBody from "./post-body.svelte";
  import PostStats from "./post-stats.svelte";

  export let hideStats = false;
  export let dedicated = false;
  export let minified = false;
  export let connectDown = false;
  export let singleColumn = false;
  export let replyingTo: MinifiedUser | null = null;

  export let post: FullPost;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:pointerup={(e) => {
    e.stopPropagation();
    if (!dedicated && document.getSelection()?.toString() === "") {
      router.push(`/${post.author.username}/type/${post.id}`);
    }
  }}
  class={twMerge(
    "rounded-lg cursor-pointer border-2 bg-white dark:bg-zinc-850 transition-all border-black dark:border-zinc-950 flex flex-col gap-1 px-6 py-3 text-sm",
    $$props.class
  )}>
  <div class="flex gap-4 justify-between w-full">
    <InformationCard
      class="flex {minified ? 'gap-3' : 'gap-4'} items-center"
      user={post.author}>
      <img
        class="rounded-md {minified ? 'w-7 h-7' : 'w-9 h-9'} aspect-square"
        src={post.author.avatar}
        alt="foto de {post.author.name}" />

      <div
        class="flex flex-col justify-between truncate {minified
          ? 'text-zinc-600 dark:text-zinc-200 text-xs'
          : ''}">
        <h3 class="font-semibold truncate">
          {post.author.displayName ?? post.author.name}
        </h3>
        <span class="text-xs truncate">
          {post.author.name}#{post.author.tag}
        </span>
      </div>
    </InformationCard>

    {#if !hideStats}
      <Time time={post.createdAt} type="elapsed" realtime />
    {/if}
  </div>

  <div class="flex {minified ? 'gap-3' : 'gap-4'}">
    {#if !singleColumn}
      <span class="flex justify-center {minified ? 'w-7' : 'w-9'}">
        {#if connectDown}
          <div class="w-0.5 h-full bg-zinc-400 dark:bg-zinc-600 rounded-full" />
        {/if}
      </span>
    {/if}
    <div class="flex flex-col gap-1 flex-1 {minified ? 'text-xs' : ''}">
      {#if replyingTo}
        <div class="text-xs text-zinc-500">
          Em resposta a <InformationCard
            class="text-blue-600 dark:text-blue-400"
            user={replyingTo}>@{replyingTo.username}</InformationCard>
        </div>
      {/if}

      <PostBody {post} />

      {#if post.repost}
        <svelte:self
          minified
          hideStats
          post={post.repost}
          class="mt-3 p-1 px-3 bg-zinc-50 dark:bg-zinc-750 hover:bg-zinc-800" />
      {/if}

      {#if !hideStats}
        <PostStats {post} {dedicated} />
      {/if}
    </div>
  </div>
</div>
