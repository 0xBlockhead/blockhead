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
		title = 'Blockhead Waku node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWakuNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWakuNodeState}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					nodeId: true,
					connectionId: true,
					endpoint: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadWakuNodeState })}
		{@const blockheadWakuNodeStateSelector = blockheadWakuNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWakuNodeState}
			entitySelector={blockheadWakuNodeStateSelector}
			href={
				resolve(
					'/~/waku/connection/[connectionId=stringSegment]/node-state/[nodeId=stringSegment]',
					{
						connectionId: blockheadWakuNodeStateSelector.connectionId,
						nodeId: blockheadWakuNodeStateSelector.nodeId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWakuNodeStateSelector.nodeId || 'blockhead waku node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadWakuNodeStateSelector.connectionId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadWakuNodeState.endpoint ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
