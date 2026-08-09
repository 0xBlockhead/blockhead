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
	}: EntityListViewProps<EntityType.AiModel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiModel}
	bind:open
	resource={
		selection({
			...{
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
					providerModelId: true,
					modelFamily: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiModel })}
		{@const aiModelSelector = aiModel[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiModel}
			entitySelector={aiModelSelector}
			href={
				'providerId' in aiModelSelector.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/model/[providerModelId=stringSegment]',
						{
							providerId: aiModelSelector.$provider.providerId,
							providerModelId: aiModelSelector.providerModelId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{(aiModel.label ?? '') || aiModelSelector.providerModelId || 'AI model'}
			{/snippet}

			{#snippet Value()}
				{(aiModel.$provider.label ?? '') || [(aiModel.$provider.providerId ?? ''), (aiModel.$provider.domain ?? '')].filter(Boolean).join(' ') || 'AI model provider'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiModel.modelFamily ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
