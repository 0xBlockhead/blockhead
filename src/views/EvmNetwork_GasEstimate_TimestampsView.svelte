<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmNetwork_GasEstimate_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				fastGwei: true,
				timestampMs: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkGasEstimateTimestamp })}
		{@const evmNetworkGasEstimateTimestampSelector = evmNetworkGasEstimateTimestamp[EntityMetaKey.Selector]}
		{@const network = evmNetworkGasEstimateTimestampSelector.$network}
		<EntityView
			entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
			entitySelector={evmNetworkGasEstimateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(evmNetworkGasEstimateTimestampSelector.timestampMs),
						source: evmNetworkGasEstimateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(evmNetworkGasEstimateTimestamp.fastGwei != null ? String(evmNetworkGasEstimateTimestamp.fastGwei) + ' gwei' : ''), String(evmNetworkGasEstimateTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'EVM network gas estimate timestamp'}
			{/snippet}

			{#snippet Value()}
				{evmNetworkGasEstimateTimestamp.fastGwei != null ? evmNetworkGasEstimateTimestamp.fastGwei + ' gwei' : ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkGasEstimateTimestamp.$network.name || (evmNetworkGasEstimateTimestamp.$network.caip2 == null ? '' : `${evmNetworkGasEstimateTimestamp.$network.caip2.namespace}:${evmNetworkGasEstimateTimestamp.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
