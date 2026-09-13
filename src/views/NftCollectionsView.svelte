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
	}: EntityListViewProps<EntityType.NftCollection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NftCollection}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: nftCollection })}
		{@const nftCollectionSelector = nftCollection[EntityMetaKey.Selector]}
		{@const assetInstance = nftCollectionSelector.$assetInstance}
		<EntityView
			entityType={EntityType.NftCollection}
			entitySelector={nftCollectionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/collection',
					{
						network: (
							assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
