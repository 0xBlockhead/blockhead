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
	}: EntityListViewProps<EntityType.TonNftItem> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftItem}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftItem })}
		{@const tonNftItemSelector = tonNftItem[EntityMetaKey.Selector]}
		{@const network = tonNftItemSelector.$network}
		{@const collection = tonNftItemSelector.$collection}
		<EntityView
			entityType={EntityType.TonNftItem}
			entitySelector={tonNftItemSelector}
			href={
				tonNftItemSelector.itemIndex !== undefined
				&& collection !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-collection/[collectionAddress=stringSegment]/(tonNftCollection)/item/[itemIndex=nonNegativeBigInt]',
						{
							network: (
								collection.$network.caip2 !== undefined ?
									caip2StringFromValue(collection.$network.caip2)
								:
									collection.$network.slug
							),
							collectionAddress: collection.collectionAddress,
							itemIndex: String(tonNftItemSelector.itemIndex),
						}
					)
				:
					tonNftItemSelector.itemAddress !== undefined
					&& network !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-item/[itemAddress=stringSegment]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								itemAddress: tonNftItemSelector.itemAddress,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				TON NFT item
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
