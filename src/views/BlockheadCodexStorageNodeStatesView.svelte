<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Codex storage node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadCodexStorageNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCodexStorageNodeState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				peerId: true,
				connectionId: true,
				endpoint: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCodexStorageNodeState })}
		{@const blockheadCodexStorageNodeStateSelector = blockheadCodexStorageNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCodexStorageNodeState}
			entitySelector={blockheadCodexStorageNodeStateSelector}
		>
			{#snippet Title()}
				{blockheadCodexStorageNodeStateSelector.peerId || 'blockhead codex storage node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadCodexStorageNodeStateSelector.connectionId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCodexStorageNodeState.endpoint ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
