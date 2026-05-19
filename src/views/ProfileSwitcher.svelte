<script lang="ts">
	// Types/constants
	// Shell for nav profile/session switching (consumers pass optional Content snippet).
	import type { Snippet } from 'svelte'


	// Props
	let {
		children,
	}: {
		children?: Snippet
	} = $props()
</script>


<div
	data-row="align-center"
	aria-label="Profile and session"
>
	{#if children}
		{@render children()}
	{/if}
</div>
