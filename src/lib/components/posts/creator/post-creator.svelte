<script lang="ts">
  import { page } from "$app/stores";
  import { creatorState, newReplies } from "$lib/stores";
  import { longpress } from "$lib/utils/hooks/long-press";
  import axios, { AxiosError } from "axios";
  import { Minimize2Icon, XIcon } from "svelte-feather-icons";
  import Draggable from "$lib/components/draggable.svelte";
  import CreatorContent from "./creator-content.svelte";
  import CreatorFooter from "./creator-footer.svelte";
  import LoadingBar from "$lib/components/loading-bar.svelte";
  import CreatorHead from "./creator-head.svelte";
  import InformationCard from "$lib/components/user/information-card.svelte";

  let form: HTMLFormElement;
  $: locked =
    $creatorState.locked &&
    !$creatorState.pathOptions[$page.route.id as string]?.floatingOnly;

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

    const isReply = $creatorState.replying !== null;
    const endpoint = isReply
      ? `/api/posts/${$creatorState.replying}/reply`
      : "/api/posts/publish";

    const response = await axios
      .post(endpoint, data)
      .then((response) => {
        form.reset();
        creatorState.update((state) => ({
          ...state,
          content: { attachments: [], body: "" },
        }));
      })
      .catch((e: AxiosError) => {
        creatorState.update((state) => ({
          ...state,
          error: (e.response?.data as any).message,
        }));
      });

    if (isReply) {
      newReplies.update((state) => {
        const actualKeys = Object.keys(state);
        const valueAlreadyExists = actualKeys.includes(
          $creatorState.replying!.toString()
        );

        if (valueAlreadyExists) {
          const actualValue = state[$creatorState.replying!];
          state[$creatorState.replying!] = actualValue + 1;
        } else {
          state[$creatorState.replying!] = 1;
        }

        return state;
      });
    }
  }

  function cancelReply() {
    creatorState.update((state) => ({
      ...state,
      replying: null,
      replyingTo: null,
    }));
  }

  $: user_id = $page.data.user.id;
</script>

<svelte:document on:keydown={shortcutHandler} />

<Draggable
  disabled={locked}
  class="rounded-lg border-2 border-black dark:border-zinc-950 {locked
    ? 'relative mb-4'
    : 'lg:w-4/12 lg:min-w-[30rem] max-lg:w-11/12 fixed border-b-4 md:px-1 -ml-1.5 box-content'}">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <form
    bind:this={form}
    use:longpress
    on:longpress={longPressHandler}
    data-longpressms={500}
    on:submit={publishHandler}
    class="flex flex-col gap-1 px-6 py-3 text-sm">
    <LoadingBar channel={user_id} event="publish-progress" />

    <CreatorHead>
      {#if !locked && !$creatorState.replying}
        <button type="button" on:click={lockDraggable}>
          <Minimize2Icon size="14" />
        </button>
      {:else if $creatorState.replying}
        <button type="button" on:click={cancelReply}>
          <XIcon size="14" />
        </button>
      {/if}
    </CreatorHead>

    <div class="flex gap-4">
      <span class="w-9" />
      <div class="flex flex-col flex-1 gap-2 truncate">
        {#if $creatorState.replyingTo}
          {@const user = $creatorState.replyingTo}
          <span class="text-xs">
            Respondendo
            <InformationCard {user} class="inline">
              <span class="text-blue-600 dark:text-blue-500"
                >@{user.username}
              </span>
            </InformationCard>
          </span>
        {/if}
        <CreatorContent />
        <CreatorFooter />
      </div>
    </div>
  </form>
</Draggable>
