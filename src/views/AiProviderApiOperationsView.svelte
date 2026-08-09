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
	}: EntityListViewProps<EntityType.AiProviderApiOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiProviderApiOperation}
	bind:open
	resource={
		selection({
			...{
				fields: {
					label: true,
					operationKind: true,
					operationId: true,
					pathTemplate: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiProviderApiOperation })}
		{@const aiProviderApiOperationSelector = aiProviderApiOperation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiProviderApiOperation}
			entitySelector={aiProviderApiOperationSelector}
			href={
				'providerId' in aiProviderApiOperationSelector.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/operation/[operationId=stringSegment]',
						{
							providerId: aiProviderApiOperationSelector.$provider.providerId,
							operationId: aiProviderApiOperationSelector.operationId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{(aiProviderApiOperation.label ?? '') || aiProviderApiOperationSelector.operationId || 'AI provider API operation'}
			{/snippet}

			{#snippet Value()}
				{aiProviderApiOperation.operationKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiProviderApiOperation.pathTemplate ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
