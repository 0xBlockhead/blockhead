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
	}: EntityListViewProps<EntityType.HyperliquidSpotAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidSpotAsset}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					assetId: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidSpotAsset })}
		{@const hyperliquidSpotAssetSelector = hyperliquidSpotAsset[EntityMetaKey.Selector]}
		{@const network = hyperliquidSpotAssetSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidSpotAsset}
			entitySelector={hyperliquidSpotAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/spot-asset/[assetId=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						assetId: String(hyperliquidSpotAssetSelector.assetId),
					}
				)
			}
		>
			{#snippet Title()}
				{(hyperliquidSpotAsset.name ?? '') || String(hyperliquidSpotAssetSelector.assetId) || 'hyperliquid spot asset'}
			{/snippet}

			{#snippet Value()}
				{hyperliquidSpotAssetSelector.assetId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hyperliquidSpotAsset.$network.name || `${hyperliquidSpotAsset.$network.caip2.namespace}:${hyperliquidSpotAsset.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
