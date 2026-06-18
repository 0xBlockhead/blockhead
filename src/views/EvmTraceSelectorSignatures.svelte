<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selectorHex,
	}: {
		selectorHex: `0x${string}`
	} = $props()

	


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<ResourceBoundary
	resource={select(
			EntityType.EvmSelector,
			{ hex: selectorHex },
			{
				sources: [
					Source.Openchain_Rest,
				],
			},
		).signatures}
	placeholderText=""
>
	{#snippet children(signatures)}
		{#if signatures?.length}
			<code data-row="wrap gap-1">
				{#each signatures as signature (signature)}
					<span>{signature}</span>
				{/each}
			</code>
			<span> · </span>
		{/if}
	{/snippet}
</ResourceBoundary>
