<script lang="ts">
  export let href: string;
  export let text: string | undefined = undefined;
</script>

<a
  class="flex items-center gap-4 hover:font-medium transition-all duration-100 lg:hover:translate-x-0.5 {text
    ? 'w-full'
    : ''}"
  {href}>
  <slot />
  {#if text}
    {text}
  {/if}
</a>
