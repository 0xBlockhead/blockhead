<script lang="ts">
	// Context
	import { getIsInsidePage } from '$/context/isInsidePage.ts'

	const isInsidePage = getIsInsidePage()

	import { getHeadingLevel } from '$/context/headingLevel.ts'


	// State
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { Snippet } from 'svelte'

	let {
		children,
		...elementProps
	}: WithRest<
		{
			children?: Snippet
		},
		SvelteHTMLElements['h1']
	> = $props()
</script>


{#if isInsidePage}
	<svelte:element
		this={`h${Math.min(6, Math.max(1, getHeadingLevel()))}`}
		{...elementProps}
	>
		{#if children}
			{@render children()}
		{/if}
	</svelte:element>
{:else}
	<span
		class="breadcrumb-segment"
		aria-current="page"
	>
		{#if children}
			{@render children()}
		{/if}
	</span>
{/if}
