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
<Draggable
  snapToOrigin
  class="fixed lg:hidden flex justify-between bg-white left-1/2 bottom-4 -translate-x-1/2 w-11/12 text-sm rounded-lg border-b-4 border-2 border-black dark:border-zinc-950 px-4 py-2">
  <NavigationItem href="/typer"><HomeIcon {size} /></NavigationItem>
  {#if data.session}
    <NavigationItem href="/notifications"><BellIcon {size} /></NavigationItem>
    <NavigationItem href="/typos"><MailIcon {size} /></NavigationItem>
  {/if}
  {#if data.session}
    <NavigationItem href="/profile">
      <img
        src={data.user.avatar}
        width="20"
        height="20"
        class="w-4 h-4 rounded-sm"
        alt="" />
    </NavigationItem>
    <NavigationItem href="/settings"><SettingsIcon {size} /></NavigationItem>
  {:else}
    <NavigationItem href="/signin"><LogInIcon {size} /></NavigationItem>
  {/if}
</Draggable>

<div class="flex-1 flex justify-end">
  <div
    class="hidden md:flex h-screen justify-end py-8 border-black dark:border-zinc-950 fixed">
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
          <button on:click={() => signOut()}> Sair &lt;3 </button>
        {:else}
          <button on:click={() => signIn("github")}>Sign In with GitHub</button>
          <button on:click={() => signIn("google")}>Sign In with Google</button>
          <NavigationItem text="Login" href="/signin"
            ><LogInIcon {size} /></NavigationItem>
        {/if}
      </div>
    </div>
  </div>
</div>
