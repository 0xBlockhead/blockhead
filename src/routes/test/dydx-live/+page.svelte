<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	const timestamps = select(
		EntityType.DydxChainNetwork,
		{
			$network: {
				caip2: {
					namespace: 'cosmos',
					reference: 'dydx-mainnet-1',
				},
			},
		}
	).$$timestamps({
		sources: [
			Source.DydxIndexer,
		],
		fields: {
			blockHeight: true,
		},
	})


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<h1>dYdX live resource proof</h1>

<p data-testid="dydx-live-direct-timestamp">
	{timestamps.current?.values[0]?.[EntityMetaKey.Selector].timestampMs ?? ''}
</p>

<ResourceBoundary
	resource={timestamps}
	placeholderText="Loading dYdX live timestamp"
>
	{#snippet children(result)}
		<p data-testid="dydx-live-boundary-timestamp">
			{result.values[0]?.[EntityMetaKey.Selector].timestampMs ?? ''}
		</p>
	{/snippet}
</ResourceBoundary>
