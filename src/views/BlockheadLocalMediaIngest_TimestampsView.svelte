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
		title = 'Local media ingest observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLocalMediaIngest_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLocalMediaIngest_Timestamp>
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
	import BlockheadLocalMediaIngest_TimestampView from '$/views/BlockheadLocalMediaIngest_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLocalMediaIngest_Timestamp}
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
				status: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadLocalMediaIngestTimestamps) => [...new Map(blockheadLocalMediaIngestTimestamps.values.map((blockheadLocalMediaIngestTimestamp) => [blockheadLocalMediaIngestTimestamp[EntityMetaKey.SelectorKey], blockheadLocalMediaIngestTimestamp])).values()]}
	getKey={(blockheadLocalMediaIngestTimestamp) => blockheadLocalMediaIngestTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Local media ingest observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLocalMediaIngestTimestamp })}
		{@const blockheadLocalMediaIngestTimestampFields = { ...blockheadLocalMediaIngestTimestamp[EntityMetaKey.Selector], ...blockheadLocalMediaIngestTimestamp }}
		{@const selection = select(EntityType.BlockheadLocalMediaIngest_Timestamp, blockheadLocalMediaIngestTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLocalMediaIngest_TimestampView
			selection={selection}
			prefetched={blockheadLocalMediaIngestTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
