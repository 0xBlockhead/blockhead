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
		title = 'Blockhead Cashu melt quote observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuMeltQuote_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadCashuMeltQuote_Timestamp>
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
	import BlockheadCashuMeltQuote_TimestampView from '$/views/BlockheadCashuMeltQuote_TimestampView.svelte'
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
					state: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadCashuMeltQuoteTimestamps)}
			{@const uniqueBlockheadCashuMeltQuoteTimestamps = [...new Map(blockheadCashuMeltQuoteTimestamps.values.map((blockheadCashuMeltQuoteTimestamp) => [blockheadCashuMeltQuoteTimestamp[EntityMetaKey.SelectorKey], blockheadCashuMeltQuoteTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadCashuMeltQuoteTimestamps.totalCount}
				getKey={(blockheadCashuMeltQuoteTimestamp) => blockheadCashuMeltQuoteTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadCashuMeltQuoteTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead Cashu melt quote observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadCashuMeltQuoteTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadCashuMeltQuote_Timestamp> })}
					{@const blockheadCashuMeltQuoteTimestampFields = { ...blockheadCashuMeltQuoteTimestamp[EntityMetaKey.Selector], ...blockheadCashuMeltQuoteTimestamp }}
					<BlockheadCashuMeltQuote_TimestampView
						selection={select(EntityType.BlockheadCashuMeltQuote_Timestamp, blockheadCashuMeltQuoteTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadCashuMeltQuoteTimestampFields}
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
		entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
