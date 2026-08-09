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
	}: EntityListViewProps<EntityType.AiProviderApiOperation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiProviderApiOperation_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$operation: {
						fields: {
							label: true,
							operationKind: true,
							pathTemplate: true,
						},
					},
					availabilityStatus: true,
					error: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiProviderApiOperationTimestamp })}
		{@const aiProviderApiOperationTimestampSelector = aiProviderApiOperationTimestamp[EntityMetaKey.Selector]}
		{@const operation = aiProviderApiOperationTimestampSelector.$operation}
		<EntityView
			entityType={EntityType.AiProviderApiOperation_Timestamp}
			entitySelector={aiProviderApiOperationTimestampSelector}
			href={
				'providerId' in operation.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/operation/[operationId=stringSegment]/(aiProviderApiOperation)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							providerId: operation.$provider.providerId,
							operationId: operation.operationId,
							timestampMs: String(aiProviderApiOperationTimestampSelector.timestampMs),
							source: aiProviderApiOperationTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{(aiProviderApiOperationTimestamp.$operation.label ?? '') || aiProviderApiOperationTimestampSelector.$operation.operationId || 'AI provider API operation'}
			{/snippet}

			{#snippet Value()}
				{aiProviderApiOperationTimestamp.availabilityStatus ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiProviderApiOperationTimestamp.error ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
