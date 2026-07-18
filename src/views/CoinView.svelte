<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import { MarketKind, marketKindByMarketKind } from '$/constants/Market.ts'
	import { seededCoinSpotUsdMarkets } from '$/constants/MarketCatalog.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.Coin>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Coin>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const coin = $derived(selection({
		sources: selection.sources,
		fields: {
			symbol: true,
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'Coin')
	const viewDomId = $derived('coin-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
	import EvmCoinInstancesView from '$/views/EvmCoinInstancesView.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
			coinId: String(pendingEntity.coinId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={coin}>
			{#snippet children(entity)}
				{@const reference = entity.$logo}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={coin}>
			{#snippet Pending()}
				{String(selection.entitySelector.coinId ?? '')}
			{/snippet}

			{#snippet children(entity)}
				{String(entity.name ?? '') && String(entity.symbol ?? '') && String(entity.name ?? '') !== String(entity.symbol ?? '') ? `${String(entity.name ?? '')} (${String(entity.symbol ?? '')})` : String(entity.symbol ?? '') || String(entity.name ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{String(selection.entitySelector.coinId ?? '')}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A catalog coin identity groups time-stamped fundamentals snapshots and market quote streams for the same asset so duplicate tickers from rival data vendors stay separable by catalog key and vendor attribution.
		</p>

		<p>
			Each <strong>coin instance</strong>
			row is anchored on one execution chain—either the native gas asset or a token contract—while sharing the same catalog coin id across networks.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Latest snapshot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection.$$timestamps({
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
									Source.CoinMarketCap_Rest,
									Source.Coinpaprika_OpenApi,
								],
								fields: {
									marketCapRank: true,
									marketCapUsd: true,
									marketCap: true,
									change24hPercent: true,
									timestampMs: true,
									source: true,
								},
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
								],
							})
						}
					>
						{#snippet children(coinTimestamps)}
							{@const coinTimestamp = coinTimestamps.values[0]}
							{#if coinTimestamp != null}
								{@const coinTimestampSelector = coinTimestamp[EntityMetaKey.Selector]}
								<Coin_TimestampView
									selection={
										select(EntityType.Coin_Timestamp, coinTimestampSelector, {
											sources: [
												Source.Constants_Internal,
												Source.Coingecko_Rest,
												Source.CoinMarketCap_Rest,
												Source.Coinpaprika_OpenApi,
											],
										})
									}
									href={
										(coinTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && coinTimestamp[EntityMetaKey.Selector].source !== undefined && coinTimestamp[EntityMetaKey.Selector].$coin !== undefined && coinTimestamp[EntityMetaKey.Selector].$coin.coinId !== undefined ? resolve('/coin/[coinId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
											timestampMs: String(coinTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											source: String(coinTimestamp[EntityMetaKey.Selector].source ?? ''),
											coinId: String(coinTimestamp[EntityMetaKey.Selector].$coin.coinId ?? ''),
										}) : undefined)
									}
									prefetched={{ ...coinTimestampSelector, ...coinTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest snapshot available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if !contentOpen}
				<div>
					<dt>Coin ID</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									sources: selection.sources,
									fields: {
										coinId: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const coinId = resolvedEntity.coinId}
								{#if coinId !== undefined && coinId !== null}
									{String((coinId) ?? '')}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-availability'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'coin-instances',
							label: 'Instances',
						},
						{
							id: 'coin-bridge-capabilities',
							label: 'Bridge capabilities',
						},
					]
				}
				data-card
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Availability</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCoinInstances({ id, label, open })}
					<EvmCoinInstancesView
						selection={selection.$$coinInstances}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No instances available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCoinBridgeCapabilities({ id, label, open })}
					<CoinBridgeCapabilitiesView
						selection={selection.$$bridgeCapabilities}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No bridge capabilities available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-markets'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'catalog-usd-market',
							label: 'USD market',
						},
						{
							id: 'markets-with-coin-as-base',
							label: 'Base markets',
						},
						{
							id: 'markets-with-coin-as-quote',
							label: 'Quote markets',
						},
					]
				}
				data-card
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Markets</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCatalogUsdMarket({ id, label, open })}
					{@const catalogUsdMarket = seededCoinSpotUsdMarkets.find((market) => market.baseCoinId === selection.entitySelector.coinId)}
					<article
						id={`${id}-list`}
						data-column-item="flexible"
						data-card
						data-scroll-container
					>
						{#if catalogUsdMarket}
							<div data-row="wrap align-center gap-2">
								<a href={resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
									marketVenue: catalogUsdMarket.marketVenueId,
									baseKind: 'coin',
									base: catalogUsdMarket.baseCoinId,
									quoteKind: 'currency',
									quote: catalogUsdMarket.quoteIso4217,
									marketKind: catalogUsdMarket.marketKind,
								})}>
									{catalogUsdMarket.marketKind === MarketKind.Spot ?
										`${catalogUsdMarket.marketVenueId}:${catalogUsdMarket.baseCoinId}-${catalogUsdMarket.quoteIso4217}`
									:
										`${catalogUsdMarket.marketVenueId}:${catalogUsdMarket.baseCoinId}-${catalogUsdMarket.quoteIso4217} (${marketKindByMarketKind[catalogUsdMarket.marketKind].label})`}
								</a>

								<span data-text="muted">
									— spot quote and OHLC on the market page.
								</span>

								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Each market row is a base / quote / venue triple. Open a market for spot quotes and OHLC candles.
										</p>
									{/snippet}

									<abbr
										class="entity-heading-tip"
										aria-label="Markets and pricing"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						{/if}
					</article>
				{/snippet}

				{#snippet SectionMarketsWithCoinAsBase({ id, label, open })}
					<MarketsView
						selection={
							selection.$$marketsWithCoinAsBase({
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_OpenApi,
									Source.Coinpaprika_OpenApi,
								],
							})
						}
						href={resolve('/markets')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No base markets available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionMarketsWithCoinAsQuote({ id, label, open })}
					<MarketsView
						selection={
							selection.$$marketsWithCoinAsQuote({
								sources: [
									Source.Constants_Internal,
								],
							})
						}
						href={resolve('/markets')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No quote markets available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
