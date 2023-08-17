<script lang="ts">
  import { twMerge } from "tailwind-merge";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={twMerge(
    "w-full px-4 md:px-6 py-3 md:py-4 transition-all hover:bg-zinc-50 border-2 border-b-4 dark:bg-zinc-850 dark:hover:bg-zinc-800 rounded-lg border-black dark:border-zinc-950 gap-4 flex items-center",
    $$props.class
  )}>
  <slot name="icon" />

  <div class="flex flex-col gap-0.5 w-full">
    <div class="flex items-center justify-between text-sm">
      <slot name="title" />
      <slot name="value" />
    </div>
    <slot name="description" />
  </div>
</div>
