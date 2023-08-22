<script lang="ts">
  import { creator } from "$lib/stores";
  import type { Attachment } from "@prisma/client";
  import ImageGrid from "../file-view/image-grid.svelte";
  import OtherFile from "./other-file.svelte";
  import { multipleIncludes } from "$lib/utils/string";

  export let files: (Attachment & { type: string })[];

 

  $: images = files.filter((file) => file.type.includes("image"));
  $: videos = files.filter((file) => file.type.includes("video"));
  $: audios = files.filter((file) => file.type.includes("audio"));
  $: other = files.filter(
    (file) => !multipleIncludes(["image", "video", "audio"], file.type)
  );
</script>

{#if images.length > 0}
  <ImageGrid {images} />
{/if}

{#if other.length}
  <div
    class="grid mt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3 gap-x-1 gap-y-0.5">
    {#each other as file}
      <OtherFile {file} />
    {/each}
  </div>
{/if}
