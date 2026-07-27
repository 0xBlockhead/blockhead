<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.Market> = $props()

	const titleFallback = 'Market'
	const viewDomId = $derived('market-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
			{
				marketVenue: String(selection.entitySelector.$marketVenue.marketVenueId),
				baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$base.kind)]),
				base: String(selection.entitySelector.$base.assetKey),
				quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$quote.kind)]),
				quote: String(selection.entitySelector.$quote.assetKey),
				marketKind: String(selection.entitySelector.marketKind),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<IconComponent />
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
							},
							{
								id: 'market-ohlc',
								label: 'Candles',
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

					{#snippet SectionMarketPrices({ id, label, open })}
						<MarketPricesView
							selection={selection.$$marketPrices}
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
					{/snippet}

					{#snippet SectionMarketOhlc({ id, label, open })}
						<Market_TimeInterval_TimestampsView
							selection={selection.$$marketTimeIntervalTimestamps}
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

					{#snippet SectionMarketDerivativeTimestamps({ id, label, open })}
						<Market_Derivative_TimestampsView
							selection={selection.$$derivativeTimestamps}
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
					{/snippet}

				</CollapsibleTabs>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
