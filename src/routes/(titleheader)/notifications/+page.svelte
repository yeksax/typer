<script lang="ts">
  import Notification from "$lib/components/notifications/notification.svelte";
  import type { _Notification } from "$lib/types";
  import { infiniteQuery } from "$lib/utils/reactQuery";
  import { LoaderIcon } from "svelte-feather-icons";

  const newNotifications: _Notification[] = [];

  const query = infiniteQuery<_Notification>({
    queryKeys: ["notifications"],
    queryURL: "/api/notifications",
    limit: 50,
  });
</script>

<div class="flex flex-col gap-2 pb-[100%]">
  {#if $query.isLoading}
    <span class="text-sm text-zinc-500">Todo: Skeletons</span>
  {/if}

  {#each newNotifications as notification (notification.id)}
    <Notification {notification} />
  {/each}

  {#if $query.isSuccess}
    {#each $query.data.pages as { data }, i (i)}
      {#each data as notification (notification.id)}
        <Notification {notification} />
      {/each}
    {/each}
    <div class="flex justify-center py-8">
      {#if $query.isFetching}
        <LoaderIcon size="14" class="animate-spin" />
      {/if}
      {#if !$query.hasNextPage}
        <span class="text-sm text-zinc-500">
          Acabaram as notificações &lt;/3
        </span>
      {/if}
    </div>
  {/if}
</div>
