<script lang="ts">
  export let time: string | number | Date;
  export let type: "long" | "default" | "short" | "elapsed" = "default";

  const now = new Date().getTime();
  const date = new Date(time);
  const elapsedTime = now - date.getTime();

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const elapsedWeeks = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 7));
  const elapsedDays = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
  const elapsedHours = Math.floor(elapsedTime / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));
  const elapsedSeconds = Math.floor(elapsedTime / 1000);
</script>

{#if type === "default"}
  
{/if}
