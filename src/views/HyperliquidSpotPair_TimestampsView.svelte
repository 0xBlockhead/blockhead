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
	}: EntityListViewProps<EntityType.HyperliquidSpotPair_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidSpotPair_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidSpotPairTimestamp })}
		{@const hyperliquidSpotPairTimestampSelector = hyperliquidSpotPairTimestamp[EntityMetaKey.Selector]}
		{@const spotPair = hyperliquidSpotPairTimestampSelector.$spotPair}
		<EntityView
			entityType={EntityType.HyperliquidSpotPair_Timestamp}
			entitySelector={hyperliquidSpotPairTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/spot-pair/[pairIndex=nonNegativeInteger]/(hyperliquidSpotPair)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in spotPair.$network ?
								caip2StringFromValue(spotPair.$network.caip2)
							:
								spotPair.$network.slug
						),
						pairIndex: String(spotPair.pairIndex),
						timestampMs: String(hyperliquidSpotPairTimestampSelector.timestampMs),
						source: hyperliquidSpotPairTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
