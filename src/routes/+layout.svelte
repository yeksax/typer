<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Navigation from "$lib/components/navigation/navigation.svelte";
  import SidePanel from "$lib/components/side-panel/side-panel.svelte";
  import "$lib/globals.scss";
  import { pageTitle } from "$lib/utils/metadata";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import type { PageData } from "./$types";

  export let data: PageData;

  let theme: "dark" | "" = "";

  $: if (data.theme === "DARK") {
    theme = "dark";
  } else if (typeof window !== "undefined") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } else {
    theme = "";
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        refetchOnWindowFocus: false,
      },
    },
  });
</script>

<svelte:head>
  <title>
    {pageTitle($page.data.metadata?.title)}
  </title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div class="min-h-screen {theme}">
    <div class="min-h-screen dark:bg-zinc-900 md:flex md:gap-12 text-black dark:text-white">
      <Navigation />
      <main
        class="md:w-4/12 max-md:w-11/12 mx-auto pt-8 ">
        <slot />
      </main>
      <SidePanel />
    </div>
  </div>
</QueryClientProvider>
