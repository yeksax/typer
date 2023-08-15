<script lang="ts">
  import { pusherClient } from "$lib/pusher";

  export let position: "top" | "bottom" = "top";
  export let channel: string;
  export let event: string;

  let percent = 0;

  pusherClient
    .subscribe(channel)
    .bind(event, (data: number) => (percent = data));
</script>

<div
  class="absolute h-1 bg-black transition-all left-0 {position === 'top'
    ? 'top-0'
    : 'bottom-0'}"
  style="width: {percent}%;" />
