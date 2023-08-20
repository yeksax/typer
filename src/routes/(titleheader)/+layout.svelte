<script lang="ts">
  import { page } from "$app/stores";
  import { router } from "$lib/utils/router";
  import { ChevronLeftIcon } from "svelte-feather-icons";

  $: pathname = $page.url.pathname.split("/");
</script>

<div class="flex w-full justify-between text-sm h-10">
  <button
    on:click={() => router.back($page.data.back)}
    class="h-10 flex px-4 gap-3 place-items-center box-border rounded-md border-black border-2 fixed bg-white dark:bg-zinc-900 z-40 border-l-4 border-b-4 dark:border-zinc-950">
    <ChevronLeftIcon size="14" />

    <span class="font-medium">
      {#if $page.data.path}
        {#each $page.data.path as path, i}
          <a
            href={pathname.slice(0, pathname.length - i - 1).join("/")}
            class={i === 0 ? "" : "opacity-75"}>
            {#if i > 0}
              &gt;
            {/if}
            {@html path}
          </a>
        {/each}
      {:else}
        {@html $page.data.title}
      {/if}
    </span>
  </button>
</div>

<div class="mt-4">
  <slot />
</div>
