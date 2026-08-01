<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Radicle seed observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRadicleSeedObservation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				nodeId: true,
				timestampMs: true,
				$repository: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRadicleSeedObservationTimestamp })}
		{@const blockheadRadicleSeedObservationTimestampSelector = blockheadRadicleSeedObservationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
			entitySelector={blockheadRadicleSeedObservationTimestampSelector}
		>
			{#snippet Title()}
				{blockheadRadicleSeedObservationTimestampSelector.nodeId || 'blockhead radicle seed observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadRadicleSeedObservationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">radicle repository</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
