<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'OHLC',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading OHLC candles...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_TimeInterval_Timestamps-list',
		timeInterval,
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Market_TimeInterval_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
			timeInterval?: unknown
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
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Candles sit on interval boundaries: open, high, low, close for each bucket start.
	</p>

	<p>
		Candles load from every declared OHLC provider on the parent market row (Coingecko, Coinpaprika, CoinMarketCap, …).
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: [
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.Coinpaprika_OpenApi,
				Source.CoinMarketCap_Rest,
			],
			fields: {
				timeInterval: true,
				close: true,
				timestampMs: true,
				$market: true,
				$base: true,
				$quote: true,
			},
			limit: 4096,
		})
	}
	getResourceItems={(marketTimeIntervalTimestamps) => [...new Map(marketTimeIntervalTimestamps.values.filter((marketTimeIntervalTimestamp) => (timeInterval == null || (marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit === timeInterval.unit && marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value === timeInterval.value))).map((marketTimeIntervalTimestamp) => [marketTimeIntervalTimestamp[EntityMetaKey.SelectorKey], marketTimeIntervalTimestamp])).values()]}
	getKey={(marketTimeIntervalTimestamp) => marketTimeIntervalTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No OHLC candles yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: marketTimeIntervalTimestamp })}
		{@const marketTimeIntervalTimestampFields = { ...marketTimeIntervalTimestamp[EntityMetaKey.Selector], ...marketTimeIntervalTimestamp }}
		{@const selection = select(EntityType.Market_TimeInterval_Timestamp, marketTimeIntervalTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const marketTimeIntervalTimestampHrefFields = { ...marketTimeIntervalTimestamp, ...marketTimeIntervalTimestamp[EntityMetaKey.Selector] }}
		<Market_TimeInterval_TimestampView
			selection={selection}
			prefetched={marketTimeIntervalTimestampFields}
			href={
				(marketTimeIntervalTimestampHrefFields.timestampMs !== undefined && marketTimeIntervalTimestampHrefFields.timeInterval !== undefined && marketTimeIntervalTimestampHrefFields.timeInterval.unit !== undefined && marketTimeIntervalTimestampHrefFields.timeInterval.value !== undefined && marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.marketKind !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.assetKey !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.assetKey !== undefined && marketTimeIntervalTimestampHrefFields.$market.$marketVenue !== undefined && marketTimeIntervalTimestampHrefFields.$market.$marketVenue.marketVenueId !== undefined && marketTimeIntervalTimestampHrefFields.$base !== undefined && marketTimeIntervalTimestampHrefFields.$base.kind !== undefined && marketTimeIntervalTimestampHrefFields.$quote !== undefined && marketTimeIntervalTimestampHrefFields.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(marketTimeIntervalTimestampHrefFields.timestampMs ?? ''),
					timeIntervalUnit: String(marketTimeIntervalTimestampHrefFields.timeInterval.unit ?? ''),
					timeIntervalValue: String(marketTimeIntervalTimestampHrefFields.timeInterval.value ?? ''),
					marketKind: String(marketTimeIntervalTimestampHrefFields.$market.marketKind ?? ''),
					base: String(marketTimeIntervalTimestampHrefFields.$market.$base.assetKey ?? ''),
					quote: String(marketTimeIntervalTimestampHrefFields.$market.$quote.assetKey ?? ''),
					marketVenue: String(marketTimeIntervalTimestampHrefFields.$market.$marketVenue.marketVenueId ?? ''),
					baseKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestampHrefFields.$base.kind)] ?? ''),
					quoteKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestampHrefFields.$quote.kind)] ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
