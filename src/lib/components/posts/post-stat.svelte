<script lang="ts">
  import { page } from "$app/stores";
  import Button from "../button/button.svelte";

  export let novalue = false;
  export let value = 0;
  export let clickAction: () => void = () => {};

  let expanded = false;

  function clickHandler() {
    if ($page.data.session) clickAction();

    if ($$slots.actions) {
      expanded = !expanded;
    }
  }
</script>

<div class="relative">
  <button
    class="flex group items-center gap-2 font-semibold"
    on:click={clickHandler}>
    <span
      class="group-hover:after:w-8 group-hover:after:opacity-100 hover-effect">
      <slot name="icon" />
    </span>

    {#if !novalue}
      {#if value > 0}
        {value}
      {:else}
        &nbsp;
      {/if}
    {/if}
  </button>

  {#if expanded}
    <div
      class="absolute left-0 bg-white top-full mt-2 border-2 border-b-4 border-black dark:border-zinc-950 rounded-md">
      <slot name="actions" />
    </div>
  {/if}
</div>
