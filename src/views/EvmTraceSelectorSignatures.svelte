<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		selectorHex,
	}: {
		selectorHex: `0x${string}`
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const evmSelector = useEntity(
		EntityType.EvmSelector,
		{ hex: selectorHex },
		{
			$: [Source.Openchain_Rest],
			signatures: {},
		},
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<ResourceBoundary
	resource={evmSelector}
	placeholderText=""
>
	{#snippet children(selector)}
		{#if selector.signatures?.length}
			<code data-row="wrap gap-1">
				{#each selector.signatures as signature (signature)}
					<span>{signature}</span>
				{/each}
			</code>
			<span> · </span>
		{/if}
	{/snippet}
</ResourceBoundary>
