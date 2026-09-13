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
		title = 'dYdX chain markets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainMarket}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				ticker: true,
				oraclePrice: true,
				marketKind: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainMarket })}
		{@const dydxChainMarketSelector = dydxChainMarket[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainMarket}
			entitySelector={dydxChainMarketSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(dydx)/market/[ticker=stringSegment]',
					{
						network: (
							dydxChainMarketSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(dydxChainMarketSelector.$network.$network.caip2)
							:
								dydxChainMarketSelector.$network.$network.slug
						),
						ticker: dydxChainMarketSelector.ticker,
					}
				)
			}
		>
			{#snippet Title()}
				{dydxChainMarketSelector.ticker || 'dydx chain market'}
			{/snippet}

			{#snippet Value()}
				{dydxChainMarket.oraclePrice ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{dydxChainMarket.marketKind}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
