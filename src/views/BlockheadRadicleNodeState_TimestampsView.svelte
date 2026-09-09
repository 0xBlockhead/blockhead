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
		title = 'Blockhead Radicle node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRadicleNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				alias: true,
				nodeVersion: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRadicleNodeStateTimestamp })}
		{@const blockheadRadicleNodeStateTimestampSelector = blockheadRadicleNodeStateTimestamp[EntityMetaKey.Selector]}
		{@const nodeState = blockheadRadicleNodeStateTimestampSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadRadicleNodeState_Timestamp}
			entitySelector={blockheadRadicleNodeStateTimestampSelector}
			href={
				resolve(
					'/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]/(blockheadRadicleNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						connectionId: nodeState.connectionId,
						nodeId: nodeState.nodeId,
						timestampMs: String(blockheadRadicleNodeStateTimestampSelector.timestampMs),
						source: blockheadRadicleNodeStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadRadicleNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(blockheadRadicleNodeStateTimestamp.alias ?? ''), (blockheadRadicleNodeStateTimestamp.nodeVersion ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadRadicleNodeStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
