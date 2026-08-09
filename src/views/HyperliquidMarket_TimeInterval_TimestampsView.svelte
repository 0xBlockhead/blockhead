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
	}: EntityListViewProps<EntityType.HyperliquidMarket_TimeInterval_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidMarketTimeIntervalTimestamp })}
		{@const hyperliquidMarketTimeIntervalTimestampSelector = hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.Selector]}
		{@const network = hyperliquidMarketTimeIntervalTimestampSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
			entitySelector={hyperliquidMarketTimeIntervalTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/market/[marketKey=stringSegment]/interval/[intervalValue=nonNegativeInteger]/[intervalUnit=stringSegment]/observations/[timestampMs=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						marketKey: hyperliquidMarketTimeIntervalTimestampSelector.marketKey,
						intervalValue: String(hyperliquidMarketTimeIntervalTimestampSelector.timeInterval.value),
						intervalUnit: hyperliquidMarketTimeIntervalTimestampSelector.timeInterval.unit,
						timestampMs: String(hyperliquidMarketTimeIntervalTimestampSelector.timestampMs),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
