<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import NotificationsHandler from "$lib/components/handlers/notifications-handler.svelte";
  import Navigation from "$lib/components/navigation/navigation.svelte";
  import SidePanel from "$lib/components/side-panel/side-panel.svelte";
  import "$lib/globals.scss";
  import { webVitals } from "$lib/web-vitals";
  import { creator, scrollPosition, theme } from "$lib/stores";
  import { pageTitle } from "$lib/utils/metadata";
  import { router } from "$lib/utils/router";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { onMount } from "svelte";

  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";
  import PostCreator from "$lib/components/posts/creator/post-creator.svelte";

  inject({ mode: dev ? "development" : "production" });
  let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

  $: if (browser && analyticsId) {
    webVitals({
      path: $page.url.pathname,
      params: $page.params,
      analyticsId,
    });
  }

  $theme = $page.data.theme ?? "SYSTEM_DEFAULT";

  $: {
    if (typeof window != "undefined") {
      if (
        $theme === "DARK" ||
        ($theme === "SYSTEM_DEFAULT" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      localStorage.setItem("theme", $theme);
    }
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

  $: creatorAllowed = Object.keys($creator.pathOptions).includes(
    $page.url.pathname as string
  );

  function scrollHandler(e: Event) {
    const target = e.target as HTMLElement;

    if ($scrollPosition[$page.url.pathname as string] != undefined) {
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
    <div class="min-h-screen">
      <div class="min-h-screen md:flex md:gap-12">
        <Navigation />
        <main
          class="lg:w-4/12 lg:min-w-[30rem] max-lg:w-11/12 mx-auto pt-8 relative">
          {#if $page.data.session && creatorAllowed}
            <PostCreator />
          {/if}
          <slot />
        </main>

        <SidePanel />
      </div>
    </div>
  </NotificationsHandler>
</QueryClientProvider>
