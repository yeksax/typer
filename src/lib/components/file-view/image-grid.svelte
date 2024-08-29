<script lang="ts">
  import type { Attachment } from "@prisma/client";
  import { Edit2Icon, EditIcon, XIcon } from "svelte-feather-icons";

  export let images: File[] | Attachment[] = [];
  export let removeFile: null | ((file: File) => void) = null;
  export let editImage: null | ((file: File) => void) = null;

  function removeHandler(file: File | Attachment) {
    if (removeFile && file instanceof File) removeFile(file);
  }
</script>

<div
  class="w-full place-items-center grid gap-1 mt-1 h-fit grid-flow-row {images.length >
  1
    ? 'grid-cols-2'
    : ''}">
  {#each images as image, i}
    <div
      class="relative text-xs overflow-hidden {images.length === 3 && i === 0
        ? 'row-span-2'
        : ''} object-cover h-full w-full rounded-md border-2">
      <img
        src={image instanceof File ? URL.createObjectURL(image) : image.url}
        width={1080}
        height={1080}
        alt="preview"
        class="h-full aspect-[3/2] w-full object-cover"
        loading="lazy" />
      {#if removeFile}
        <button
          type="button"
          class="p-1 absolute right-1 top-1 grid place-items-center"
          on:click={() => removeHandler(image)}>
          <XIcon size="14" class="dark:text-black" />
        </button>
      {/if}

      {#if editImage}
        <button
          type="button"
          class="p-1 px-3 absolute rounded-md backdrop-blur-sm flex items-center gap-2 right-1 bottom-1">
          Editar <Edit2Icon size="14" />
        </button>
      {/if}
    </div>
  {/each}
</div>

<!-- style={images.length === 3 && i === 2 ? "gridRow: 1 / span 2" : ""} -->
