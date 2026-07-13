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
		title = 'Local media ingest observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLocalMediaIngest_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLocalMediaIngest_Timestamp>
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
	import BlockheadLocalMediaIngest_TimestampView from '$/views/BlockheadLocalMediaIngest_TimestampView.svelte'
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
					status: true,
					timestampMs: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLocalMediaIngest_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadLocalMediaIngestTimestamps)}
			{@const uniqueBlockheadLocalMediaIngestTimestamps = [...new Map(blockheadLocalMediaIngestTimestamps.values.map((blockheadLocalMediaIngestTimestamp) => [blockheadLocalMediaIngestTimestamp[EntityMetaKey.SelectorKey], blockheadLocalMediaIngestTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLocalMediaIngest_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLocalMediaIngestTimestamps.totalCount}
				getKey={(blockheadLocalMediaIngestTimestamp) => blockheadLocalMediaIngestTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLocalMediaIngestTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Local media ingest observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLocalMediaIngestTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLocalMediaIngest_Timestamp> })}
					{@const blockheadLocalMediaIngestTimestampFields = { ...blockheadLocalMediaIngestTimestamp[EntityMetaKey.Selector], ...blockheadLocalMediaIngestTimestamp }}
					<BlockheadLocalMediaIngest_TimestampView
						selection={select(EntityType.BlockheadLocalMediaIngest_Timestamp, blockheadLocalMediaIngestTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadLocalMediaIngestTimestampFields}
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
		entityType={EntityType.BlockheadLocalMediaIngest_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
