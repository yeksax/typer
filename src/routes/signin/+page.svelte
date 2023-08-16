<script>
  import { signIn } from "@auth/sveltekit/client";
  import { Icon } from "svelte-awesome";
  import { github, google } from "svelte-awesome/icons";
</script>

<div class="grid max-md:place-items-center h-full">
  <div
    class="w-full lg:w-10/12 px-8 py-4 h-fit dark:bg-zinc-800 border-black dark:border-zinc-950 border-2 rounded-lg border-b-4 flex flex-col gap-10 text-sm">
    <div class="flex flex-col gap-1">
      <h1 class="font-bold text-xl">Typer</h1>
      <p class="text-zinc-400">Como prefere se conectar?</p>
    </div>

    <div class="flex flex-col gap-3">
      <button
        on:click={() => signIn("google")}
        class="flex px-6 dark:bg-zinc-750 dark:hover:bg-zinc-900 transition-all py-2 gap-4 items-center rounded-md border-2 border-b-4 border-black dark:border-zinc-950">
        <Icon data={google} scale={1.5} />
        Continuar com Google
      </button>
      <button
        on:click={() => signIn("github")}
        class="flex px-6 dark:bg-zinc-750 py-2 gap-4 dark:hover:bg-zinc-900 transition-all items-center rounded-md border-2 border-b-4 border-black dark:border-zinc-950">
        <Icon data={github} scale={1.5} />
        Continuar com Github
      </button>
    </div>
  </div>
</div>
