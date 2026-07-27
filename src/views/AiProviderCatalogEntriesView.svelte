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
			fields: {
				entryLabel: true,
				catalogKind: true,
				providerEntryId: true,
				subjectKind: true,
			},
		})
	}
>
	{#snippet Item({ item: aiProviderCatalogEntry })}
		{@const aiProviderCatalogEntrySelector = aiProviderCatalogEntry[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiProviderCatalogEntry}
			entitySelector={aiProviderCatalogEntrySelector}
		>
			{#snippet Title()}
				{(aiProviderCatalogEntry.entryLabel ?? '') || aiProviderCatalogEntrySelector.providerEntryId || 'AI provider catalog entry'}
			{/snippet}

			{#snippet Value()}
				{aiProviderCatalogEntrySelector.catalogKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(aiProviderCatalogEntry.subjectKind ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
