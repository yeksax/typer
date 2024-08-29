<script lang="ts">
  import { page } from "$app/stores";
  import Navigation from "$lib/components/navigation/navigation.svelte";
  import PostCreator from "$lib/components/posts/creator/creator.svelte";
  import SidePanel from "$lib/components/side-panel/side-panel.svelte";
  import { creator } from "$lib/stores";

  console.log($page.route.id)

  $: creatorAllowed = Object.keys($creator.pathOptions).includes(
    $page.route.id as string,
  );
</script>

<div class="min-h-screen">
  <div class="min-h-screen md:flex md:gap-0">
    <Navigation />
      <slot />
    <SidePanel />
  </div>
</div>
