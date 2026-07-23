<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Market_TimeInterval_Timestamp>
			countResource?: SvelteKitResource<number>
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
			sources: selection.sources ?? [
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
	{countResource}
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
		<EntityView
			entityType={EntityType.Market_TimeInterval_Timestamp}
			entitySelector={marketTimeIntervalTimestamp[EntityMetaKey.Selector]}
			href={
				(
					marketTimeIntervalTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in marketTimeIntervalTimestamp[EntityMetaKey.Selector]
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector] != null && 'timeInterval' in marketTimeIntervalTimestamp[EntityMetaKey.Selector]
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval != null && 'unit' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval != null && 'value' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector] != null && '$market' in marketTimeIntervalTimestamp[EntityMetaKey.Selector]
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market != null && 'marketKind' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.marketKind != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market != null && '$base' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$base != null && 'assetKey' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$base
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$base.assetKey != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market != null && '$quote' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$quote != null && 'assetKey' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$quote
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market != null && '$marketVenue' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$marketVenue != null && 'marketVenueId' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$marketVenue
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector] != null && '$base' in marketTimeIntervalTimestamp[EntityMetaKey.Selector]
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$base != null && 'kind' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$base
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$base.kind != null
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector] != null && '$quote' in marketTimeIntervalTimestamp[EntityMetaKey.Selector]
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$quote != null && 'kind' in marketTimeIntervalTimestamp[EntityMetaKey.Selector].$quote
					&& marketTimeIntervalTimestamp[EntityMetaKey.Selector].$quote.kind != null ?
						resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					timeIntervalUnit: String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit ?? ''),
					timeIntervalValue: String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value ?? ''),
					marketKind: String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.marketKind ?? ''),
					base: String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$base.assetKey ?? ''),
					quote: String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey ?? ''),
					marketVenue: String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId ?? ''),
					baseKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].$base.kind)] ?? ''),
					quoteKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestamp[EntityMetaKey.Selector].$quote.kind)] ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[marketTimeIntervalTimestampFields.timeInterval == null ? '' : String(`${(marketTimeIntervalTimestampFields.timeInterval).value}${(marketTimeIntervalTimestampFields.timeInterval).unit}`)].filter(Boolean).join(' ') || 'OHLC candle'}
			{/snippet}

			{#snippet Value()}
				{[String((marketTimeIntervalTimestampFields.close) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((marketTimeIntervalTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
