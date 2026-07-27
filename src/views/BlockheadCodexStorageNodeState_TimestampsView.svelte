<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		<EntityView
			entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
			entitySelector={blockheadCodexStorageNodeStateTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadCodexStorageNodeStateTimestampSelector.timestampMs) || 'blockhead codex storage node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{(blockheadCodexStorageNodeStateTimestamp.version ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadCodexStorageNodeStateTimestamp.peerCount ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
