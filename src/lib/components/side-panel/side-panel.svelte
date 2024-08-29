<script lang="ts">
  import { page } from "$app/stores";
</script>

{#if $page.url.pathname !== "/typos"}
  <div class="max-lg:hidden flex flex-col flex-1 pt-8">
    <!-- <div class="fixed">oi</div> -->
  </div>
{/if}
