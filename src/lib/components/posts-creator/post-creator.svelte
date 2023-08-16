<script lang="ts">
  import { page } from "$app/stores";
  import { creatorState } from "$lib/stores";
  import { longpress } from "$lib/utils/hooks/long-press";
  import axios, { AxiosError } from "axios";
  import { Minimize2Icon } from "svelte-feather-icons";
  import Draggable from "../draggable.svelte";
  import CreatorContent from "./creator-content.svelte";
  import CreatorFooter from "./creator-footer.svelte";
  import LoadingBar from "../loading-bar.svelte";

  let form: HTMLFormElement;
  $: locked = $creatorState.locked;

  function animateDraggable() {
    form.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.025)" },
        { transform: "scale(0.99)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 500,
        easing: "cubic-bezier(.5,.3,.35,1)",
      }
    );
  }

  function lockDraggable() {
    creatorState.update((state) => ({
      ...state,
      locked: true,
    }));

    animateDraggable();
  }

  function unlockDraggable() {
    creatorState.update((state) => ({
      ...state,
      locked: false,
    }));

    animateDraggable();
  }

  function longPressHandler() {
    if ($creatorState.locked) {
      unlockDraggable();
    }
  }

  function shortcutHandler(e: KeyboardEvent) {
    const { ctrlKey } = e;
    const key = e.key.toLowerCase();

    const target = e.target as HTMLElement;

    if (["textarea", "input"].includes(target.tagName.toLowerCase())) {
      if (ctrlKey && key === "enter") {
        publishHandler();
      }
    } else {
      if (key === "escape") {
        lockDraggable();
      } else if (key === "n") {
        unlockDraggable();
      }
    }
  }

  async function publishHandler(e?: SubmitEvent) {
    if (e) e.preventDefault();
    const data = new FormData(form);

    axios
      .post("/api/posts/publish", data)
      .then((response) => {
        form.reset();
      })
      .catch((e: AxiosError) => {
        creatorState.update((state) => ({
          ...state,
          error: (e.response?.data as any).message,
        }));
      });
  }

  $: user_id = $page.data.user.id;
</script>

<svelte:document on:keydown={shortcutHandler} />

<Draggable
  disabled={locked}
  class="rounded-lg border-2 overflow-hidden border-black dark:border-zinc-950 {locked
    ? 'relative mb-4'
    : 'lg:w-4/12 lg:min-w-[30rem] max-lg:w-11/12 fixed border-b-4 py-1.5 px-2 box-content'}">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <form
    bind:this={form}
    use:longpress
    on:submit={publishHandler}
    on:longpress={longPressHandler}
    class="relative flex gap-4 px-6 py-3 text-sm">
    <LoadingBar channel={user_id} event="publish-progress" />

    <img
      class="rounded-md w-9 h-9 aspect-square"
      src={$page.data.user.avatar}
      alt="" />

    <div class="flex flex-col gap-2 w-full">
      <div class="flex justify-between items-center">
        <div class="flex flex-col justify-between">
          <h3 class="font-semibold">
            {$page.data.user.displayName ?? $page.data.user.name}
          </h3>
          <span class="text-xs">
            {$page.data.user.name}#{$page.data.user.tag}
          </span>
        </div>

        {#if !locked}
          <button on:click={lockDraggable}>
            <Minimize2Icon size="14" />
          </button>
        {/if}
      </div>

      <CreatorContent />
      <CreatorFooter />
    </div>
  </form>
</Draggable>
