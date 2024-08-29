<script lang="ts">
  import { page } from "$app/stores";
  import { creator } from "$lib/stores";
  import PostCreator from "$lib/components/posts/creator/creator.svelte";

  $: creatorAllowed = Object.keys($creator.pathOptions).includes(
    $page.route.id as string,
  );
</script>

<main class="lg:w-4/12 lg:min-w-[36rem] max-lg:w-11/12 mx-auto pt-8 relative px-8">
  {#if $page.data.session && creatorAllowed}
    <PostCreator />
  {/if}

  <slot />
</main>
