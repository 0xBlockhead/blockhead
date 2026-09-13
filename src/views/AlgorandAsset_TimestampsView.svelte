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
	}: EntityListViewProps<EntityType.AlgorandAsset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAsset_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandAssetTimestamp })}
		{@const algorandAssetTimestampSelector = algorandAssetTimestamp[EntityMetaKey.Selector]}
		{@const asset = algorandAssetTimestampSelector.$asset}
		<EntityView
			entityType={EntityType.AlgorandAsset_Timestamp}
			entitySelector={algorandAssetTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/asset/[assetId=nonNegativeBigInt]/(algorandAsset)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							asset.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(asset.$network.$network.caip2)
							:
								asset.$network.$network.slug
						),
						assetId: String(asset.assetId),
						round: String(algorandAssetTimestampSelector.round),
						source: algorandAssetTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
