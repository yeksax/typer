<script lang="ts">
  import { page } from "$app/stores";
  import Notification from "$lib/components/notifications/notification.svelte";
  import { pusherClient } from "$lib/pusher";
  import { notifications, unreadNotifications } from "$lib/stores";
  import type { _Notification } from "$lib/types";
  import { readAll } from "$lib/utils/notifications";
  import { infiniteQuery } from "$lib/utils/reactQuery";
  import axios from "axios";
  import { LoaderIcon } from "svelte-feather-icons";

  const query = infiniteQuery<_Notification>({
    queryKeys: ["notifications"],
    queryURL: "/api/notifications",
    limit: 50,
  });

  let queriedNotifications: _Notification[] = [];
  let realtimeNotifications: (_Notification & {
    _action_type: "new" | "update" | "delete";
  })[] = [];

  unreadNotifications.set(0);

  pusherClient
    .subscribe(`user__${$page.data.user.id}`)
    .bind("new-notification", async (data: _Notification) => {
      realtimeNotifications = [
        ...realtimeNotifications,
        { _action_type: "new", ...data },
      ];
      readAll();
    })
    .bind("additive_update-notification", async (data: _Notification) => {
      realtimeNotifications = [
        ...realtimeNotifications,
        { _action_type: "update", ...data },
      ];
      readAll();
    })
    .bind("destructive_update-notification", async (data: _Notification) => {
      realtimeNotifications = [
        ...realtimeNotifications,
        { _action_type: "update", ...data },
      ];
      readAll();
    })
    .bind("delete-notification", (data: _Notification) => {
      realtimeNotifications = [
        ...realtimeNotifications,
        { _action_type: "delete", ...data },
      ];
    });

  $: {
    queriedNotifications = [];

    if ($query.data)
      for (let i = 0; i < $query.data.pages.length; i++) {
        queriedNotifications = [
          ...queriedNotifications,
          ...$query.data.pages[i].data,
        ];
      }

    for (let i = 0; i < realtimeNotifications.length; i++) {
      const notification = realtimeNotifications[i];

      if (notification._action_type === "new") {
        queriedNotifications = [notification, ...queriedNotifications];
      }

      if (notification._action_type === "update") {
        queriedNotifications = queriedNotifications.map((n) =>
          n.id === notification.id ? notification : n
        );
      }

      if (notification._action_type === "delete") {
        queriedNotifications = queriedNotifications.filter(
          (n) => n.id !== notification.id
        );
      }
    }

    queriedNotifications = queriedNotifications.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    notifications.set(queriedNotifications);
  }
</script>

<div class="flex flex-col gap-2 pb-[100%]">
  <!-- {#if $query.isLoading}
    <span class="text-sm text-zinc-500">Todo: Skeletons</span>
  {/if} -->

  {#each queriedNotifications as notification (`${notification.id}_${notification.updatedAt}`)}
    <Notification {notification} />
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
</div>
