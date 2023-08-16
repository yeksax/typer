<script lang="ts">
  import { twMerge } from "tailwind-merge";
</script>

<button
  class={twMerge(
    "border-black border-2 px-3 rounded-sm font-medium hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-900 text-xs py-0.5 transition-all",
    $$props.class
  )}
  {...$$restProps}>
  <slot />
</button>
