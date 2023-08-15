<script lang="ts">
  import { goto } from "$app/navigation";
  import type { _Post } from "../../types";
  import PostStats from "./post-stats.svelte";

  export let post: _Post;
  export let showStats = true;

  function preventLink(node: HTMLElement) {
    node.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click={() => goto(`/${post.author.username}/type/${post.id}`)}
  class="post rounded-lg cursor-pointer border-2 bg-white dark:bg-zinc-850 border-black dark:border-zinc-950 flex gap-4 px-6 py-3 text-sm">
  <div class="flex flex-col items-center">
    <img class="rounded-md w-9 aspect-square" src={post.author.avatar} alt="" />

    {#if post.replies.length > 0}
      ...
    {/if}
  </div>

  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col justify-between">
      <h3 class="font-semibold">
        {post.author.displayName ?? post.author.name}
      </h3>
      <span class="text-xs">
        {post.author.name}#{post.author.tag}
      </span>
    </div>

    <pre use:preventLink>{post.content}</pre>

    {#if showStats}
      <PostStats {post} />
    {/if}
  </div>
</div>
