<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		emptyText = 'No dispatch occurrences recorded.',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadActionDispatchOccurrence> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionDispatchOccurrence}
	bind:open
	resource={
		selection({
			...{
				fields: {
					id: true,
					startedAt: true,
				},
			},
		})
	}
	{emptyText}
>
	{#snippet Item({ item: blockheadActionDispatchOccurrence })}
		{@const blockheadActionDispatchOccurrenceSelector = blockheadActionDispatchOccurrence[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadActionDispatchOccurrence}
			entitySelector={blockheadActionDispatchOccurrenceSelector}
		>
			{#snippet Title()}
				{blockheadActionDispatchOccurrenceSelector.id || 'dispatch occurrence'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadActionDispatchOccurrence.startedAt}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
