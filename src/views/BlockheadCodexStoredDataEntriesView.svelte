<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Codex stored data',
		open = $bindable(true),
		id = 'BlockheadCodexStoredDataEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadCodexStoredData> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCodexStoredData}
	{id}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				cid: true,
				$nodeState: {
					fields: {
						endpoint: true,
					},
				},
				firstSeenAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCodexStoredData })}
		{@const blockheadCodexStoredDataSelector = blockheadCodexStoredData[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCodexStoredData}
			entitySelector={blockheadCodexStoredDataSelector}
		>
			{#snippet Title()}
				{blockheadCodexStoredDataSelector.cid || 'blockhead codex stored data'}
			{/snippet}

			{#snippet Value()}
				{blockheadCodexStoredDataSelector.$nodeState.peerId || 'blockhead codex storage node state'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCodexStoredData.firstSeenAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
