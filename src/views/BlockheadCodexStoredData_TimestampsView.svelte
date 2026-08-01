<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Codex stored data observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadCodexStoredData_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCodexStoredData_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				downloadStatus: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCodexStoredDataTimestamp })}
		{@const blockheadCodexStoredDataTimestampSelector = blockheadCodexStoredDataTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCodexStoredData_Timestamp}
			entitySelector={blockheadCodexStoredDataTimestampSelector}
		>
			{#snippet Title()}
				{blockheadCodexStoredDataTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadCodexStoredDataTimestamp.downloadStatus ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCodexStoredDataTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
