<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Radicle node inventory observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRadicleNodeInventory_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					status: true,
					timestampMs: true,
					repositoryCount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadRadicleNodeInventoryTimestamp })}
		{@const blockheadRadicleNodeInventoryTimestampSelector = blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector]}
		{@const node = blockheadRadicleNodeInventoryTimestampSelector.$node}
		<EntityView
			entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
			entitySelector={blockheadRadicleNodeInventoryTimestampSelector}
			href={
				resolve(
					'/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]/(blockheadRadicleNodeState)/inventory/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						connectionId: node.connectionId,
						nodeId: node.nodeId,
						timestampMs: String(blockheadRadicleNodeInventoryTimestampSelector.timestampMs),
						source: blockheadRadicleNodeInventoryTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadRadicleNodeInventoryTimestamp.status || 'blockhead radicle node inventory timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadRadicleNodeInventoryTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadRadicleNodeInventoryTimestamp.repositoryCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
