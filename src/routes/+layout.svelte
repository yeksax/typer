<script lang="ts">
  import "@fontsource-variable/inter/opsz.css";
  import { browser } from "$app/environment";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import NotificationsHandler from "$lib/components/handlers/notifications-handler.svelte";
  import { creator, scrollPosition } from "$lib/stores";
  import { pageTitle } from "$lib/utils/metadata";
  import { router } from "$lib/utils/router";
  import { webVitals } from "$lib/web-vitals";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";
  import "../globals.css";

  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";

  inject({ mode: dev ? "development" : "production" });
  const analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

  $: if (browser && analyticsId) {
    webVitals({
      path: $page.url.pathname,
      params: $page.params,
      analyticsId,
    });
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        refetchOnWindowFocus: false,
      },
    },
  });

  onMount(() => {
    router.register($page.url.pathname);
  });

  afterNavigate(({ to, type }) => {
    router.register(to?.url.pathname ?? "/");

    creator.update((state) => ({
      ...state,
    }));
  });

  function scrollHandler(e: Event) {
    const target = e.target as HTMLElement;

    if ($scrollPosition[$page.url.pathname as string] !== undefined) {
      scrollPosition.update((state) => {
        state[$page.url.pathname as string] = target.scrollTop;
        return state;
      });
    }
  }

  afterNavigate(() => {
    if ($scrollPosition[$page.url.pathname as string]) {
      document.body.scrollTo({
        top: $scrollPosition[$page.url.pathname as string],
      });
    } else {
      document.body.scrollTo({
        top: 0,
      });

      scrollPosition.update((state) => ({
        ...state,
        [$page.url.pathname as string]: 0,
      }));
    }
  });
</script>

<svelte:head>
  <title>
    {pageTitle($page.data.title)}
  </title>
</svelte:head>

<svelte:body on:scroll={scrollHandler} />

<QueryClientProvider client={queryClient}>
  <NotificationsHandler>
    <slot />
  </NotificationsHandler>
</QueryClientProvider>

<ModeWatcher />

<style>
  :global(*, pre) {
    font-family: "Inter Variable", sans-serif;
  }
</style>
