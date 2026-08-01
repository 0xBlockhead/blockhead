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
	}: EntityListViewProps<EntityType.A2aArtifact> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aArtifact}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				$task: {
					fields: {
						taskId: true,
						contextId: true,
						providerTaskId: true,
						updatedAt: true,
					},
				},
				artifactId: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aArtifact })}
		{@const a2aArtifactSelector = a2aArtifact[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aArtifact}
			entitySelector={a2aArtifactSelector}
		>
			{#snippet Title()}
				{(a2aArtifact.name ?? '') || a2aArtifactSelector.artifactId || 'A2A artifact'}
			{/snippet}

			{#snippet Value()}
				{a2aArtifactSelector.$task.taskId || (a2aArtifactSelector.$task.providerTaskId ?? '') || 'A2A task'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aArtifact.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
