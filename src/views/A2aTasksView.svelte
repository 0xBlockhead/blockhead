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
		{@const a2aTaskSelector = a2aTask[EntityMetaKey.Selector]}
		{@const service = a2aTaskSelector.$service}
		<EntityView
			entityType={EntityType.A2aTask}
			entitySelector={a2aTaskSelector}
			href={
				a2aTaskSelector.providerTaskId !== undefined
				&& service !== undefined ?
					resolve(
						'/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/service/[protocolBinding=stringSegment]/[endpointUrl=absoluteUrl]/(a2aAgentService)/task/[providerTaskId=stringSegment]',
						{
							agentCardUrl: encodeURIComponent(service.$card.agentCardUrl),
							protocolBinding: service.protocolBinding,
							endpointUrl: encodeURIComponent(service.endpointUrl),
							providerTaskId: a2aTaskSelector.providerTaskId,
						}
					)
				:
					a2aTaskSelector.taskId !== undefined ?
						resolve(
							'/(agents)/agents/a2a/task/[taskId=stringSegment]',
							{
								taskId: a2aTaskSelector.taskId,
							}
						)
					:
						undefined
			}
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
