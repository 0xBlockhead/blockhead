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
	import { marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'OHLC',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_TimeInterval_Timestamps-list',
		timeInterval,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market_TimeInterval_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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

{#if open}
	<ResourceBoundary
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
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_TimeInterval_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(marketTimeIntervalTimestamps)}
			{@const uniqueMarketTimeIntervalTimestamps = [...new Map(marketTimeIntervalTimestamps.values.filter((marketTimeIntervalTimestamp) => (timeInterval == null || (marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.unit === timeInterval.unit && marketTimeIntervalTimestamp[EntityMetaKey.Selector].timeInterval.value === timeInterval.value))).map((marketTimeIntervalTimestamp) => [marketTimeIntervalTimestamp[EntityMetaKey.SelectorKey], marketTimeIntervalTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_TimeInterval_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={marketTimeIntervalTimestamps.totalCount}
				getKey={(marketTimeIntervalTimestamp) => marketTimeIntervalTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMarketTimeIntervalTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No OHLC candles yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketTimeIntervalTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market_TimeInterval_Timestamp> })}
					{@const marketTimeIntervalTimestampFields = { ...marketTimeIntervalTimestamp[EntityMetaKey.Selector], ...marketTimeIntervalTimestamp }}
					{@const marketTimeIntervalTimestampHrefFields = { ...marketTimeIntervalTimestamp, ...marketTimeIntervalTimestamp[EntityMetaKey.Selector] }}
					<Market_TimeInterval_TimestampView
						selection={select(EntityType.Market_TimeInterval_Timestamp, marketTimeIntervalTimestamp[EntityMetaKey.Selector])}
						prefetched={marketTimeIntervalTimestampFields}
						href={
							(marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$marketVenue !== undefined && marketTimeIntervalTimestampHrefFields.$market.$marketVenue.marketVenueId !== undefined && marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.kind !== undefined && (marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.kind !== undefined && (marketTimeIntervalTimestampHrefFields.$market.$base.kind === 'Coin' ? marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.$coin !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.$coin.coinId !== undefined : marketTimeIntervalTimestampHrefFields.$market.$base.kind === 'CoinInstance' ? marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.$coinInstance !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.$coinInstance.type !== undefined : marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.$currency !== undefined && marketTimeIntervalTimestampHrefFields.$market.$base.$currency.iso4217 !== undefined)) && marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.kind !== undefined && (marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.kind !== undefined && (marketTimeIntervalTimestampHrefFields.$market.$quote.kind === 'Coin' ? marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.$coin !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.$coin.coinId !== undefined : marketTimeIntervalTimestampHrefFields.$market.$quote.kind === 'CoinInstance' ? marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.$coinInstance !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.$coinInstance.type !== undefined : marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.$currency !== undefined && marketTimeIntervalTimestampHrefFields.$market.$quote.$currency.iso4217 !== undefined)) && marketTimeIntervalTimestampHrefFields.$market !== undefined && marketTimeIntervalTimestampHrefFields.$market.marketKind !== undefined && marketTimeIntervalTimestampHrefFields.timeInterval !== undefined && marketTimeIntervalTimestampHrefFields.timeInterval.unit !== undefined && marketTimeIntervalTimestampHrefFields.timeInterval !== undefined && marketTimeIntervalTimestampHrefFields.timeInterval.value !== undefined && marketTimeIntervalTimestampHrefFields.timestampMs !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]', {
								marketVenue: String(marketTimeIntervalTimestampHrefFields.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestampHrefFields.$market.$base.kind)] ?? ''),
								base: String((marketTimeIntervalTimestampHrefFields.$market.$base.kind === 'Coin' ? marketTimeIntervalTimestampHrefFields.$market.$base.$coin.coinId : marketTimeIntervalTimestampHrefFields.$market.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketTimeIntervalTimestampHrefFields.$market.$base.$coinInstance.type)] : marketTimeIntervalTimestampHrefFields.$market.$base.$currency.iso4217)),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketTimeIntervalTimestampHrefFields.$market.$quote.kind)] ?? ''),
								quote: String((marketTimeIntervalTimestampHrefFields.$market.$quote.kind === 'Coin' ? marketTimeIntervalTimestampHrefFields.$market.$quote.$coin.coinId : marketTimeIntervalTimestampHrefFields.$market.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketTimeIntervalTimestampHrefFields.$market.$quote.$coinInstance.type)] : marketTimeIntervalTimestampHrefFields.$market.$quote.$currency.iso4217)),
								marketKind: String(marketTimeIntervalTimestampHrefFields.$market.marketKind ?? ''),
								timeIntervalUnit: String(marketTimeIntervalTimestampHrefFields.timeInterval.unit ?? ''),
								timeIntervalValue: String(marketTimeIntervalTimestampHrefFields.timeInterval.value ?? ''),
								timestampMs: String(marketTimeIntervalTimestampHrefFields.timestampMs ?? ''),
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
		entityType={EntityType.Market_TimeInterval_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
