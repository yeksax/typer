<script lang="ts">
  import { page } from "$app/stores";
  import { newFollows, newUnfollows } from "$lib/stores";
  import type { MinifiedUser } from "$lib/types";
  import { router } from "$lib/utils/router";
  import axios from "axios";
  import { twMerge } from "tailwind-merge";

  export let user: MinifiedUser;
  let hovering = false;
  let isFollowing = false;

  $: {
    if ($page.data.user) {
      isFollowing =
        ($page.data.user.following
          .map((user: MinifiedUser) => user.username)
          .includes(user.username) ||
          $newFollows.includes(user.username)) &&
        !$newUnfollows.includes(user.username);
    }
  }

  async function toggleFollow() {
    if (!$page.data.user) {
      router.push("/signin?next=/typer");
    } else {
      isFollowing = !isFollowing;

      if (isFollowing) {
        newFollows.update((state) => [...state, user.username]);
        newUnfollows.update((state) =>
          state.filter((u) => u !== user.username)
        );
        await axios.post(`/api/users/${user.username}/follow`);
      } else {
        newUnfollows.update((state) => [...state, user.username]);
        newFollows.update((state) => state.filter((u) => u !== user.username));
        await axios.post(`/api/users/${user.username}/unfollow`);
      }
    }
  }
</script>

<button
  on:click={toggleFollow}
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  class={twMerge(
    "font-normal text-sm px-3 transition-all hover:bg-black hover:text-white bg-white dark:bg-zinc-700 py-1 rounded-md dark:border-zinc-950 border-black border-2 dark:hover:bg-zinc-900",
    $$props.class
  )}>
  {#if hovering}
    {isFollowing ? "Unfollow" : "Seguir"}
  {:else}
    {isFollowing ? "Seguindo" : "Seguir"}
  {/if}
</button>
