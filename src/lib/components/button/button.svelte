<script lang="ts">
  import { twMerge } from "tailwind-merge";
</script>

<button
  {...$$restProps}
  class={twMerge(
    "border-black border-2 px-3 rounded-sm font-medium hover:enabled:bg-black disabled:opacity-50 dark:bg-zinc-850 dark:hover:enabled:bg-zinc-900 text-xs py-0.5 transition-all",
    $$restProps.class
  )}>
  <slot />
</button>
