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
		title = 'Perp markets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.HyperliquidPerpMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidPerpMarket}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				coin: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidPerpMarket })}
		{@const hyperliquidPerpMarketSelector = hyperliquidPerpMarket[EntityMetaKey.Selector]}
		{@const network = hyperliquidPerpMarketSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidPerpMarket}
			entitySelector={hyperliquidPerpMarketSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/perp-market/[coin=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						coin: hyperliquidPerpMarketSelector.coin,
					}
				)
			}
		>
			{#snippet Title()}
				{hyperliquidPerpMarketSelector.coin || 'hyperliquid perp market'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hyperliquidPerpMarket.$network.name || (hyperliquidPerpMarket.$network.caip2 == null ? '' : `${hyperliquidPerpMarket.$network.caip2.namespace}:${hyperliquidPerpMarket.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
