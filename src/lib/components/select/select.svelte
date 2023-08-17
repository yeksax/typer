<script lang="ts">
  import type { SelectOption } from "$lib/types";
  import { clickOutside } from "$lib/utils/hooks/click-outside";
  import { ChevronDownIcon } from "svelte-feather-icons";
  import { fly } from "svelte/transition";

  export let action: (value: string) => void;
  export let title: string;
  export let values: SelectOption[];
  export let value: string;
  export let closeOnClick: boolean = true;
  export let titleAlwaysVisible: "hard" | "soft" | undefined = undefined;
  export let labelAlwaysVisible = false;
  export let name = "__default__";

  const initialValue = value;

  let expanded = false;
  let currentValue: SelectOption;
  let yTranslate = 0;
  let xTranslate = 0;
  let setectRef: HTMLElement;

  function repositionIfDontFit(node: HTMLElement) {
    yTranslate = 0;
    xTranslate = 0;

    let rect = node.getBoundingClientRect();
    let selectRect = setectRef.getBoundingClientRect();

    if (selectRect.x + rect.width > window.innerWidth) {
      xTranslate += rect.width;
    }

    if (selectRect.top + rect.height > window.innerHeight) {
      yTranslate = rect.height + selectRect.height + 8;
    }
  }

  function handleSelection(newValue: SelectOption) {
    action(String(newValue.value));
    if (closeOnClick) expanded = false;

    currentValue = newValue;
    value = String(newValue.value);
  }

  function toggle() {
    expanded = !expanded;
  }
</script>

<div
  use:clickOutside
  on:click_outside={() => {
    expanded = false;
  }}
  class="relative font-medium text-xs"
  in:fly={{ y: -4, opacity: 0, duration: 200 }}
  out:fly={{ y: -4, opacity: 0, duration: 200 }}>
  <input type="hidden" {name} {value} />
  <button
    type="button"
    bind:this={setectRef}
    on:click={toggle}
    class="flex px-2.5 py-0.5 border-black dark:border-zinc-950 dark:bg-zinc-750 items-center gap-2 relative {expanded
      ? 'opacity-100'
      : 'opacity-80'} hover:opacity-100 transition-all border-2 rounded-md">
    <slot />

    {#if titleAlwaysVisible === "hard" || ((titleAlwaysVisible === "soft" || titleAlwaysVisible === undefined) && currentValue === undefined)}
      {title}
    {/if}
    {#if currentValue || labelAlwaysVisible}
      {currentValue
        ? currentValue.label
        : values.find((v) => v.value == initialValue)?.label}
    {/if}

    <ChevronDownIcon
      size="12"
      class="transition-all pointer-events-none {expanded
        ? 'rotate-180'
        : ''}" />
  </button>
  {#if expanded}
    <div
      use:repositionIfDontFit
      in:fly={{
        y: values.length * (yTranslate > 0 ? 2 : -2) + "px",
        opacity: 0,
        duration: 200,
      }}
      out:fly={{
        y: values.length * (yTranslate > 0 ? 2 : -2) + "px",
        opacity: 0,
        duration: 200,
      }}
      style="transform: translateY(-{yTranslate}px)"
      class="absolute overflow-hidden top-full mt-1 right-0 z-10 border-black dark:border-zinc-950 w-max font-medium border-2 bg-white dark:bg-zinc-900 flex flex-col rounded-sm">
      {#each values as thisValue}
        <button
          type="button"
          class="py-1.5 w-full text-left px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all {thisValue &&
          value == thisValue.value
            ? 'bg-zinc-100 dark:bg-zinc-750'
            : ''}"
          on:click={() => handleSelection(thisValue)}>
          {thisValue.label}</button>
      {/each}
    </div>
  {/if}
</div>
