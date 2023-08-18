<script lang="ts">
  import { page } from "$app/stores";
  import { pusherClient } from "$lib/pusher";
  import { notifications, unreadNotifications } from "$lib/stores";
  import type { _Notification } from "$lib/types";

  unreadNotifications.set($page.data.user?._count.notifications || 0);

  if ($page.data.user) {
    pusherClient
      .subscribe(`user__${$page.data.user.id}`)
      .bind("new-notification", (data: _Notification) => {
        unreadNotifications.update((v) => v + 1);
      })
      .bind("additive_update_update-notification", (data: _Notification) => {
        unreadNotifications.update((v) => v + 1);
      })
      .bind("destructive_update-notification", (data: _Notification) => {
        unreadNotifications.update((v) => (v > 0 ? v - 1 : v));
      })
      .bind("delete-notification", (data: _Notification) => {
        unreadNotifications.update((v) => (v > 0 ? v - 1 : v));
      });
  }
</script>

<slot />
