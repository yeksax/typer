<script lang="ts">
	export let href: string;
	export let text: string = "";
</script>

<a class="flex items-center gap-4 hover:font-medium transition-all duration-100 hover:translate-x-0.5 w-full" {href}>
	<slot />
  {text}
</a>
