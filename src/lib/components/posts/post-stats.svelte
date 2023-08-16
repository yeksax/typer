<script lang="ts">
  import type { _Post } from "../../types";
  import axios from "axios";
  import {
    HeartIcon,
    MessageSquareIcon,
    RepeatIcon,
    ShareIcon,
  } from "svelte-feather-icons";
  import PostStat from "./post-stat.svelte";

  const iconProps = {
    strokeWidth: 2,
    size: "15",
  };

  export let post: _Post;
  let isLiked = post.likedBy.length > 0;

  async function toggleLike() {
    if (isLiked) {
      post._count.likedBy = post._count.likedBy - 1;
      await axios.post(`/api/posts/${post.id}/unlike`);
    } else {
      post._count.likedBy = post._count.likedBy + 1;
      await axios.post(`/api/posts/${post.id}/like`);
    }

    isLiked = !isLiked;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="pt-2 flex w-full items-center justify-between"
  on:click={(e) => e.stopPropagation()}>
  <PostStat value={post._count.replies}>
    <MessageSquareIcon slot="icon" {...iconProps} />
  </PostStat>

  <PostStat value={post._count.reposts}>
    <RepeatIcon slot="icon" {...iconProps} />
  </PostStat>

  <PostStat value={post._count.likedBy} clickAction={toggleLike}>
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
