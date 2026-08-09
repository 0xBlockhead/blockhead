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
	}: EntityListViewProps<EntityType.AiModelProvider> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiModelProvider}
	bind:open
	resource={
		selection({
			...{
				fields: {
					label: true,
					organizationKind: true,
					providerId: true,
					domain: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiModelProvider })}
		{@const aiModelProviderSelector = aiModelProvider[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiModelProvider}
			entitySelector={aiModelProviderSelector}
			href={
				'providerId' in aiModelProviderSelector ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]',
						{
							providerId: aiModelProviderSelector.providerId,
						}
					)
				:
					'domain' in aiModelProviderSelector ?
						resolve(
							'/(ai)/ai/provider/domain/[domain=stringSegment]',
							{
								domain: aiModelProviderSelector.domain,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{(aiModelProvider.label ?? '') || [aiModelProvider.providerId, aiModelProvider.domain].filter(Boolean).join(' ') || 'AI model provider'}
			{/snippet}

			{#snippet Value()}
				{aiModelProvider.organizationKind ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
