<script lang="ts">
  import type { MinifiedPost, FullPost } from "$lib/types";
  import Post from "../post.svelte";

  export let post: MinifiedPost;
</script>

<div class={$$props.class}>
  <Post {post} class="mb-2 px-1 py-0 border-none" minified hideStats connectDown/>
</div>
