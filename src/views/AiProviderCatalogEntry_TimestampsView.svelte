<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.AiProviderCatalogEntry_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiProviderCatalogEntry_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$entry: {
						fields: {
							entryLabel: true,
							subjectKind: true,
						},
					},
					timestampMs: true,
					availabilityStatus: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiProviderCatalogEntryTimestamp })}
		{@const aiProviderCatalogEntryTimestampSelector = aiProviderCatalogEntryTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiProviderCatalogEntry_Timestamp}
			entitySelector={aiProviderCatalogEntryTimestampSelector}
		>
			{#snippet Title()}
				{(aiProviderCatalogEntryTimestamp.$entry.entryLabel ?? '') || aiProviderCatalogEntryTimestampSelector.$entry.providerEntryId || 'AI provider catalog entry'}
			{/snippet}

			{#snippet Value()}
				{aiProviderCatalogEntryTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiProviderCatalogEntryTimestamp.availabilityStatus ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
