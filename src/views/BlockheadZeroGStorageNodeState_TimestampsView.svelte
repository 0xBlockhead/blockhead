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
		title = 'Blockhead 0G storage node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZeroGStorageNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStorageNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					$nodeState: {
						fields: {
							$network: {
								fields: {
									name: true,
									environment: true,
								},
							},
						},
					},
					localChunkCount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadZeroGStorageNodeStateTimestamp })}
		{@const blockheadZeroGStorageNodeStateTimestampSelector = blockheadZeroGStorageNodeStateTimestamp[EntityMetaKey.Selector]}
		{@const nodeState = blockheadZeroGStorageNodeStateTimestampSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadZeroGStorageNodeState_Timestamp}
			entitySelector={blockheadZeroGStorageNodeStateTimestampSelector}
			href={
				resolve(
					'/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]/(blockheadZeroGStorageNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						slug: nodeState.$network.slug,
						connectionId: nodeState.connectionId,
						nodeId: nodeState.nodeId,
						timestampMs: String(blockheadZeroGStorageNodeStateTimestampSelector.timestampMs),
						source: blockheadZeroGStorageNodeStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadZeroGStorageNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadZeroGStorageNodeStateTimestampSelector.$nodeState.nodeId || 'blockhead zero g storage node state'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZeroGStorageNodeStateTimestamp.localChunkCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
