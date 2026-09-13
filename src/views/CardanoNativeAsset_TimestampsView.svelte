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
	}: EntityListViewProps<EntityType.CardanoNativeAsset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoNativeAsset_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoNativeAssetTimestamp })}
		{@const cardanoNativeAssetTimestampSelector = cardanoNativeAssetTimestamp[EntityMetaKey.Selector]}
		{@const asset = cardanoNativeAssetTimestampSelector.$asset}
		<EntityView
			entityType={EntityType.CardanoNativeAsset_Timestamp}
			entitySelector={cardanoNativeAssetTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-asset/[policyId=stringSegment]/[assetName=stringSegment]/(cardanoNativeAsset)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							asset.$network.caip2 !== undefined ?
								caip2StringFromValue(asset.$network.caip2)
							:
								asset.$network.slug
						),
						policyId: asset.policyId,
						assetName: asset.assetName,
						slot: String(cardanoNativeAssetTimestampSelector.slot),
						source: cardanoNativeAssetTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Cardano native asset timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
