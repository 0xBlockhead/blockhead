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
	}: EntityListViewProps<EntityType.AiModel_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiModel_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				providerDisplayName: true,
				availabilityStatus: true,
				$model: {
					fields: {
						label: true,
						$provider: {
							fields: {
								label: true,
								organizationKind: true,
								providerId: true,
								domain: true,
							},
						},
						modelFamily: true,
					},
				},
				providerLifecycleStatus: true,
			},
		})
	}
>
	{#snippet Item({ item: aiModelTimestamp })}
		{@const aiModelTimestampSelector = aiModelTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiModel_Timestamp}
			entitySelector={aiModelTimestampSelector}
		>
			{#snippet Title()}
				{(aiModelTimestamp.providerDisplayName ?? '') || (aiModelTimestamp.$model.label ?? '') || aiModelTimestampSelector.$model.providerModelId || 'AI model'}
			{/snippet}

			{#snippet Value()}
				{aiModelTimestamp.availabilityStatus ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiModelTimestamp.providerLifecycleStatus ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
