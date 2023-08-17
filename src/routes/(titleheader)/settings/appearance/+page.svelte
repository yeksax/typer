<script lang="ts">
  import { page } from "$app/stores";
  import Preference from "$lib/components/settings/preference.svelte";
  import { MonitorIcon, MoonIcon, SunIcon } from "svelte-feather-icons";
  import type { PageData } from "./$types";
  import Select from "$lib/components/select/select.svelte";
  import { theme } from "$lib/stores";
  import type { Preferences } from "@prisma/client";
  import axios from "axios";

  const size = "28";

  async function handleTheme(new_theme: string) {
    theme.set(new_theme as Preferences["theme"]);
    await axios.post("/api/user/preferences", { theme: new_theme });
  }
</script>

<div class="flex flex-col gap-2">
  <Preference>
    <span class="w-8 grid place-items-center" slot="icon">
      {#if $theme === "DARK"}
        <MoonIcon class="dark:fill-white fill-black stroke-none" {size} />
      {:else if $theme === "LIGHT"}
        <SunIcon class="dark:fill-white fill-black" {size} />
      {:else}
        <MonitorIcon
          class="dark:stroke-white stroke-black"
          size={(parseInt(size) * 0.8).toString()} />
      {/if}
    </span>
    <span slot="title" class="font-semibold">Tema</span>

    <Select
      slot="value"
      action={handleTheme}
      title="Selecione um tema"
      value={$theme}
      values={[
        { label: "Escuro", value: "DARK" },
        { label: "Claro", value: "LIGHT" },
        { label: "Seguir o sistema", value: "SYSTEM_DEFAULT" },
      ]} />
      
    <p slot="description" class="text-xs opacity-75">
      Ajuste o tema de acordo com seu gosto visual
    </p>
  </Preference>
</div>

<!-- <a
  href={item.href}
  class={twMerge(
    "w-full px-4 md:px-6 py-3 md:py-4 transition-all hover:bg-zinc-50 border-2 border-b-4 dark:bg-zinc-850 dark:hover:bg-zinc-800 rounded-lg border-black dark:border-zinc-950 gap-4 flex items-center",
    `${item.class}`
  )}>
  <svelte:component this={item.icon} />

  <div class="flex flex-col gap-0.5">
    <h3 class="text-sm">{path}</h3>
    <p class="text-xs opacity-75">{item.description}</p>
  </div>
</a> -->
