<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	// Context
	import { setIsInsidePage } from '$/context/isInsidePage.ts'

	setIsInsidePage(true)


	// Props
	let {
		children,
	}: {
		children?: Snippet
	} = $props()
</script>


<main data-column>
	{#if children}
		{@render children()}
	{/if}
</main>
