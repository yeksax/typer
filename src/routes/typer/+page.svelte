<script lang="ts">
  import PostsCreator from "$lib/components/posts-creator/post-creator.svelte";
  import Post from "$lib/components/posts/post.svelte";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { LoaderIcon } from "svelte-feather-icons";
  import type { _Post } from "$lib/types";
  import {infiniteQuery} from "$lib/utils/reactQuery";
  import { pusherClient } from "$lib/pusher";
  import type { PageData } from "./$types";

  export let data: PageData;

  let newPosts: _Post[] = [];

  const query = infiniteQuery<_Post>({
    queryKeys: ["posts"],
    queryURL: "/api/posts",
    limit: 20
  })

  pusherClient
    .subscribe("typer")
    .bind("new-post", (data: _Post) => (newPosts = [data, ...newPosts]));

  function scrollHandler(e: Event) {
    const target = e.target as HTMLElement;

    if (target.scrollHeight - target.scrollTop < 1500 && !$query.isFetching) {
      $query.fetchNextPage();
    }
  }
</script>

<svelte:body on:scroll={scrollHandler} />

{#if data.session}
  <PostsCreator />
{/if}
<div class="flex flex-col gap-2 pb-[100%]">
  {#if $query.isLoading}
    <span class="text-sm text-zinc-500">Todo: Skeletons</span>
  {/if}

  {#each newPosts as post (post.id)}
    <Post {post} />
  {/each}

  {#if $query.isSuccess}
    {#each $query.data.pages as { data }, i (i)}
      {#each data as post (post.id)}
        <Post {post} />
      {/each}
    {/each}
    <div class="flex justify-center py-8">
      {#if $query.isFetching}
        <LoaderIcon size="14" class="animate-spin" />
      {/if}
      {#if !$query.hasNextPage}
        <span class="text-sm text-zinc-500"> Acabaram os posts &lt;/3 </span>
      {/if}
    </div>
  {/if}
</div>
