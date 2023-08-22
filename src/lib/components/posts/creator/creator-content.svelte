<script lang="ts">
  import { resize } from "$lib/utils/css";
  import { creator } from "$lib/stores";
  import { fade } from "svelte/transition";
  import FilesPreview from "$lib/components/file-view/files-preview.svelte";

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

  function attachments(node: HTMLInputElement) {
    creator.subscribe((state) => {
      if (state.content.attachments) {
        node.files = state.content.attachments;
      } else {
        node.files = new DataTransfer().files;
      }
    });
  }
</script>

<textarea
  bind:this={content}
  on:keydown={shortcutHandler}
  bind:value={$creator.content.body}
  on:input={resize}
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

<input class="hidden" type="file" name="attachments" multiple use:attachments />

{#if $creator.content.attachments}
  <FilesPreview files={$creator.content.attachments} />
{/if}

{#if $creator.error}
  <span in:fade out:fade class="text-xs text-red-400">{$creator.error}</span>
{/if}
