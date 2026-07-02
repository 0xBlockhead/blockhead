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
		Candles load from every configured OHLC provider on the parent market row (Coingecko, Coinpaprika, CoinMarketCap, …).
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
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
				},
			}) : selection
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
			/>
		{/snippet}

		{#snippet children(marketTimeIntervalTimestamps)}
			{@const uniqueMarketTimeIntervalTimestamps = [...new Map(marketTimeIntervalTimestamps.values.filter((marketTimeIntervalTimestamp) => (timeInterval == null || (marketTimeIntervalTimestamp.entitySelector.timeInterval.unit === timeInterval.unit && marketTimeIntervalTimestamp.entitySelector.timeInterval.value === timeInterval.value))).map((marketTimeIntervalTimestamp) => [marketTimeIntervalTimestamp[EntityMetaKey.SelectorKey], marketTimeIntervalTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_TimeInterval_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={marketTimeIntervalTimestamps.values.length === uniqueMarketTimeIntervalTimestamps.length && marketTimeIntervalTimestamps.totalCount != null && marketTimeIntervalTimestamps.totalCount >= uniqueMarketTimeIntervalTimestamps.length ? marketTimeIntervalTimestamps.totalCount : uniqueMarketTimeIntervalTimestamps.length}
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
					<Market_TimeInterval_TimestampView
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]', {
								marketVenue: entity.$market.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$market.$base.kind],
								base: entity.$market.$base.kind === MarketAssetKind.Coin ? entity.$market.$base.$coin.coinId : entity.$market.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$base.$coinInstance.type] : entity.$market.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$market.$quote.kind],
								quote: entity.$market.$quote.kind === MarketAssetKind.Coin ? entity.$market.$quote.$coin.coinId : entity.$market.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$quote.$coinInstance.type] : entity.$market.$quote.$currency.iso4217,
								marketKind: entity.$market.marketKind,
								timeIntervalUnit: String(({ ...marketTimeIntervalTimestamp.entitySelector, ...marketTimeIntervalTimestamp }).timeInterval.unit),
								timeIntervalValue: String(({ ...marketTimeIntervalTimestamp.entitySelector, ...marketTimeIntervalTimestamp }).timeInterval.value),
								timestampMs: String(({ ...marketTimeIntervalTimestamp.entitySelector, ...marketTimeIntervalTimestamp }).timestampMs),
							})
						}
						selection={select(EntityType.Market_TimeInterval_Timestamp, marketTimeIntervalTimestamp.entitySelector)}
						prefetched={marketTimeIntervalTimestamp}
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
