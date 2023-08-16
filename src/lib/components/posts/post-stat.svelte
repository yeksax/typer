<script lang="ts">
  import { page } from "$app/stores";

  export let novalue = false;
  export let value = 0;
  export let clickAction: () => void = () => {};

  function clickHandler() {
    if ($page.data.session) clickAction();
  }
</script>

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
