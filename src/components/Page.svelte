<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	// Context
	import { setIsInsidePage } from '$/context/isInsidePage.ts'


	// State
	let {
		children,
	}: {
		children?: Snippet
	} = $props()


	// Inner context
	setIsInsidePage(true)
</script>


<main
	data-column-item="flexible"
	data-column
>
	{#if children}
		{@render children()}
	{/if}
</main>
