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
	}: EntityListViewProps<EntityType.TonNftCollection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftCollection}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftCollection })}
		{@const tonNftCollectionSelector = tonNftCollection[EntityMetaKey.Selector]}
		{@const network = tonNftCollectionSelector.$network}
		<EntityView
			entityType={EntityType.TonNftCollection}
			entitySelector={tonNftCollectionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-collection/[collectionAddress=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						collectionAddress: tonNftCollectionSelector.collectionAddress,
					}
				)
			}
		>
			{#snippet Title()}
				TON NFT collection
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
