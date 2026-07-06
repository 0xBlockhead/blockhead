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
		title = 'global AI artifact catalog observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalAiArtifactCatalog_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalAiArtifactCatalog_Timestamp>
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
	import GlobalAiArtifactCatalog_TimestampView from '$/views/_GlobalAiArtifactCatalog_TimestampView.svelte'
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
					timestampMs: true,
					status: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalAiArtifactCatalogTimestamps)}
			{@const uniqueGlobalAiArtifactCatalogTimestamps = [...new Map(globalAiArtifactCatalogTimestamps.values.map((globalAiArtifactCatalogTimestamp) => [globalAiArtifactCatalogTimestamp[EntityMetaKey.SelectorKey], globalAiArtifactCatalogTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalAiArtifactCatalogTimestamps.totalCount}
				getKey={(globalAiArtifactCatalogTimestamp) => globalAiArtifactCatalogTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalAiArtifactCatalogTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Global AI artifact catalog observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalAiArtifactCatalogTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalAiArtifactCatalog_Timestamp> })}
					{@const globalAiArtifactCatalogTimestampFields = { ...globalAiArtifactCatalogTimestamp[EntityMetaKey.Selector], ...globalAiArtifactCatalogTimestamp }}
					<GlobalAiArtifactCatalog_TimestampView
						selection={select(EntityType._GlobalAiArtifactCatalog_Timestamp, globalAiArtifactCatalogTimestamp[EntityMetaKey.Selector])}
						prefetched={globalAiArtifactCatalogTimestampFields}
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
		entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
