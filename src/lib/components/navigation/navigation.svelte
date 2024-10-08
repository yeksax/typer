<script lang="ts">
  import { page } from "$app/stores";
  import {
    creator,
    navigationStatus,
    notifications,
    unreadNotifications,
  } from "$lib/stores";
  import {
    BellIcon,
    BookmarkIcon,
    EditIcon,
    HomeIcon,
    LogInIcon,
    MailIcon,
    SettingsIcon,
    UserIcon,
  } from "svelte-feather-icons";
  import type { Writable } from "svelte/store";
  import Draggable from "../draggable.svelte";
  import NavigationItem from "./navigation-item.svelte";
  import type { ComponentType } from "svelte";

  const session = !!$page.data.session;

  interface Navigation {
    [key: string]: {
      icon: ComponentType;
      href: string;
      requires: boolean;
      mobile: boolean;
      blob?: Writable<number | string>;
    };
  }

  const navigationMap = {
    Home: {
      icon: HomeIcon,
      href: "/typer",
      requires: true,
      mobile: true,
    },
    Notificações: {
      icon: BellIcon,
      href: "/notifications",
      requires: session,
      mobile: true,
      blob: unreadNotifications,
    },
    Mensagens: {
      icon: MailIcon,
      href: "/typos",
      requires: session,
      mobile: true,
    },
    Salvos: {
      icon: BookmarkIcon,
      href: "/bookmarks",
      requires: session,
      mobile: false,
    },
  } as Navigation;

  const sessionRelatedNavigationMap = {
    Perfil: {
      icon: UserIcon,
      href: "/me",
      requires: session,
      mobile: true,
    },
    Configurações: {
      icon: SettingsIcon,
      href: "/settings",
      requires: session,
      mobile: true,
    },
    Entrar: {
      icon: LogInIcon,
      href: "/signin",
      requires: !session,
      mobile: true,
    },
  } as Navigation;

  const mobileNavigation = { ...sessionRelatedNavigationMap, ...navigationMap };

  const navigation = Object.keys(navigationMap) as string[];
  const sessionRelated = Object.keys(sessionRelatedNavigationMap) as string[];

  const defaultClasses =
    "flex flex-col items-start gap-6 px-4 bg-background py-4 border-l-4 border-2 rounded-lg";
  const size = "16";

  function unlockCreator() {
    creator.update((v) => ({ ...v, locked: false }));
  }

  $: creatorAllowed = Object.keys($creator.pathOptions).includes(
    $page.url.pathname as string,
  );

  $: minified = $page.url.pathname === "/typos";
</script>

<!-- mobile navigation -->
<div
  class="fixed lg:hidden pr-2 bottom-4 left-1/2 -translate-x-1/2 w-11/12 z-40 flex items-center flex-col gap-2">
  {#if session && creatorAllowed}
    <Draggable
      snapToOrigin
      minimumHoldTime={150}
      class="lg:hidden self-end rounded-lg border-2 border-b-4 border-r-4 border-black dark:border-zinc-950">
      <button class="aspect-square p-2" on:click={unlockCreator}>
        <EditIcon {size} />
      </button>
    </Draggable>
  {/if}

  <Draggable
    snapToOrigin
    minimumHoldTime={150}
    class="flex justify-between bg-white dark:bg-zinc-850 w-full text-sm rounded-lg border-2 border-b-4  border-black dark:border-zinc-950 px-8 py-3">
    {#each [...navigation, ...sessionRelated] as path}
      {@const nav_item = mobileNavigation[path]}
      {#if nav_item.mobile}
        {#if nav_item.requires}
          <NavigationItem blob={nav_item.blob} href={nav_item.href}>
            <svelte:component this={nav_item.icon} {size} />
          </NavigationItem>
        {/if}
      {/if}
    {/each}
  </Draggable>
</div>

<div
  class="hidden lg:flex {minified
    ? 'w-max basis-24 justify-center'
    : 'flex-1 '} justify-end">
  <div class="flex h-screen justify-end py-8 fixed">
    <div class="w-max h-full flex flex-col justify-between text-sm min-w-[13rem]">
      <div class={defaultClasses}>
        {#each navigation as path}
          {@const nav_item = navigationMap[path]}
          {#if nav_item.requires}
            <NavigationItem
              href={nav_item.href}
              text={minified ? "" : path}
              blob={nav_item.blob}>
              <svelte:component this={nav_item.icon} {size} />
            </NavigationItem>
          {/if}
        {/each}
      </div>

      <div class="{defaultClasses} ">
        {#each sessionRelated as path}
          {@const nav_item = sessionRelatedNavigationMap[path]}
          {#if nav_item.mobile}
            {#if nav_item.requires}
              <NavigationItem
                blob={nav_item.blob}
                href={nav_item.href}
                text={minified ? "" : path}>
                <svelte:component this={nav_item.icon} {size} />
              </NavigationItem>
            {/if}
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>
