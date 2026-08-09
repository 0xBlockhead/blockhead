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
	}: EntityListViewProps<EntityType.ElementsAsset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsAsset_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					issuedAmount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: elementsAssetTimestamp })}
		{@const elementsAssetTimestampSelector = elementsAssetTimestamp[EntityMetaKey.Selector]}
		{@const asset = elementsAssetTimestampSelector.$asset}
		<EntityView
			entityType={EntityType.ElementsAsset_Timestamp}
			entitySelector={elementsAssetTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/asset/[assetId=stringSegment]/(elementsAsset)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in asset.$network.$network ?
								caip2StringFromValue(asset.$network.$network.caip2)
							:
								asset.$network.$network.slug
						),
						assetId: asset.assetId,
						timestampMs: String(elementsAssetTimestampSelector.timestampMs),
						source: elementsAssetTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{elementsAssetTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{elementsAssetTimestamp.issuedAmount ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
