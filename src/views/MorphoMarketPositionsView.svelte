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
	}: EntityListViewProps<EntityType.MorphoMarketPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MorphoMarketPosition}
	bind:open
	resource={
		selection({
			fields: {
				$market: true,
				supplyAssets: true,
				borrowAssets: true,
				collateral: true,
			},
		})
	}
>
	{#snippet Item({ item: morphoMarketPosition })}
		{@const morphoMarketPositionSelector = morphoMarketPosition[EntityMetaKey.Selector]}
		{@const market = morphoMarketPositionSelector.$market}
		<EntityView
			entityType={EntityType.MorphoMarketPosition}
			entitySelector={morphoMarketPositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-market/[marketId=evmTxHash]/(morphoMarket)/position/[accountAddress=evmAddress]',
					{
						network: (
							'caip2' in market.$network ?
								caip2StringFromValue(market.$network.caip2)
							:
								market.$network.slug
						),
						marketId: market.marketId,
						accountAddress: morphoMarketPositionSelector.$account.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{morphoMarketPositionSelector.$market.marketId || 'Morpho market'}
			{/snippet}

			{#snippet Value()}
				{[morphoMarketPosition.supplyAssets, morphoMarketPosition.borrowAssets, morphoMarketPosition.collateral].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
