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
		title = 'Derivative observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_Derivative_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market_Derivative_Timestamp>
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
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
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
					markPrice: true,
					indexPrice: true,
					fundingRate: true,
					$market: true,
					$base: true,
					$quote: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Derivative_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(marketDerivativeTimestamps)}
			{@const uniqueMarketDerivativeTimestamps = [...new Map(marketDerivativeTimestamps.values.map((marketDerivativeTimestamp) => [marketDerivativeTimestamp[EntityMetaKey.SelectorKey], marketDerivativeTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Derivative_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={marketDerivativeTimestamps.totalCount}
				getKey={(marketDerivativeTimestamp) => marketDerivativeTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMarketDerivativeTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Market derivative observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketDerivativeTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market_Derivative_Timestamp> })}
					{@const marketDerivativeTimestampFields = { ...marketDerivativeTimestamp[EntityMetaKey.Selector], ...marketDerivativeTimestamp }}
					{@const marketDerivativeTimestampHrefFields = { ...marketDerivativeTimestamp, ...marketDerivativeTimestamp[EntityMetaKey.Selector] }}
					<Market_Derivative_TimestampView
						selection={select(EntityType.Market_Derivative_Timestamp, marketDerivativeTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={marketDerivativeTimestampFields}
						href={
							(marketDerivativeTimestampHrefFields.$market !== undefined && marketDerivativeTimestampHrefFields.$market.marketKind !== undefined && marketDerivativeTimestampHrefFields.$market.$base !== undefined && marketDerivativeTimestampHrefFields.$market.$base.assetKey !== undefined && marketDerivativeTimestampHrefFields.$market.$quote !== undefined && marketDerivativeTimestampHrefFields.$market.$quote.assetKey !== undefined && marketDerivativeTimestampHrefFields.$market.$marketVenue !== undefined && marketDerivativeTimestampHrefFields.$market.$marketVenue.marketVenueId !== undefined && marketDerivativeTimestampHrefFields.$base !== undefined && marketDerivativeTimestampHrefFields.$base.kind !== undefined && marketDerivativeTimestampHrefFields.$quote !== undefined && marketDerivativeTimestampHrefFields.$quote.kind !== undefined && marketDerivativeTimestampHrefFields.timestampMs !== undefined && marketDerivativeTimestampHrefFields.feedKey !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
								marketKind: String(marketDerivativeTimestampHrefFields.$market.marketKind ?? ''),
								base: String(marketDerivativeTimestampHrefFields.$market.$base.assetKey ?? ''),
								quote: String(marketDerivativeTimestampHrefFields.$market.$quote.assetKey ?? ''),
								marketVenue: String(marketDerivativeTimestampHrefFields.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(marketDerivativeTimestampHrefFields.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketDerivativeTimestampHrefFields.$quote.kind)] ?? ''),
								timestampMs: String(marketDerivativeTimestampHrefFields.timestampMs ?? ''),
								feedKey: String(marketDerivativeTimestampHrefFields.feedKey ?? ''),
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
		entityType={EntityType.Market_Derivative_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
