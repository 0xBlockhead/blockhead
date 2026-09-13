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
	}: EntityListViewProps<EntityType.TonNftItem_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftItem_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftItemTimestamp })}
		{@const tonNftItemTimestampSelector = tonNftItemTimestamp[EntityMetaKey.Selector]}
		{@const item = tonNftItemTimestampSelector.$item}
		<EntityView
			entityType={EntityType.TonNftItem_Timestamp}
			entitySelector={tonNftItemTimestampSelector}
			href={
				item.itemAddress !== undefined
				&& item.$network !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-item/[itemAddress=stringSegment]/(tonNftItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: (
								item.$network.caip2 !== undefined ?
									caip2StringFromValue(item.$network.caip2)
								:
									item.$network.slug
							),
							itemAddress: item.itemAddress,
							timestampMs: String(tonNftItemTimestampSelector.timestampMs),
							source: tonNftItemTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				TON NFT item timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
