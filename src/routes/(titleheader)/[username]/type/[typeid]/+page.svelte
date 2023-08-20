<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import Post from "$lib/components/posts/post.svelte";
  import { pusherClient } from "$lib/pusher";
  import { creator, newReplies } from "$lib/stores";
  import type { FullPost } from "$lib/types";
  import { infiniteQuery } from "$lib/utils/reactQuery";
  import { onMount } from "svelte";
  import { LoaderIcon } from "svelte-feather-icons";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: post = data.post;

  let mainPost: HTMLElement;

  $: query = infiniteQuery<FullPost>({
    queryKeys: [`${post!.id}__replies`],
    queryURL: "/api/posts",
    limit: 20,
    options: {
      params: {
        replying_to: post!.id.toString(),
      },
    },
  });

  creator.subscribe((state) => {
    if (!state.replyingTo && state.visible) {
      creator.update((prev) => ({ ...prev, visible: false }));
    }
  });

  const recentPosts = {} as { [key: number]: FullPost[] };

  $: {
    newReplies.update((state) => ({ ...state, [post!.id]: 0 }));
  }

  function scrollToMainPost() {
    if (post!.thread.length > 0 && mainPost) {
      document.body.scrollTo({
        top: mainPost.offsetTop - 80,
        behavior: "smooth",
      });
    }
  }

  onMount(() => {
    scrollToMainPost();
  });

  afterNavigate(() => {
    scrollToMainPost();
    const currentId = parseInt($page.params.typeid as string);
    console.log(currentId)
    if (!recentPosts[currentId]) recentPosts[currentId] = [];

    pusherClient
      .subscribe(`post__${currentId}`)
      .bind("new-reply", (new_post: FullPost) => {
        recentPosts[currentId] = [new_post, ...recentPosts[currentId]];
      });
  });

  $: newPosts = recentPosts[post!.id];
</script>

<div class="flex flex-col gap-2 pb-[100%]">
  {#if post}
    {#each post.thread as previousPost (previousPost.id)}
      <Post post={previousPost} replyingTo={previousPost.author} />
    {/each}

    <div bind:this={mainPost}>
      <Post class="border-b-4 mb-4" {post} dedicated />
    </div>

    {#if newPosts}
      {#each newPosts as newPost (newPost.id)}
        <Post post={newPost} replyingTo={newPost.author} />
      {/each}
    {/if}

    {#if $query.isSuccess}
      {#each $query.data.pages as { data }, i (i)}
        {#each data as queriedPost (queriedPost.id)}
          <Post post={queriedPost} replyingTo={queriedPost.author} />
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
  {/if}
</div>
