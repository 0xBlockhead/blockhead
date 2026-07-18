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
		title = 'AI provider catalog entry observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiProviderCatalogEntry_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AiProviderCatalogEntry_Timestamp>
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
	import AiProviderCatalogEntry_TimestampView from '$/views/AiProviderCatalogEntry_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiProviderCatalogEntry_Timestamp}
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
				$entry: true,
				timestampMs: true,
				availabilityStatus: true,
			},
		})
	}
	getResourceItems={(aiProviderCatalogEntryTimestamps) => [...new Map(aiProviderCatalogEntryTimestamps.values.map((aiProviderCatalogEntryTimestamp) => [aiProviderCatalogEntryTimestamp[EntityMetaKey.SelectorKey], aiProviderCatalogEntryTimestamp])).values()]}
	getKey={(aiProviderCatalogEntryTimestamp) => aiProviderCatalogEntryTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI provider catalog entry observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiProviderCatalogEntryTimestamp })}
		{@const aiProviderCatalogEntryTimestampFields = { ...aiProviderCatalogEntryTimestamp[EntityMetaKey.Selector], ...aiProviderCatalogEntryTimestamp }}
		{@const selection = select(EntityType.AiProviderCatalogEntry_Timestamp, aiProviderCatalogEntryTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AiProviderCatalogEntry_TimestampView
			selection={selection}
			prefetched={aiProviderCatalogEntryTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
