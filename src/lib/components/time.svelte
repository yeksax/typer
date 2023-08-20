<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { Time } from "$lib/utils/time";

  export let realtime = false;
  export let realtimeFrequency = 1000;
  export let time: string | number | Date;
  export let type: "long" | "default" | "full" | "elapsed" = "default";

  let date = new Time(time);

  if(realtime) {
    setInterval(() => {
      date = new Time(time);
    }, realtimeFrequency)
  }
</script>

<span class={twMerge("text-xs", $$props.class)}>
  {#if type === "default"}
    {date.default}
  {:else if type === "long"}
    {date.long}
  {:else if type === "full"}
    {date.full}
  {:else if type === "elapsed"}
    {date.elapsed}
  {/if}
</span>
