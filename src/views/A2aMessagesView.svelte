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
	}: EntityListViewProps<EntityType.A2aMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aMessage}
	bind:open
	resource={
		selection({
			...{
				fields: {
					messageId: true,
					role: true,
					createdAt: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: a2aMessage })}
		{@const a2aMessageSelector = a2aMessage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aMessage}
			entitySelector={a2aMessageSelector}
			href={
				'taskId' in a2aMessageSelector.$task ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/message/[messageId=stringSegment]',
						{
							taskId: a2aMessageSelector.$task.taskId,
							messageId: a2aMessageSelector.messageId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{a2aMessageSelector.messageId || 'A2A message'}
			{/snippet}

			{#snippet Value()}
				{a2aMessage.role}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aMessage.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
