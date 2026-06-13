<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selectorHex,
	}: {
		selectorHex: `0x${string}`
	} = $props()

	const evmSelector = subscribe(EntityType.EvmSelector,
		{ hex: selectorHex },
		({ sources: [Source.Openchain_Rest], fields: { signatures: true } }),
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<ResourceBoundary
	resource={evmSelector}
	placeholderText=""
>
	{#snippet children(selector)}
		{#if selector.fields.signatures?.length}
			<code data-row="wrap gap-1">
				{#each selector.fields.signatures as signature (signature)}
					<span>{signature}</span>
				{/each}
			</code>
			<span> · </span>
		{/if}
	{/snippet}
</ResourceBoundary>
