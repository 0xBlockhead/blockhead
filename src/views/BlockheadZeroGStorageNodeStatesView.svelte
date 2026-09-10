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
		title = 'Blockhead 0G storage node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZeroGStorageNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStorageNodeState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				nodeId: true,
				$network: {
					fields: {
						name: true,
						environment: true,
					},
				},
				connectionId: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZeroGStorageNodeState })}
		{@const blockheadZeroGStorageNodeStateSelector = blockheadZeroGStorageNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZeroGStorageNodeState}
			entitySelector={blockheadZeroGStorageNodeStateSelector}
			href={
				resolve(
					'/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]',
					{
						slug: blockheadZeroGStorageNodeStateSelector.$network.slug,
						connectionId: blockheadZeroGStorageNodeStateSelector.connectionId,
						nodeId: blockheadZeroGStorageNodeStateSelector.nodeId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadZeroGStorageNodeStateSelector.nodeId || 'blockhead zero g storage node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadZeroGStorageNodeState.$network.name || 'zero g network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZeroGStorageNodeStateSelector.connectionId}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
