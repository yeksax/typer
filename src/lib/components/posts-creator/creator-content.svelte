<script lang="ts">
  import { resize } from "$lib/utils/css";
  import { creatorState } from "$lib/stores";
  import { fade } from "svelte/transition";
</script>

<input
  class="hidden"
  type="file"
  name="attachments"
  id="post-attachments"
  multiple
  max="4" />

<textarea
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
  <span in:fade out:fade class="text-xs text-red-400">{$creatorState.error}</span>
{/if}
