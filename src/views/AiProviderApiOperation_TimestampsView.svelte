<!-- Generated from APP.ts. Do not edit by hand. -->

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
		})
	}
>
	{#snippet Item({ item: aiProviderApiOperationTimestamp })}
		{@const aiProviderApiOperationTimestampSelector = aiProviderApiOperationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiProviderApiOperation_Timestamp}
			entitySelector={aiProviderApiOperationTimestampSelector}
		>
			{#snippet Title()}
				{(aiProviderApiOperationTimestamp.$operation.label ?? '') || aiProviderApiOperationTimestampSelector.$operation.operationId || 'AI provider API operation'}
			{/snippet}

			{#snippet Value()}
				{(aiProviderApiOperationTimestamp.availabilityStatus ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(aiProviderApiOperationTimestamp.error ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
