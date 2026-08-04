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
	}: EntityListViewProps<EntityType.A2aTask> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aTask}
	bind:open
	resource={
		selection({
			fields: {
				taskId: true,
				contextId: true,
				providerTaskId: true,
				updatedAt: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aTask })}
		<EntityView
			entityType={EntityType.A2aTask}
			entitySelector={a2aTask[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{a2aTask.taskId || (a2aTask.providerTaskId ?? '') || 'A2A task'}
			{/snippet}

			{#snippet Value()}
				{a2aTask.contextId ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aTask.updatedAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
