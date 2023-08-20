<script lang="ts">
  import { resize } from "$lib/utils/css";
  import { creator } from "$lib/stores";
  import { fade } from "svelte/transition";

  let content: HTMLTextAreaElement;

  $: {
    if (!$creator.locked) {
      setTimeout(() => {
        if (content) content.focus();
      }, 100);
    }
  }

  function shortcutHandler(e: KeyboardEvent) {
    const key = e.key.toLowerCase();

    if (key === "escape") {
      content.blur();
    }
  }
</script>

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
  bind:value={$creator.content.body}
  on:input={(e) => {
    resize(e);
    creator.update((state) => ({
      ...state,
      error: null,
    }));
  }}
  use:resize
  data-max-lines="10"
  name="content"
  class="w-full resize-none outline-none"
  placeholder={$creator.replyingTo
    ? `Ei, ${
        $creator.replyingTo.author.displayName ??
        $creator.replyingTo.author.name
      }...`
    : "Eu acho que..."} />

{#if $creator.error}
  <span in:fade out:fade class="text-xs text-red-400">{$creator.error}</span>
{/if}
