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
	}: EntityListViewProps<EntityType.ZeroGStorageNode_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGStorageNode_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$storageNode: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGStorageNodeTimestamp })}
		{@const zeroGStorageNodeTimestampSelector = zeroGStorageNodeTimestamp[EntityMetaKey.Selector]}
		{@const storageNode = zeroGStorageNodeTimestampSelector.$storageNode}
		<EntityView
			entityType={EntityType.ZeroGStorageNode_Timestamp}
			entitySelector={zeroGStorageNodeTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-node/[nodeId=evmAddress]/(zeroGStorageNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in storageNode.$network ?
								caip2StringFromValue(storageNode.$network.caip2)
							:
								storageNode.$network.slug
						),
						nodeId: storageNode.nodeId,
						timestampMs: String(zeroGStorageNodeTimestampSelector.timestampMs),
						source: zeroGStorageNodeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				zero g storage node
			{/snippet}

			{#snippet Value()}
				{zeroGStorageNodeTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
