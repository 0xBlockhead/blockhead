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
		id = 'AiProviderCatalogEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AiProviderCatalogEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiProviderCatalogEntry}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					entryLabel: true,
					catalogKind: true,
					providerEntryId: true,
					subjectKind: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiProviderCatalogEntry })}
		{@const aiProviderCatalogEntrySelector = aiProviderCatalogEntry[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiProviderCatalogEntry}
			entitySelector={aiProviderCatalogEntrySelector}
			href={
				'providerId' in aiProviderCatalogEntrySelector.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/catalog/[catalogKind=stringSegment]/[providerEntryId=stringSegment]',
						{
							providerId: aiProviderCatalogEntrySelector.$provider.providerId,
							catalogKind: aiProviderCatalogEntrySelector.catalogKind,
							providerEntryId: aiProviderCatalogEntrySelector.providerEntryId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{(aiProviderCatalogEntry.entryLabel ?? '') || aiProviderCatalogEntrySelector.providerEntryId || 'AI provider catalog entry'}
			{/snippet}

			{#snippet Value()}
				{aiProviderCatalogEntrySelector.catalogKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiProviderCatalogEntry.subjectKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
