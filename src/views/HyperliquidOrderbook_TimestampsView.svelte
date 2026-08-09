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
	}: EntityListViewProps<EntityType.HyperliquidOrderbook_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidOrderbook_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidOrderbookTimestamp })}
		{@const hyperliquidOrderbookTimestampSelector = hyperliquidOrderbookTimestamp[EntityMetaKey.Selector]}
		{@const network = hyperliquidOrderbookTimestampSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidOrderbook_Timestamp}
			entitySelector={hyperliquidOrderbookTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/orderbook/[bookKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						bookKey: hyperliquidOrderbookTimestampSelector.bookKey,
						timestampMs: String(hyperliquidOrderbookTimestampSelector.timestampMs),
						source: hyperliquidOrderbookTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
