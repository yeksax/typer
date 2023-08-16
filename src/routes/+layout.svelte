<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import Navigation from "$lib/components/navigation/navigation.svelte";
  import SidePanel from "$lib/components/side-panel/side-panel.svelte";
  import "$lib/globals.scss";
  import { lastPage } from "$lib/stores";
  import { pageTitle } from "$lib/utils/metadata";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  let theme: "dark" | "";

  $: if (typeof window != "undefined") {
    if (
      data.theme === "DARK" ||
      (data.theme === "SYSTEM_DEFAULT" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
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

  afterNavigate(({ from }) => {
    lastPage.set(from?.url.pathname || "/");
  });
</script>

<svelte:head>
  <title>
    {pageTitle($page.data.metadata?.title)}
  </title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div class="min-h-screen">
    <div
      class="min-h-screen dark:bg-zinc-900 md:flex md:gap-12 text-black dark:text-white">
      <Navigation />
      <main
        class="lg:w-4/12 lg:min-w-[30rem] max-lg:w-11/12 mx-auto pt-8 relative">
        <slot />
      </main>
      <SidePanel />
    </div>
  </div>
</QueryClientProvider>
