<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'AI provider catalog entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiProviderCatalogEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AiProviderCatalogEntry>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AiProviderCatalogEntryView from '$/views/AiProviderCatalogEntryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiProviderCatalogEntry}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				entryLabel: true,
				catalogKind: true,
				providerEntryId: true,
				subjectKind: true,
			},
		})
	}
	getResourceItems={(aiProviderCatalogEntries) => [...new Map(aiProviderCatalogEntries.values.map((aiProviderCatalogEntry) => [aiProviderCatalogEntry[EntityMetaKey.SelectorKey], aiProviderCatalogEntry])).values()]}
	getKey={(aiProviderCatalogEntry) => aiProviderCatalogEntry[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI provider catalog entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiProviderCatalogEntry })}
		{@const aiProviderCatalogEntryFields = { ...aiProviderCatalogEntry[EntityMetaKey.Selector], ...aiProviderCatalogEntry }}
		{@const selection = select(EntityType.AiProviderCatalogEntry, aiProviderCatalogEntry[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AiProviderCatalogEntryView
			selection={selection}
			prefetched={aiProviderCatalogEntryFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
