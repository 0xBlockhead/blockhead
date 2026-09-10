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
	}: EntityListViewProps<EntityType.A2aMessagePart> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aMessagePart}
	bind:open
	resource={
		selection({
			fields: {
				partIndex: true,
				partKind: true,
				mimeType: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aMessagePart })}
		{@const a2aMessagePartSelector = a2aMessagePart[EntityMetaKey.Selector]}
		{@const message = a2aMessagePartSelector.$message}
		{@const artifact = a2aMessagePartSelector.$artifact}
		<EntityView
			entityType={EntityType.A2aMessagePart}
			entitySelector={a2aMessagePartSelector}
			href={
				'$artifact' in a2aMessagePartSelector
				&& 'taskId' in artifact.$task ?
					resolve(
						'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/artifact/[artifactId=stringSegment]/(a2aArtifact)/part/[partIndex=nonNegativeInteger]',
						{
							taskId: artifact.$task.taskId,
							artifactId: artifact.artifactId,
							partIndex: String(a2aMessagePartSelector.partIndex),
						}
					)
				:
					'$message' in a2aMessagePartSelector
					&& 'taskId' in message.$task ?
						resolve(
							'/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/message/[messageId=stringSegment]/(a2aMessage)/part/[partIndex=nonNegativeInteger]',
							{
								taskId: message.$task.taskId,
								messageId: message.messageId,
								partIndex: String(a2aMessagePartSelector.partIndex),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{a2aMessagePartSelector.partIndex}
			{/snippet}

			{#snippet Value()}
				{a2aMessagePart.partKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aMessagePart.mimeType ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
