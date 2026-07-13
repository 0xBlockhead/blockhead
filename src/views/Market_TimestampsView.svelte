<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Spot stream',
		typeAnnotationParagraphs = ['A point-in-time market quote or metric observation.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market_Timestamp>
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
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
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
					feedKey: true,
					price: true,
					timestampMs: true,
					$market: true,
					$base: true,
					$quote: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(marketTimestamps)}
			{@const uniqueMarketTimestamps = [...new Map(marketTimestamps.values.map((marketTimestamp) => [marketTimestamp[EntityMetaKey.SelectorKey], marketTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={marketTimestamps.totalCount}
				getKey={(marketTimestamp) => marketTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMarketTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Market observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market_Timestamp> })}
					{@const marketTimestampFields = { ...marketTimestamp[EntityMetaKey.Selector], ...marketTimestamp }}
					{@const marketTimestampHrefFields = { ...marketTimestamp, ...marketTimestamp[EntityMetaKey.Selector] }}
					<Market_TimestampView
						selection={select(EntityType.Market_Timestamp, marketTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={marketTimestampFields}
						href={
							(marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.marketKind !== undefined && marketTimestampHrefFields.$market.$base !== undefined && marketTimestampHrefFields.$market.$base.assetKey !== undefined && marketTimestampHrefFields.$market.$quote !== undefined && marketTimestampHrefFields.$market.$quote.assetKey !== undefined && marketTimestampHrefFields.$market.$marketVenue !== undefined && marketTimestampHrefFields.$market.$marketVenue.marketVenueId !== undefined && marketTimestampHrefFields.$base !== undefined && marketTimestampHrefFields.$base.kind !== undefined && marketTimestampHrefFields.$quote !== undefined && marketTimestampHrefFields.$quote.kind !== undefined && marketTimestampHrefFields.timestampMs !== undefined && marketTimestampHrefFields.feedKey !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
								marketKind: String(marketTimestampHrefFields.$market.marketKind ?? ''),
								base: String(marketTimestampHrefFields.$market.$base.assetKey ?? ''),
								quote: String(marketTimestampHrefFields.$market.$quote.assetKey ?? ''),
								marketVenue: String(marketTimestampHrefFields.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(marketTimestampHrefFields.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketTimestampHrefFields.$quote.kind)] ?? ''),
								timestampMs: String(marketTimestampHrefFields.timestampMs ?? ''),
								feedKey: String(marketTimestampHrefFields.feedKey ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.Market_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
