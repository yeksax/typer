<script lang="ts">
  import { resize } from "$lib/utils/css";
  import { creatorState } from "$lib/stores";
  import { fade } from "svelte/transition";

  let content: HTMLTextAreaElement;

  $: {
    if (!$creatorState.locked) {
      if (content) content.focus();
    }
  }

  function globalShortcutHandler(e: KeyboardEvent) {
    const { ctrlKey } = e;
    const key = e.key.toLowerCase();

    const target = e.target as HTMLElement;
  }

  function shortcutHandler(e: KeyboardEvent) {
    const key = e.key.toLowerCase();

    if (key === "escape") {
      content.blur();
    }
  }
</script>

<svelte:document on:keydown={globalShortcutHandler} />

<input
  class="hidden"
  type="file"
  name="attachments"
  id="post-attachments"
  multiple
  max="4" />

<textarea
  bind:this={content}
  on:keydown={shortcutHandler}
  bind:value={$creatorState.content.body}
  on:input={(e) => {
    resize(e);
    creatorState.update((state) => ({
      ...state,
      error: null,
    }));
  }}
  use:resize
  data-max-lines="10"
  name="content"
  class="w-full resize-none outline-none"
  placeholder="Eu acho que..." />

{#if $creatorState.error}
  <span in:fade out:fade class="text-xs text-red-400"
    >{$creatorState.error}</span>
{/if}
