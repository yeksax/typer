<script lang="ts">
  import { twMerge } from "tailwind-merge";
</script>

<button
  class={twMerge("border-black border-2 px-3 rounded-sm font-medium hover:bg-black dark:hover:bg-white dark:bg-zinc-800", $$props.class)}
  {...$$restProps}>
  <slot />
</button>
