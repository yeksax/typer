<script lang="ts">
  import type { Writable } from "svelte/store";

  export let href: string;
  export let text: string | undefined = undefined;
  export let blob: Writable<number | string> | undefined = undefined;
</script>

<a
  class="flex items-center gap-4 hover:font-medium transition-all duration-100 lg:hover:translate-x-0.5 {text
    ? 'w-full'
    : ''}"
  {href}>
  <div class="relative">
    {#if $blob}
      <div
        class="absolute text-xs w-4 grid place-items-center rounded-full -translate-x-1/2 translate-y-1/2 left-full bottom-full text-white bg-black">
        {$blob}
      </div>
    {/if}

    <slot />
  </div>
  {#if text}
    {text}
  {/if}
</a>
