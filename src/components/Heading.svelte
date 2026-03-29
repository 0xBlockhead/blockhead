<script lang="ts">
	// Context
	import { getIsInsidePage } from '$/context/isInsidePage.ts'
	const isInsidePage = getIsInsidePage()

	import { getHeadingLevel } from '$/context/headingLevel.ts'
	const headingLevel = Math.min(6, Math.max(1, getHeadingLevel()))


	// State
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { Snippet } from 'svelte'
	import type { SvelteHTMLElements } from 'svelte/elements'

	let {
		children,
		...restProps
	}: WithRest<
		{
			children?: Snippet
		},
		SvelteHTMLElements['h1']
	> = $props()
</script>


{#if isInsidePage}
	<svelte:element
		this={'h' + headingLevel}
		{...restProps}
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
