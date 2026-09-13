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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.A2aTaskEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aTaskEvent}
	bind:open
	resource={
		selection({
			fields: {
				sequence: true,
				eventKind: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aTaskEvent })}
		{@const a2aTaskEventSelector = a2aTaskEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aTaskEvent}
			entitySelector={a2aTaskEventSelector}
			href={
				a2aTaskEventSelector.$task.taskId !== undefined ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/event/[sequence=nonNegativeInteger]',
						{
							taskId: a2aTaskEventSelector.$task.taskId,
							sequence: String(a2aTaskEventSelector.sequence),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{a2aTaskEventSelector.sequence}
			{/snippet}

			{#snippet Value()}
				{a2aTaskEvent.eventKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aTaskEvent.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
