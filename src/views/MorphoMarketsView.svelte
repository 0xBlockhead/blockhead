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
	}: EntityListViewProps<EntityType.MorphoMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MorphoMarket}
	bind:open
	resource={
		selection({
			fields: {
				marketId: true,
				lltvWad: true,
				utilization: true,
				supplyApy: true,
				borrowApy: true,
				totalSupplyAssets: true,
				totalBorrowAssets: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: morphoMarket })}
		{@const morphoMarketSelector = morphoMarket[EntityMetaKey.Selector]}
		{@const network = morphoMarketSelector.$network}
		<EntityView
			entityType={EntityType.MorphoMarket}
			entitySelector={morphoMarketSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-market/[marketId=evmTxHash]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						marketId: morphoMarketSelector.marketId,
					}
				)
			}
		>
			{#snippet Title()}
				{morphoMarketSelector.marketId || 'Morpho market'}
			{/snippet}

			{#snippet Value()}
				{[morphoMarket.lltvWad, String(morphoMarket.utilization ?? ''), String(morphoMarket.supplyApy ?? ''), String(morphoMarket.borrowApy ?? ''), (morphoMarket.totalSupplyAssets ?? ''), (morphoMarket.totalBorrowAssets ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{morphoMarket.$network.name || (morphoMarket.$network.caip2 == null ? '' : `${morphoMarket.$network.caip2.namespace}:${morphoMarket.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
