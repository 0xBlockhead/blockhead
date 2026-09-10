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
	}: EntityListViewProps<EntityType.A2aTask_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aTask_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				state: true,
				error: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aTaskTimestamp })}
		{@const a2aTaskTimestampSelector = a2aTaskTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aTask_Timestamp}
			entitySelector={a2aTaskTimestampSelector}
			href={
				'taskId' in a2aTaskTimestampSelector.$task ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							taskId: a2aTaskTimestampSelector.$task.taskId,
							timestampMs: String(a2aTaskTimestampSelector.timestampMs),
							source: a2aTaskTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{a2aTaskTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{a2aTaskTimestamp.state ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aTaskTimestamp.error ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
