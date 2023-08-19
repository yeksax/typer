<script lang="ts">
  import type { _Post } from "$lib/types";
  import {
    hardAccidentalClickPrevention,
    softAccidentalClickPrevention,
  } from "$lib/utils/hooks/prevent-accidental-click";
  const howLongIsTooLong = 200;

  export let post: _Post;

  const short_content = post.content.substring(0, howLongIsTooLong);
  const hasContentSwitcher = post.content.length > howLongIsTooLong;
  let expanded = post.content.length < howLongIsTooLong;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="">
  <pre class="inline" use:softAccidentalClickPrevention>{expanded
      ? post.content
      : short_content}</pre>
  {#if hasContentSwitcher}
    <div class="inline" use:hardAccidentalClickPrevention>
      <span
        on:click={() => (expanded = !expanded)}
        class="cursor-pointer {expanded
          ? 'text-zinc-600'
          : 'text-blue-600 dark:text-blue-500'}">
        {expanded ? "Mostrar menos" : "Mostrar mais..."}
      </span>
    </div>
  {/if}
</div>
