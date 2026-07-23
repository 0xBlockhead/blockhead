<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { CoinId } from '$/constants/Coin.ts'
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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Coin>
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
	const viewDomId = $derived('coin-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'coinId' in selection.entitySelector
			&& selection.entitySelector.coinId != null ?
				resolve('/coin/[coinId=stringSegment]', {
			coinId: String(selection.entitySelector.coinId ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={coin}>
			{#snippet children(entity)}
				{@const reference = entity.$logo}
				{#if reference != null && reference[EntityMetaKey.Selector] !== undefined}
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
							selection
								.$$timestamps({
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
										(
											coinTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in coinTimestamp[EntityMetaKey.Selector]
											&& coinTimestamp[EntityMetaKey.Selector].timestampMs != null
											&& coinTimestamp[EntityMetaKey.Selector] != null && 'source' in coinTimestamp[EntityMetaKey.Selector]
											&& coinTimestamp[EntityMetaKey.Selector].source != null
											&& coinTimestamp[EntityMetaKey.Selector] != null && '$coin' in coinTimestamp[EntityMetaKey.Selector]
											&& coinTimestamp[EntityMetaKey.Selector].$coin != null && 'coinId' in coinTimestamp[EntityMetaKey.Selector].$coin
											&& coinTimestamp[EntityMetaKey.Selector].$coin.coinId != null ?
												resolve('/coin/[coinId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
											timestampMs: String(coinTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											source: String(coinTimestamp[EntityMetaKey.Selector].source ?? ''),
											coinId: String(coinTimestamp[EntityMetaKey.Selector].$coin.coinId ?? ''),
										})
										:
												undefined
										)
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
				<CollapsibleTabs
					id={viewDomId + '-carousel-availability'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'coin-instances',
								label: 'Instances',
								ownsSection: true,
							},
							{
								id: 'coin-bridge-capabilities',
								label: 'Bridge capabilities',
								ownsSection: true,
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

					{#snippet MarkerCoinInstances(_context, Content)}
						{@const availabilityCoinInstancesResource = selection.$$coinInstances}
						<ResourceBoundary
							resource={availabilityCoinInstancesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionCoinInstances({ id, label, open, active })}
						{@const availabilityCoinInstancesResource = selection.$$coinInstances}
						<ResourceBoundary
							resource={availabilityCoinInstancesResource}
						>
							{#snippet children(evmCoinInstance)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<EvmCoinInstancesView
										selection={availabilityCoinInstancesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerCoinBridgeCapabilities(_context, Content)}
						{@const availabilityCoinBridgeCapabilitiesResource = selection.$$bridgeCapabilities}
						<ResourceBoundary
							resource={availabilityCoinBridgeCapabilitiesResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionCoinBridgeCapabilities({ id, label, open, active })}
						{@const availabilityCoinBridgeCapabilitiesResource = selection.$$bridgeCapabilities}
						<ResourceBoundary
							resource={availabilityCoinBridgeCapabilitiesResource}
						>
							{#snippet children(coinBridgeCapability)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<CoinBridgeCapabilitiesView
										selection={availabilityCoinBridgeCapabilitiesResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
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
								ownsSection: true,
							},
							{
								id: 'markets-with-coin-as-base',
								label: 'Base markets',
								ownsSection: true,
							},
							{
								id: 'markets-with-coin-as-quote',
								label: 'Quote markets',
								ownsSection: true,
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

					{#snippet MarkerCatalogUsdMarket(_context, Content)}
						{@const marketsCatalogUsdMarketResource = selection
		.$$marketsWithCoinAsBase({
			sources: [
				Source.Constants_Internal,
			],
			limit: 1,
		})}
						<ResourceBoundary
							resource={marketsCatalogUsdMarketResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionCatalogUsdMarket({ id, label, open, active })}
						{@const marketsCatalogUsdMarketResource = selection
		.$$marketsWithCoinAsBase({
			sources: [
				Source.Constants_Internal,
			],
			limit: 1,
		})}
						<ResourceBoundary
							resource={marketsCatalogUsdMarketResource}
						>
							{#snippet children(market)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketsView
										selection={marketsCatalogUsdMarketResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerMarketsWithCoinAsBase(_context, Content)}
						{@const marketsWithCoinAsBaseResource = selection
		.$$marketsWithCoinAsBase({
			sources: [
				Source.Constants_Internal,
				Source.Coingecko_OpenApi,
				Source.Coinpaprika_OpenApi,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCoinAsBaseResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionMarketsWithCoinAsBase({ id, label, open, active })}
						{@const marketsWithCoinAsBaseResource = selection
		.$$marketsWithCoinAsBase({
			sources: [
				Source.Constants_Internal,
				Source.Coingecko_OpenApi,
				Source.Coinpaprika_OpenApi,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCoinAsBaseResource}
						>
							{#snippet children(market)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketsView
										selection={marketsWithCoinAsBaseResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerMarketsWithCoinAsQuote(_context, Content)}
						{@const marketsWithCoinAsQuoteResource = selection
		.$$marketsWithCoinAsQuote({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCoinAsQuoteResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionMarketsWithCoinAsQuote({ id, label, open, active })}
						{@const marketsWithCoinAsQuoteResource = selection
		.$$marketsWithCoinAsQuote({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCoinAsQuoteResource}
						>
							{#snippet children(market)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketsView
										selection={marketsWithCoinAsQuoteResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
	{/snippet}
</EntityView>
