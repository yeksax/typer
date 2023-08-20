<script lang="ts">
  import { page } from "$app/stores";
  import { hardAccidentalClickPrevention } from "$lib/utils/hooks/prevent-accidental-click";
  import axios from "axios";
  import {
    HeartIcon,
    MessageSquareIcon,
    RepeatIcon,
    ShareIcon,
  } from "svelte-feather-icons";
  import type { FullPost } from "../../types";
  import PostStat from "./post-stat.svelte";
  import { creator, newLikes, newReplies, newUnlikes } from "$lib/stores";

  const iconProps = {
    strokeWidth: 2,
    size: "15",
  };

  export let post: FullPost;
  export let dedicated = false;

  let element: HTMLElement;

  $: route = $page.route.id as string;

  let isLiked = post.likes.length > 0;
  $: isReplying = $creator.replyingTo?.id === post.id;

  $: {
    if ($page.data.user) {
      isLiked =
        (post.likes.length > 0 || $newLikes.includes(post.id)) &&
        !$newUnlikes.includes(post.id);
    }
  }

  async function toggleLike() {
    isLiked = !isLiked;

    if (isLiked) {
      post._count.likes = post._count.likes + 1;
      newLikes.update((state) => [...state, post.id]);
      newUnlikes.update((state) => state.filter((u) => u !== post.id));

      await axios.post(`/api/posts/${post.id}/like`);
    } else {
      post._count.likes = post._count.likes - 1;
      newUnlikes.update((state) => [...state, post.id]);
      newLikes.update((state) => state.filter((u) => u !== post.id));

      await axios.post(`/api/posts/${post.id}/unlike`);
    }
  }

  function reply() {
    creator.update((state) => {
      state = {
        ...state,
        replying: post.id,
        replyingTo: post,
        locked: false,
      };

      if (dedicated) {
        state.pathOptions[route] = {
          ...state.pathOptions[route],
          hidden: false,
        };
      }

      return state;
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="pt-2 flex w-full items-center justify-between"
  bind:this={element}
  use:hardAccidentalClickPrevention>
  <PostStat
    value={post._count.replies + ($newReplies[post.id] ?? 0)}
    clickAction={reply}>
    <MessageSquareIcon
      class="transition-all duration-100 {isReplying
        ? 'fill-black dark:fill-white'
        : 'fill-transparent'}"
      slot="icon"
      {...iconProps} />
  </PostStat>

  <PostStat value={post._count.reposts}>
    <RepeatIcon slot="icon" {...iconProps} />
  </PostStat>

  <PostStat value={post._count.likes} clickAction={toggleLike}>
    <HeartIcon
      slot="icon"
      {...iconProps}
      class="transition-all duration-100 {isLiked
        ? 'fill-black dark:fill-white'
        : 'fill-transparent'}" />
  </PostStat>

  <PostStat novalue>
    <ShareIcon slot="icon" {...iconProps} strokeWidth={2} />
  </PostStat>
</div>
