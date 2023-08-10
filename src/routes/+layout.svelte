<script lang="ts">
	import { page } from "$app/stores";
	import type { PageData } from "./$types";
	import "$lib/globals.scss";

	export let data: PageData;

	let theme = "";

	$: if (
		(data.theme === "SYSTEM_DEFAULT" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches) ||
		data.theme === "DARK"
	) {
		theme = "dark";
	} else {
		theme = "";
	}
</script>

<svelte:head>
	{#if $page.data.metadata}
		{#if $page.data.metadata.title}
			<title>{$page.data.metadata.title} | Typer</title>
		{/if}
	{:else}
		<title>Typer</title>
	{/if}
</svelte:head>

<div class="h-full {theme}">
	<slot />

	<button on:click={() => (data.theme = "DARK")}>modo escuro</button>
	<button on:click={() => (data.theme = "LIGHT")}>modo claro</button>
	<button on:click={() => (data.theme = "SYSTEM_DEFAULT")}>automatico</button>
</div>
