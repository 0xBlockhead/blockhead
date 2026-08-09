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
		title = 'dYdX chain market observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainMarket_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainMarket_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: dydxChainMarketTimestamp })}
		{@const dydxChainMarketTimestampSelector = dydxChainMarketTimestamp[EntityMetaKey.Selector]}
		{@const market = dydxChainMarketTimestampSelector.$market}
		<EntityView
			entityType={EntityType.DydxChainMarket_Timestamp}
			entitySelector={dydxChainMarketTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(dydx)/market/[ticker=stringSegment]/(dydxChainMarket)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in market.$network.$network ?
								caip2StringFromValue(market.$network.$network.caip2)
							:
								market.$network.$network.slug
						),
						ticker: market.ticker,
						timestampMs: String(dydxChainMarketTimestampSelector.timestampMs),
						source: dydxChainMarketTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{dydxChainMarketTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainMarketTimestamp.status ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
