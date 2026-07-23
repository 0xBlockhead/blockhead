<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { marketAssetRouteLabelByKind, MarketKind, marketKindByMarketKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
	import MarketAssetView from '$/views/MarketAssetView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'


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
			selection: RegisteredEntityProxyResource<EntityType.Market>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Market>
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
	const market = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = 'Market'
	const viewDomId = $derived('market-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import Market_Derivative_TimestampsView from '$/views/Market_Derivative_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'marketKind' in selection.entitySelector
			&& selection.entitySelector.marketKind != null
			&& selection.entitySelector != null && '$base' in selection.entitySelector
			&& selection.entitySelector.$base != null && 'assetKey' in selection.entitySelector.$base
			&& selection.entitySelector.$base.assetKey != null
			&& selection.entitySelector != null && '$quote' in selection.entitySelector
			&& selection.entitySelector.$quote != null && 'assetKey' in selection.entitySelector.$quote
			&& selection.entitySelector.$quote.assetKey != null
			&& selection.entitySelector != null && '$marketVenue' in selection.entitySelector
			&& selection.entitySelector.$marketVenue != null && 'marketVenueId' in selection.entitySelector.$marketVenue
			&& selection.entitySelector.$marketVenue.marketVenueId != null
			&& selection.entitySelector.$base != null && 'kind' in selection.entitySelector.$base
			&& selection.entitySelector.$base.kind != null
			&& selection.entitySelector.$quote != null && 'kind' in selection.entitySelector.$quote
			&& selection.entitySelector.$quote.kind != null ?
				resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
			marketKind: String(selection.entitySelector.marketKind ?? ''),
			base: String(selection.entitySelector.$base.assetKey ?? ''),
			quote: String(selection.entitySelector.$quote.assetKey ?? ''),
			marketVenue: String(selection.entitySelector.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$base.kind)] ?? ''),
			quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$quote.kind)] ?? ''),
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
		<ResourceBoundary resource={market}>
			{#snippet children(entity)}
				<IconComponent />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{selection.entitySelector.$marketVenue.marketVenueId}:{selection.entitySelector.$base.assetKey}-{selection.entitySelector.$quote.assetKey}
		{#if selection.entitySelector.marketKind !== MarketKind.Spot}
			{String(marketKindByMarketKind[String(selection.entitySelector.marketKind)].label)}
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<section data-column="gap-2">
			<dl data-column-item="center">
				<div>
					<dt>Kind</dt>
					<dd>
						{String(marketKindByMarketKind[String(selection.entitySelector.marketKind)].label)}
					</dd>
				</div>

				<div>
					<dt>Venue</dt>
					<dd>
						<MarketVenueView
							href={resolve(`/market-venue/${selection.entitySelector.$marketVenue.marketVenueId}`)}
							selection={select(EntityType.MarketVenue, selection.entitySelector.$marketVenue)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					</dd>
				</div>

				{#if (
					contentOpen
					&& selection.entitySelector.marketKind !== MarketKind.Spot
				)}
					<div>
						<dt>Latest derivative observation</dt>
						<dd>
							<ResourceBoundary
								resource={selection.$$derivativeTimestamps({
									sources: [
										Source.Coingecko_OpenApi,
									],
									limit: 64,
								})}
							>
								{#snippet children(derivativeTimestamps)}
									{@const derivativeTimestamp = derivativeTimestamps.values.at(0)}
									{#if derivativeTimestamp != null}
										<Market_Derivative_TimestampView
											selection={select(EntityType.Market_Derivative_Timestamp, derivativeTimestamp[EntityMetaKey.Selector])}
											layout={EntityLayout.Value}
											showTypeAnnotation={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				<div>
					<dt>Base</dt>
					<dd>
						<MarketAssetView
							selection={select(EntityType.MarketAsset, selection.entitySelector.$base)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					</dd>
				</div>

				<div>
					<dt>Quote</dt>
					<dd>
						<MarketAssetView
							selection={select(EntityType.MarketAsset, selection.entitySelector.$quote)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					</dd>
				</div>
			</dl>
		</section>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<ProjectionBoundary
			resource={selection.Spot}
		>
			{#snippet Applicable(projection)}
						<CollapsibleTabs
							id={viewDomId + '-carousel-market-spot'}
							sectionIdPrefix={viewDomId}
							sections={
								[
									{
										id: 'market-prices',
										label: 'Spot',
										ownsSection: true,
									},
									{
										id: 'market-ohlc',
										label: 'Candles',
										ownsSection: true,
									},
								]
							}
							data-card
							class='network-view-collapsible-spot'
						>
							{#snippet Summary()}
								<header data-row-item="flexible" data-row="wrap gap-4">
									<HeadingComponent>Spot</HeadingComponent>
								</header>
							{/snippet}

							{#snippet MarkerMarketPrices(_context, Content)}
								{@const marketSpotMarketPricesResource = selection
				.$$marketPrices({
					sources: [
						Source.Constants_Internal,
						Source.Coingecko_Rest,
						Source.Coingecko_OpenApi,
						Source.CoinMarketCap_Rest,
						Source.Coinpaprika_OpenApi,
						Source.Defillama_OpenApi,
						Source.Blockscout_Rest,
						Source.Defillama_Rest,
					],
				})}
								<ResourceBoundary
									resource={marketSpotMarketPricesResource}
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

							{#snippet SectionMarketPrices({ id, label, open, active })}
								{@const marketSpotMarketPricesResource = selection
				.$$marketPrices({
					sources: [
						Source.Constants_Internal,
						Source.Coingecko_Rest,
						Source.Coingecko_OpenApi,
						Source.CoinMarketCap_Rest,
						Source.Coinpaprika_OpenApi,
						Source.Defillama_OpenApi,
						Source.Blockscout_Rest,
						Source.Defillama_Rest,
					],
				})}
								<ResourceBoundary
									resource={marketSpotMarketPricesResource}
								>
									{#snippet children(marketPrice)}
										<section
											id={id}
											aria-labelledby={`${id}:marker`}
											data-scroll-marker-label={label}
											data-column-item="flexible"
											data-column
											data-active={active}
										>
											<MarketPricesView
												selection={marketSpotMarketPricesResource}
												CollapsibleProps={{ canToggle: false }}
												collapsible={false}
												data-column-item="flexible"
												data-card
												data-scroll-container
												open={open}
												title={label}
												emptyText='No spot market prices.'
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

							{#snippet MarkerMarketOhlc(_context, Content)}
								{@const marketSpotMarketOhlcResource = selection
				.$$marketTimeIntervalTimestamps({
					sources: [
						Source.Coingecko_Rest,
						Source.Coingecko_OpenApi,
						Source.Coinpaprika_OpenApi,
						Source.CoinMarketCap_Rest,
					],
				})}
								<ResourceBoundary
									resource={marketSpotMarketOhlcResource}
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

							{#snippet SectionMarketOhlc({ id, label, open, active })}
								{@const marketSpotMarketOhlcResource = selection
				.$$marketTimeIntervalTimestamps({
					sources: [
						Source.Coingecko_Rest,
						Source.Coingecko_OpenApi,
						Source.Coinpaprika_OpenApi,
						Source.CoinMarketCap_Rest,
					],
				})}
								<ResourceBoundary
									resource={marketSpotMarketOhlcResource}
								>
									{#snippet children(marketTimeIntervalTimestamp)}
										<section
											id={id}
											aria-labelledby={`${id}:marker`}
											data-scroll-marker-label={label}
											data-column-item="flexible"
											data-column
											data-active={active}
										>
											<Market_TimeInterval_TimestampsView
												selection={marketSpotMarketOhlcResource}
												CollapsibleProps={{ canToggle: false }}
												collapsible={false}
												data-column-item="flexible"
												data-card
												data-scroll-container
												open={open}
												title={label}
												emptyText='No OHLC candles.'
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
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Derivative}
		>
			{#snippet Applicable(projection)}
						<CollapsibleTabs
							id={viewDomId + '-carousel-market-derivatives'}
							sectionIdPrefix={viewDomId}
							sections={
								[
									{
										id: 'market-derivative-timestamps',
										label: 'Derivative observations',
										ownsSection: true,
									},
								]
							}
							data-card
							class='network-view-collapsible-derivatives'
						>
							{#snippet Summary()}
								<header data-row-item="flexible" data-row="wrap gap-4">
									<HeadingComponent>Derivative observations</HeadingComponent>
								</header>
							{/snippet}

							{#snippet MarkerMarketDerivativeTimestamps(_context, Content)}
								{@const marketDerivativesMarketDerivativeTimestampsResource = selection
				.$$derivativeTimestamps({
					sources: [
						Source.Coingecko_OpenApi,
					],
				})}
								<ResourceBoundary
									resource={marketDerivativesMarketDerivativeTimestampsResource}
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

							{#snippet SectionMarketDerivativeTimestamps({ id, label, open, active })}
								{@const marketDerivativesMarketDerivativeTimestampsResource = selection
				.$$derivativeTimestamps({
					sources: [
						Source.Coingecko_OpenApi,
					],
				})}
								<ResourceBoundary
									resource={marketDerivativesMarketDerivativeTimestampsResource}
								>
									{#snippet children(marketDerivativeTimestamp)}
										<section
											id={id}
											aria-labelledby={`${id}:marker`}
											data-scroll-marker-label={label}
											data-column-item="flexible"
											data-column
											data-active={active}
										>
											<Market_Derivative_TimestampsView
												selection={marketDerivativesMarketDerivativeTimestampsResource}
												CollapsibleProps={{ canToggle: false }}
												collapsible={false}
												data-column-item="flexible"
												data-card
												data-scroll-container
												open={open}
												title={label}
												emptyText='No derivative observations.'
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
		</ProjectionBoundary>
	{/snippet}
</EntityView>
