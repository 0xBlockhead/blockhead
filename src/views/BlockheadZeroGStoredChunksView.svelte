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
			...{
				fields: {
					dataRoot: true,
					chunkIndex: true,
					present: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadZeroGStoredChunk })}
		{@const blockheadZeroGStoredChunkSelector = blockheadZeroGStoredChunk[EntityMetaKey.Selector]}
		{@const nodeState = blockheadZeroGStoredChunkSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadZeroGStoredChunk}
			entitySelector={blockheadZeroGStoredChunkSelector}
			href={
				resolve(
					'/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]/(blockheadZeroGStorageNodeState)/chunk/[dataRoot=stringSegment]/[chunkIndex=nonNegativeInteger]',
					{
						slug: nodeState.$network.slug,
						connectionId: nodeState.connectionId,
						nodeId: nodeState.nodeId,
						dataRoot: blockheadZeroGStoredChunkSelector.dataRoot,
						chunkIndex: String(blockheadZeroGStoredChunkSelector.chunkIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadZeroGStoredChunkSelector.dataRoot || 'blockhead zero g stored chunk'}
			{/snippet}

			{#snippet Value()}
				{blockheadZeroGStoredChunkSelector.chunkIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZeroGStoredChunk.present}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
