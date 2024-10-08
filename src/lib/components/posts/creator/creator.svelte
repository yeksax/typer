<script lang="ts">
  import { page } from "$app/stores";
  import Draggable from "$lib/components/draggable.svelte";
  import LoadingBar from "$lib/components/loading-bar.svelte";
  import InformationCard from "$lib/components/user/information-card.svelte";
  import { creator, newReplies as newQuotes } from "$lib/stores";
  import { longpress } from "$lib/utils/hooks/long-press";
  import axios, { type AxiosError } from "axios";
  import { Minimize2Icon, XIcon } from "svelte-feather-icons";
  import CreatorContent from "./creator-content.svelte";
  import CreatorFooter from "./creator-footer.svelte";
  import CreatorHead from "./creator-head.svelte";
  import PostQuoteContent from "./post-quote-content.svelte";
  import PostReplyContent from "./post-reply-content.svelte";

  $: route = $page.route.id as string;

  let form: HTMLFormElement;
  $: locked = $creator.locked && !$creator.pathOptions[route]?.floatingOnly;

  function animateDraggable() {
    form.animate(
      [
        { transform: "scale(1)" },
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
    creator.update((state) => ({
      ...state,
      locked: true,
    }));

    animateDraggable();
  }

  function unlockDraggable() {
    creator.update((state) => ({
      ...state,
      locked: false,
    }));

    animateDraggable();
  }

  function longPressHandler() {
    if ($creator.locked) {
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
        creator.update((state) => ({
          ...state,
          inResponseTo: null,
          replyingTo: null,
        }));
      } else if (key === "n") {
        unlockDraggable();
      }
    }
  }

  async function publishHandler(e?: SubmitEvent) {
    if (e) e.preventDefault();
    const data = new FormData(form);

    const isReply = $creator.replyingTo !== null;
    const isQuote = $creator.quotingTo !== null;
    const endpoint = "/api/posts/publish";

    let params: Record<string, string | number | boolean> = {};

    if ($creator.inResponseTo) {
      if (isQuote) {
        params = {
          quote_to: $creator.inResponseTo,
        };
      }
      if (isReply) {
        params = {
          replying_to: $creator.inResponseTo,
        };
      }
    }

    await axios
      .post(endpoint, data, {
        params,
      })
      .then((response) => {
        form.reset();
        creator.update((state) => ({
          ...state,
          content: { ...state.content, attachments: null, body: "" },
          replyingTo: null,
          quotingTo: null,
          inResponseTo: null,
        }));

        if (isReply) {
          newQuotes.update((state) => {
            const actualKeys = Object.keys(state);
            const valueAlreadyExists = actualKeys.includes(
              $creator.inResponseTo!.toString()
            );

            if (valueAlreadyExists) {
              const actualValue = state[$creator.inResponseTo!];
              state[$creator.inResponseTo!] = actualValue + 1;
            } else {
              state[$creator.inResponseTo!] = 1;
            }

            return state;
          });
        }

        if (isQuote) {
          newQuotes.update((state) => {
            const actualKeys = Object.keys(state);
            const valueAlreadyExists = actualKeys.includes(
              $creator.inResponseTo!.toString()
            );

            if (valueAlreadyExists) {
              const actualValue = state[$creator.inResponseTo!];
              state[$creator.inResponseTo!] = actualValue + 1;
            } else {
              state[$creator.inResponseTo!] = 1;
            }

            return state;
          });
        }
      })
      .catch((e: AxiosError) => {
        creator.update((state) => ({
          ...state,
          error: (e.response?.data as any).message,
        }));
      });
  }

  function cancelReply() {
    creator.update((state) => {
      state = { ...state, inResponseTo: null, replyingTo: null };

      if (state.pathOptions[route]?.hidden !== undefined) {
        state.pathOptions[route] = {
          ...state.pathOptions[route],
          hidden: true,
        };
      }

      return state;
    });

    lockDraggable();
  }

  $: user_id = $page.data.user.id;

  let creatorElement: HTMLElement;
</script>

<svelte:document on:keydown={shortcutHandler} />

{#if ($creator.pathOptions[route]?.floatingOnly && !$creator.locked) || !$creator.pathOptions[route]?.floatingOnly}
  <Draggable
    bind:draggable={creatorElement}
    disabled={locked}
    class="rounded-lg border-2 border-black dark:border-zinc-950 {locked
      ? 'relative mb-4'
      : 'lg:w-4/12 lg:min-w-[30rem] max-lg:w-11/12 fixed z-50 border-b-4 md:px-1 -ml-1.5 box-content'}">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <form
      bind:this={form}
      use:longpress
      on:input={(e) => {
        creator.update((state) => ({
          ...state,
          error: null,
        }));
      }}
      on:longpress={longPressHandler}
      data-longpressms={500}
      on:submit={publishHandler}
      class="flex flex-col gap-1 px-6 py-3 text-sm">
      <LoadingBar channel={user_id} event="publish-progress" />

      <div class="absolute right-6">
        {#if !locked && !$creator.inResponseTo}
          <button type="button" on:click={lockDraggable}>
            <Minimize2Icon size="14" />
          </button>
        {:else if $creator.inResponseTo}
          <button type="button" on:click={cancelReply}>
            <XIcon size="14" />
          </button>
        {/if}
      </div>

      {#if $creator.replyingTo}
        <PostReplyContent post={$creator.replyingTo} class="" />
      {/if}
      <CreatorHead />

      <div class="flex gap-4">
        <span class="flex justify-center w-9">
          {#if $creator.quotingTo}
            <div
              class="w-0.5 h-full bg-zinc-400 dark:bg-zinc-600 rounded-full" />
          {/if}
        </span>
        <div class="flex flex-col flex-1 gap-2 truncate">
          {#if $creator.replyingTo || $creator.quotingTo}
            {@const post = $creator.replyingTo || $creator.quotingTo}
            <!-- O post obviamente vai existir, é só pro typescript não encher o saco -->
            {#if post}
              {@const user = post.author}
              <span class="text-xs">
                Respondendo
                <InformationCard {user} class="inline">
                  <span class="text-blue-600 dark:text-blue-400"
                    >@{user.username}
                  </span>
                </InformationCard>
              </span>
            {/if}
          {/if}
          <CreatorContent />
          <CreatorFooter />
        </div>
      </div>

      {#if $creator.quotingTo}
        <PostQuoteContent post={$creator.quotingTo} class="mt-2" />
      {/if}
    </form>
  </Draggable>
{/if}
