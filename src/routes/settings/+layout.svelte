<script lang="ts">
  import { page } from "$app/stores";
  import Draggable from "$lib/components/draggable.svelte";
  import { ChevronLeftIcon } from "svelte-feather-icons";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { lastPage } from "$lib/stores";

  export let data: PageData;
  console.log(data.metadata);
  let disableButtons = false;
</script>

<div class="flex w-full justify-between text-sm h-10">
  <Draggable
    onDragStart={() => (disableButtons = true)}
    onDragEnd={() => (disableButtons = false)}
    snapToOrigin
    class="rounded-md border-black border-2 fixed border-l-4 border-b-4 dark:border-zinc-950">
    <button
      on:click={() => goto($lastPage)}
      class="h-8 grid place-items-center aspect-square box-border {disableButtons
        ? 'pointer-events-none'
        : ''}	">
      <ChevronLeftIcon size="16" />
    </button>
  </Draggable>

  <Draggable
    class="right-0 rounded-md border-black border-2 absolute border-r-4 border-b-4 dark:border-zinc-950">
    <span class="px-6 h-8 grid place-items-center">
      {$page.data.metadata?.title}
    </span>
  </Draggable>
</div>

<div class="flex flex-col mt-6">
  <slot />
</div>
