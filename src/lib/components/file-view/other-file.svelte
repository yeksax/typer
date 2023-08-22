<script lang="ts">
  import { hardAccidentalClickPrevention } from "$lib/utils/hooks/prevent-accidental-click";
  import { sizeToReadable } from "$lib/utils/string";
  import type { Attachment } from "@prisma/client";
  import { DownloadIcon, FileIcon, TrashIcon } from "svelte-feather-icons";

  export let file: File | Attachment;
  export let removeFile: null | (() => void) = null;

  $: href = file instanceof File ? URL.createObjectURL(file) : file.url;
</script>

<div
  class="flex group dark:bg-zinc-750 relative overflow-hidden gap-4 px-3.5 py-1 items-center border-2 border-black dark:border-zinc-950 rounded-md">
  <div
    class="flex right-0 top-0 lg:translate-x-full lg:group-hover:translate-x-0 bg-white dark:bg-zinc-800 border-l-2 border-black dark:border-zinc-950 absolute h-full transition-all gap-4 duration-300 items-center justify-between px-2.5">
    {#if removeFile}
      <button
        class="hover:text-red-500 transition-all p-1"
        type="button"
        on:click={removeFile}>
        <TrashIcon size="16" />
      </button>
    {/if}

    <a
      {href}
      class="hover:text-blue-600 dark:hover:text-blue-500 transition-all p-1"
      type="button">
      <DownloadIcon size="16" />
    </a>
  </div>
  <div class="flex w-fit">
    <FileIcon size="22" />
  </div>

  <div class="flex flex-col justify-between text-xs truncate">
    <a
      use:hardAccidentalClickPrevention
      {href}
      target="_blank"
      class="truncate font-semibold hover:text-blue-600 dark:hover:text-blue-500 cursor-pointer"
      >{file.name}</a>
    <span class="truncate text-xxs">{sizeToReadable(file.size)}</span>
  </div>
</div>
