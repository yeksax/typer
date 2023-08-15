<script lang="ts">
  import { resize } from "$lib/utils/css";
  import { creatorState } from "$lib/stores";

  let input: HTMLTextAreaElement;
</script>

<input class="hidden" type="file" name="attachments" id="post-attachments" multiple max="4"/>
<textarea
  bind:value={$creatorState.content.body}
  bind:this={input}
  on:input={resize}
  use:resize
  data-max-lines="10"
  name="content"
  class="w-full resize-none outline-none"
  placeholder="Eu acho que..." />
