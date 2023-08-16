<script lang="ts">
  import { page } from "$app/stores";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import {
    BellIcon,
    BookmarkIcon,
    HomeIcon,
    LogInIcon,
    MailIcon,
    SettingsIcon,
  } from "svelte-feather-icons";
  import Draggable from "../draggable.svelte";
  import NavigationItem from "./navigation-item.svelte";

  const defaultClasses =
    "flex flex-col items-start gap-6 px-8 bg-white dark:bg-zinc-850 py-4 border-l-4 border-2 border-black dark:border-zinc-950 rounded-md";
  const size = "16";

  $: data = $page.data;
</script>

<!-- mobile navigation -->
<div class="fixed lg:hidden bottom-4 left-0 w-full z-40 flex justify-center">
  <Draggable
    snapToOrigin
    class="flex justify-between bg-white dark:bg-zinc-850 w-11/12 mr-2 text-sm rounded-lg border-b-4 border-2 border-black dark:border-zinc-950 px-8 py-3">
    <NavigationItem href="/typer"><HomeIcon {size} /></NavigationItem>
    {#if data.session}
      <NavigationItem href="/notifications"><BellIcon {size} /></NavigationItem>
      <NavigationItem href="/typos"><MailIcon {size} /></NavigationItem>
      <NavigationItem href="/settings"><SettingsIcon {size} /></NavigationItem>
      <NavigationItem href="/profile">
        <img
          src={data.user.avatar}
          width="20"
          height="20"
          class="w-4 h-4 rounded-sm"
          alt="" />
      </NavigationItem>
    {:else}
      <NavigationItem href="/signin"><LogInIcon {size} /></NavigationItem>
    {/if}
  </Draggable>
</div>

<div class="hidden lg:flex flex-1 justify-end">
  <div
    class="flex h-screen justify-end py-8 border-black dark:border-zinc-950 fixed">
    <div class="w-max h-full flex flex-col justify-between text-sm pr-4">
      <div class={defaultClasses}>
        <NavigationItem text="Home" href="/typer"
          ><HomeIcon {size} /></NavigationItem>
        {#if data.session}
          <NavigationItem text="Notificações" href="/notifications"
            ><BellIcon {size} /></NavigationItem>
          <NavigationItem text="Mensagens" href="/typos"
            ><MailIcon {size} /></NavigationItem>
          <NavigationItem text="Salvos" href="/bookmarks"
            ><BookmarkIcon {size} /></NavigationItem>
        {/if}
      </div>

      <div class="{defaultClasses} ">
        {#if data.session}
          <NavigationItem text="Perfil" href="/profile">
            <img
              src={data.user.avatar}
              width="20"
              height="20"
              class="w-4 h-4 rounded-sm"
              alt="" />
          </NavigationItem>
          <NavigationItem text="Configurações" href="/settings"
            ><SettingsIcon {size} /></NavigationItem>
        {:else}
          <NavigationItem text="Login" href="/signin"
            ><LogInIcon {size} /></NavigationItem>
        {/if}
      </div>
    </div>
  </div>
</div>
