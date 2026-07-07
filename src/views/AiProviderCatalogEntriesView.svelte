<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'AI provider catalog entries',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiProviderCatalogEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AiProviderCatalogEntry>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AiProviderCatalogEntryView from '$/views/AiProviderCatalogEntryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
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
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AiProviderCatalogEntry}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(aiProviderCatalogEntries)}
			{@const uniqueAiProviderCatalogEntries = [...new Map(aiProviderCatalogEntries.values.map((aiProviderCatalogEntry) => [aiProviderCatalogEntry[EntityMetaKey.SelectorKey], aiProviderCatalogEntry])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AiProviderCatalogEntry}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={aiProviderCatalogEntries.totalCount}
				getKey={(aiProviderCatalogEntry) => aiProviderCatalogEntry[EntityMetaKey.SelectorKey]}
				items={uniqueAiProviderCatalogEntries}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AI provider catalog entries yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: aiProviderCatalogEntry }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AiProviderCatalogEntry> })}
					{@const aiProviderCatalogEntryFields = { ...aiProviderCatalogEntry[EntityMetaKey.Selector], ...aiProviderCatalogEntry }}
					<AiProviderCatalogEntryView
						selection={select(EntityType.AiProviderCatalogEntry, aiProviderCatalogEntry[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={aiProviderCatalogEntryFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.AiProviderCatalogEntry}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
