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
	import NumberValue from '$/components/NumberValue.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slowGwei: true,
				averageGwei: true,
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
							'caip2' in network ?
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
				{[
					evmNetworkGasEstimateTimestamp.slowGwei != null ? `slow ${evmNetworkGasEstimateTimestamp.slowGwei}` : '',
					evmNetworkGasEstimateTimestamp.averageGwei != null ? `avg ${evmNetworkGasEstimateTimestamp.averageGwei}` : '',
					evmNetworkGasEstimateTimestamp.fastGwei != null ? `fast ${evmNetworkGasEstimateTimestamp.fastGwei}` : '',
				].filter(Boolean).join(' · ') || 'EVM network gas estimate timestamp'}
			{/snippet}

			{#snippet Value()}
				{#if evmNetworkGasEstimateTimestamp.fastGwei != null}
					<NumberValue value={evmNetworkGasEstimateTimestamp.fastGwei} />
					<span> gwei</span>
					{#if evmNetworkGasEstimateTimestamp.averageGwei != null || evmNetworkGasEstimateTimestamp.slowGwei != null}
						<span data-text="muted">
							({[
								evmNetworkGasEstimateTimestamp.averageGwei != null ? `avg ${evmNetworkGasEstimateTimestamp.averageGwei}` : '',
								evmNetworkGasEstimateTimestamp.slowGwei != null ? `slow ${evmNetworkGasEstimateTimestamp.slowGwei}` : '',
							].filter(Boolean).join(' · ')})
						</span>
					{/if}
				{:else if evmNetworkGasEstimateTimestamp.averageGwei != null}
					<NumberValue value={evmNetworkGasEstimateTimestamp.averageGwei} />
					<span> gwei</span>
				{:else if evmNetworkGasEstimateTimestamp.slowGwei != null}
					<NumberValue value={evmNetworkGasEstimateTimestamp.slowGwei} />
					<span> gwei</span>
				{/if}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">
					<Timestamp timestamp={evmNetworkGasEstimateTimestampSelector.timestampMs} />
					<span> · {evmNetworkGasEstimateTimestampSelector.source}</span>
				</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
