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
	}: EntityListViewProps<EntityType.HyperliquidPerpMarket_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidPerpMarket_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$perpMarket: true,
					maxLeverage: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidPerpMarketTimestamp })}
		{@const hyperliquidPerpMarketTimestampSelector = hyperliquidPerpMarketTimestamp[EntityMetaKey.Selector]}
		{@const perpMarket = hyperliquidPerpMarketTimestampSelector.$perpMarket}
		<EntityView
			entityType={EntityType.HyperliquidPerpMarket_Timestamp}
			entitySelector={hyperliquidPerpMarketTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/perp-market/[coin=stringSegment]/(hyperliquidPerpMarket)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in perpMarket.$network ?
								caip2StringFromValue(perpMarket.$network.caip2)
							:
								perpMarket.$network.slug
						),
						coin: perpMarket.coin,
						timestampMs: String(hyperliquidPerpMarketTimestampSelector.timestampMs),
						source: hyperliquidPerpMarketTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{hyperliquidPerpMarketTimestampSelector.$perpMarket.coin || 'hyperliquid perp market'}
			{/snippet}

			{#snippet Value()}
				{hyperliquidPerpMarketTimestamp.maxLeverage ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
