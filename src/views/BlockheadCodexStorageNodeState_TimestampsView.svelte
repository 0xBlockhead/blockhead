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
		title = 'Blockhead Codex storage node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadCodexStorageNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				version: true,
				peerCount: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCodexStorageNodeStateTimestamp })}
		{@const blockheadCodexStorageNodeStateTimestampSelector = blockheadCodexStorageNodeStateTimestamp[EntityMetaKey.Selector]}
		{@const nodeState = blockheadCodexStorageNodeStateTimestampSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
			entitySelector={blockheadCodexStorageNodeStateTimestampSelector}
			href={
				resolve(
					'/~/codex/connection/[connectionId=stringSegment]/node/[peerId=stringSegment]/(blockheadCodexStorageNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						connectionId: nodeState.connectionId,
						peerId: nodeState.peerId,
						timestampMs: String(blockheadCodexStorageNodeStateTimestampSelector.timestampMs),
						source: blockheadCodexStorageNodeStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadCodexStorageNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadCodexStorageNodeStateTimestamp.version ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCodexStorageNodeStateTimestamp.peerCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
