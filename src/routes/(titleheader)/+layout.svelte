<script lang="ts">
  import { page } from "$app/stores";
  import Draggable from "$lib/components/draggable.svelte";
  import { ChevronLeftIcon } from "svelte-feather-icons";
  import { router } from "$lib/utils/router";

  let disableButtons = false;

  $: pathname = $page.url.pathname.split("/");
</script>

<div class="flex w-full justify-between text-sm h-10">
  <Draggable
    minimumHoldTime={150}
    onDragStart={() => (disableButtons = true)}
    onDragEnd={() => (disableButtons = false)}
    snapToOrigin
    class="rounded-md border-black border-2 fixed border-l-4 border-b-4 dark:border-zinc-950">
    <button
      on:click={() => router.back()}
      class="h-8 grid place-items-center aspect-square box-border {disableButtons
        ? 'pointer-events-none'
        : ''}	">
      <ChevronLeftIcon size="16" />
    </button>
  </Draggable>

  <Draggable
    snapToOrigin
    class="right-0 rounded-md border-black border-2 absolute border-r-4 border-b-4 dark:border-zinc-950">
    <div class="px-6 h-8 grid place-items-center">
      <span>
        {#if $page.data.path}
          {#each $page.data.path as path, i}
            <a
              href={pathname.slice(0, pathname.length - i - 1).join("/")}
              class={i === 0 ? "" : "opacity-75"}>
              {#if i > 0}
                &gt;
              {/if}
              {path}
            </a>
          {/each}
        {:else}
          {$page.data.title}
        {/if}
      </span>
    </div>
  </Draggable>
</div>

<div class="flex flex-col mt-4">
  <slot />
</div>
