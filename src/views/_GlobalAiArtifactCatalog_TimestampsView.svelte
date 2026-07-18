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
		title = 'global AI artifact catalog observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalAiArtifactCatalog_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalAiArtifactCatalog_Timestamp>
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
	import GlobalAiArtifactCatalog_TimestampView from '$/views/_GlobalAiArtifactCatalog_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
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
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
	getResourceItems={(globalAiArtifactCatalogTimestamps) => [...new Map(globalAiArtifactCatalogTimestamps.values.map((globalAiArtifactCatalogTimestamp) => [globalAiArtifactCatalogTimestamp[EntityMetaKey.SelectorKey], globalAiArtifactCatalogTimestamp])).values()]}
	getKey={(globalAiArtifactCatalogTimestamp) => globalAiArtifactCatalogTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global AI artifact catalog observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalAiArtifactCatalogTimestamp })}
		{@const globalAiArtifactCatalogTimestampFields = { ...globalAiArtifactCatalogTimestamp[EntityMetaKey.Selector], ...globalAiArtifactCatalogTimestamp }}
		{@const selection = select(EntityType._GlobalAiArtifactCatalog_Timestamp, globalAiArtifactCatalogTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<GlobalAiArtifactCatalog_TimestampView
			selection={selection}
			prefetched={globalAiArtifactCatalogTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
