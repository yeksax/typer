<script lang="ts">
  import { signOut } from "@auth/sveltekit/client";
  import {
    BellIcon,
    LogOutIcon,
    UserIcon,
    ZapIcon,
  } from "svelte-feather-icons";
  import type { PageData } from "./$types";
  import { twMerge } from "tailwind-merge";

  const navigationMap = {
    Perfil: {
      icon: UserIcon,
      href: "/settings/profile",
      description:
        "Ajuste suas preferências pessoais e compartilhe informações úteis",
      class: "",
    },
    Aparência: {
      icon: ZapIcon,
      href: "/settings/appearance",
      description:
        "Personalize a interface do aplicativo para se adequar ao seu estilo",
      class: "",
    },
    Notificações: {
      icon: BellIcon,
      href: "/settings/notifications",
      description: "Gerencie como e quando deseja receber alertas importantes",
      class: "",
    },
    Desconectar: {
      icon: LogOutIcon,
      href: "/signout",
      description: "Encerre a sessão... até mais </3",
      class: "text-red-500",
    },
  } as const;

  const navigation = Object.keys(
    navigationMap
  ) as (keyof typeof navigationMap)[];
</script>

<div class="flex flex-col gap-2">
  {#each navigation as path}
    {@const item = navigationMap[path]}
      <a
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
      </a>
  {/each}
</div>
