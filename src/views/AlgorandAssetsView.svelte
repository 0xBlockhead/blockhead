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
	}: EntityListViewProps<EntityType.AlgorandAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAsset}
	bind:open
	resource={
		selection({
			...{
				fields: {
					assetId: true,
					$network: true,
					creator: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: algorandAsset })}
		{@const algorandAssetSelector = algorandAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AlgorandAsset}
			entitySelector={algorandAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/asset/[assetId=nonNegativeBigInt]',
					{
						network: (
							'caip2' in algorandAssetSelector.$network.$network ?
								caip2StringFromValue(algorandAssetSelector.$network.$network.caip2)
							:
								algorandAssetSelector.$network.$network.slug
						),
						assetId: String(algorandAssetSelector.assetId),
					}
				)
			}
		>
			{#snippet Title()}
				{algorandAssetSelector.assetId}
			{/snippet}

			{#snippet Value()}
				algorand network
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{algorandAsset.creator ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
