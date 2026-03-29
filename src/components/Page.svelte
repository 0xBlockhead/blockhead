<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { setIsInsidePage } from '$/context/isInsidePage.ts'


	// State
	setIsInsidePage(true)

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
