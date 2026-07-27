<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead 0G stored chunks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZeroGStoredChunk> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStoredChunk}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				dataRoot: true,
				chunkIndex: true,
				present: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZeroGStoredChunk })}
		{@const blockheadZeroGStoredChunkSelector = blockheadZeroGStoredChunk[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZeroGStoredChunk}
			entitySelector={blockheadZeroGStoredChunkSelector}
		>
			{#snippet Title()}
				{blockheadZeroGStoredChunkSelector.dataRoot || 'blockhead zero g stored chunk'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadZeroGStoredChunkSelector.chunkIndex)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadZeroGStoredChunk.present)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
