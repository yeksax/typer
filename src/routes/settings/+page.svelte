<script lang="ts">
  import { LogOutIcon } from "svelte-feather-icons";
import type { PageData } from "./$types";
  import { signOut } from "@auth/sveltekit/client";

  export let data: PageData;
</script>

<button 
  on:click={()=>signOut()}
class="flex items-center text-red-500 gap-6 dark:bg-zinc-800 px-8 border-2 border-black dark:border-zinc-950 rounded-lg py-2">
  <LogOutIcon size="16" />
  Desconectar
</button>