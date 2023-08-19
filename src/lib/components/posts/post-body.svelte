<script lang="ts">
  import type { _Post } from "$lib/types";
  const howLongIsTooLong = 200;

  export let post: _Post;

  function preventLink(node: HTMLElement) {
    node.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
  }

  const short_content = post.content.substring(0, howLongIsTooLong);
  const hasContentSwitcher = post.content.length > howLongIsTooLong;
  let expanded = post.content.length < howLongIsTooLong;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span class="cursor-pointer" use:preventLink>
  {expanded ? post.content : short_content}
  {#if hasContentSwitcher}
    <span
      on:click={() => (expanded = !expanded)}
      class="cursor-pointer {expanded
        ? 'text-zinc-600'
        : 'text-blue-600 dark:text-blue-500'}">
      {expanded ? "Mostrar menos" : "Mostrar mais..."}
    </span>
  {/if}
</span>
