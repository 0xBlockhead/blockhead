<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				engineState: true,
				latestFrameNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumNodeStateTimestamp })}
		{@const blockheadQuilibriumNodeStateTimestampSelector = blockheadQuilibriumNodeStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
			entitySelector={blockheadQuilibriumNodeStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadQuilibriumNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumNodeStateTimestamp.engineState ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadQuilibriumNodeStateTimestamp.latestFrameNumber ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
