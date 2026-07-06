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
		title = 'Blockhead Codex stored data observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCodexStoredData_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadCodexStoredData_Timestamp>
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
	import BlockheadCodexStoredData_TimestampView from '$/views/BlockheadCodexStoredData_TimestampView.svelte'
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
					downloadStatus: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadCodexStoredData_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadCodexStoredDataTimestamps)}
			{@const uniqueBlockheadCodexStoredDataTimestamps = [...new Map(blockheadCodexStoredDataTimestamps.values.map((blockheadCodexStoredDataTimestamp) => [blockheadCodexStoredDataTimestamp[EntityMetaKey.SelectorKey], blockheadCodexStoredDataTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadCodexStoredData_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadCodexStoredDataTimestamps.totalCount}
				getKey={(blockheadCodexStoredDataTimestamp) => blockheadCodexStoredDataTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadCodexStoredDataTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead codex stored data observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadCodexStoredDataTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadCodexStoredData_Timestamp> })}
					{@const blockheadCodexStoredDataTimestampFields = { ...blockheadCodexStoredDataTimestamp[EntityMetaKey.Selector], ...blockheadCodexStoredDataTimestamp }}
					<BlockheadCodexStoredData_TimestampView
						selection={select(EntityType.BlockheadCodexStoredData_Timestamp, blockheadCodexStoredDataTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadCodexStoredDataTimestampFields}
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
		entityType={EntityType.BlockheadCodexStoredData_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
