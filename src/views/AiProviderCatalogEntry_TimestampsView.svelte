<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiProviderCatalogEntry_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				$entry: {
					fields: {
						entryLabel: true,
						subjectKind: true,
					},
				},
				timestampMs: true,
				availabilityStatus: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.AiProviderCatalogEntry_Timestamp}
			entitySelector={aiProviderCatalogEntryTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((aiProviderCatalogEntryTimestampFields.$entry.entryLabel) ?? '')].filter(Boolean).join(' ') || [String((aiProviderCatalogEntryTimestampFields.$entry.providerEntryId) ?? '')].filter(Boolean).join(' ') || 'AI provider catalog entry'].filter(Boolean).join(' ') || 'AI provider catalog entry timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((aiProviderCatalogEntryTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiProviderCatalogEntryTimestampFields.availabilityStatus) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
