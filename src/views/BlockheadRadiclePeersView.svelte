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
		title = 'Blockhead Radicle peers',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRadiclePeer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadiclePeer}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				peerNodeId: true,
				connectionKind: true,
				remoteAlias: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRadiclePeer })}
		{@const blockheadRadiclePeerSelector = blockheadRadiclePeer[EntityMetaKey.Selector]}
		{@const node = blockheadRadiclePeerSelector.$node}
		<EntityView
			entityType={EntityType.BlockheadRadiclePeer}
			entitySelector={blockheadRadiclePeerSelector}
			href={
				resolve(
					'/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]/(blockheadRadicleNodeState)/peer/[peerNodeId=stringSegment]',
					{
						connectionId: node.connectionId,
						nodeId: node.nodeId,
						peerNodeId: blockheadRadiclePeerSelector.peerNodeId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadRadiclePeerSelector.peerNodeId || 'blockhead radicle peer'}
			{/snippet}

			{#snippet Value()}
				{blockheadRadiclePeer.connectionKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadRadiclePeer.remoteAlias ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
