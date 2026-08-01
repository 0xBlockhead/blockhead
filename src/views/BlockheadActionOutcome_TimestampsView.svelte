<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadActionOutcome_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionOutcome_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				status: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadActionOutcomeTimestamp })}
		{@const blockheadActionOutcomeTimestampSelector = blockheadActionOutcomeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadActionOutcome_Timestamp}
			entitySelector={blockheadActionOutcomeTimestampSelector}
		>
			{#snippet Title()}
				{blockheadActionOutcomeTimestamp.status || 'blockhead action outcome timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadActionOutcomeTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadActionOutcomeTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
