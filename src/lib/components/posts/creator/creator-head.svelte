<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="flex gap-4 items-start">
  <img
    class="rounded-md w-9 h-9 aspect-square"
    src={$page.data.user.avatar}
    alt="" />

  <div class="flex flex-col justify-between flex-1 truncate">
    <h3 class="font-semibold truncate">
      {$page.data.user.displayName ?? $page.data.user.name}
    </h3>
    <span class="text-xs truncate">
      {$page.data.user.name}#{$page.data.user.tag}
    </span>
  </div>

  <slot />
</div>
