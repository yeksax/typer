<script lang="ts">
  import type { MinifiedPost, FullPost } from "$lib/types";
  import { XIcon } from "svelte-feather-icons";
  import Post from "../post.svelte";
  import { twMerge } from "tailwind-merge";
  import { creator } from "$lib/stores";

  export let post: MinifiedPost;
</script>

<div class={twMerge("relative", $$props.class)}>
  <Post {post} class="mb-2 p-2" minified hideStats singleColumn />
  <button
    type="button"
    on:click={() => {
      creator.update((state) => ({
        ...state,
        replyingTo: null,
        quotingTo: null,
        inResponseTo: null,
      }));
    }}
    class="absolute right-2 top-2">
    <XIcon size="12" />
  </button>
</div>
