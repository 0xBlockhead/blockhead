<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Avalanche node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAvalancheNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				nodeVersion: true,
				networkName: true,
				connectedPeerCount: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAvalancheNodeStateTimestamp })}
		{@const blockheadAvalancheNodeStateTimestampSelector = blockheadAvalancheNodeStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
			entitySelector={blockheadAvalancheNodeStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadAvalancheNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(blockheadAvalancheNodeStateTimestamp.nodeVersion ?? ''), (blockheadAvalancheNodeStateTimestamp.networkName ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAvalancheNodeStateTimestamp.connectedPeerCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
