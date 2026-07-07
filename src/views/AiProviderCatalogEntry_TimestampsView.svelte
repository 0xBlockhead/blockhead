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
		title = 'AI provider catalog entry observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiProviderCatalogEntry_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AiProviderCatalogEntry_Timestamp>
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
	import AiProviderCatalogEntry_TimestampView from '$/views/AiProviderCatalogEntry_TimestampView.svelte'
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
					$entry: true,
					timestampMs: true,
					availabilityStatus: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AiProviderCatalogEntry_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(aiProviderCatalogEntryTimestamps)}
			{@const uniqueAiProviderCatalogEntryTimestamps = [...new Map(aiProviderCatalogEntryTimestamps.values.map((aiProviderCatalogEntryTimestamp) => [aiProviderCatalogEntryTimestamp[EntityMetaKey.SelectorKey], aiProviderCatalogEntryTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AiProviderCatalogEntry_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={aiProviderCatalogEntryTimestamps.totalCount}
				getKey={(aiProviderCatalogEntryTimestamp) => aiProviderCatalogEntryTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAiProviderCatalogEntryTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AI provider catalog entry observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: aiProviderCatalogEntryTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AiProviderCatalogEntry_Timestamp> })}
					{@const aiProviderCatalogEntryTimestampFields = { ...aiProviderCatalogEntryTimestamp[EntityMetaKey.Selector], ...aiProviderCatalogEntryTimestamp }}
					<AiProviderCatalogEntry_TimestampView
						selection={select(EntityType.AiProviderCatalogEntry_Timestamp, aiProviderCatalogEntryTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={aiProviderCatalogEntryTimestampFields}
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
		entityType={EntityType.AiProviderCatalogEntry_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
