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
	}: EntityListViewProps<EntityType.TonNftCollection_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftCollection_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftCollectionTimestamp })}
		{@const tonNftCollectionTimestampSelector = tonNftCollectionTimestamp[EntityMetaKey.Selector]}
		{@const collection = tonNftCollectionTimestampSelector.$collection}
		<EntityView
			entityType={EntityType.TonNftCollection_Timestamp}
			entitySelector={tonNftCollectionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-collection/[collectionAddress=stringSegment]/(tonNftCollection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							collection.$network.caip2 !== undefined ?
								caip2StringFromValue(collection.$network.caip2)
							:
								collection.$network.slug
						),
						collectionAddress: collection.collectionAddress,
						timestampMs: String(tonNftCollectionTimestampSelector.timestampMs),
						source: tonNftCollectionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON NFT collection timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
