<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Radicle node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRadicleNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleNodeState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				nodeId: true,
				did: true,
				connectionId: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRadicleNodeState })}
		{@const blockheadRadicleNodeStateSelector = blockheadRadicleNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadRadicleNodeState}
			entitySelector={blockheadRadicleNodeStateSelector}
		>
			{#snippet Title()}
				{blockheadRadicleNodeStateSelector.nodeId || 'blockhead radicle node state'}
			{/snippet}

			{#snippet Value()}
				{(blockheadRadicleNodeState.did ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadRadicleNodeStateSelector.connectionId}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
