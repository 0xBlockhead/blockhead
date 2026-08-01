<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { marketAssetRouteLabelByKind, MarketKind, marketKindByMarketKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.Market> = $props()

	const base = $derived(selection.entitySelector.$base)
	const quote = $derived(selection.entitySelector.$quote)
	const viewDomId = $derived('market-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
	import MarketAssetView from '$/views/MarketAssetView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import Market_Derivative_TimestampsView from '$/views/Market_Derivative_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'Market'}
	href={
		href === undefined ?
			resolve(
				'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
				{
					marketVenue: selection.entitySelector.$marketVenue.marketVenueId,
					baseKind: marketAssetRouteLabelByKind[base.kind],
					base: base.assetKey,
					quoteKind: marketAssetRouteLabelByKind[quote.kind],
					quote: quote.assetKey,
					marketKind: selection.entitySelector.marketKind,
				}
			)
		:
			href ?? undefined
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
			{marketKindByMarketKind[selection.entitySelector.marketKind].label}
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<section data-column="gap-2">
			<dl data-column-item="center">
				<div>
					<dt>Kind</dt>
					<dd>
						{marketKindByMarketKind[selection.entitySelector.marketKind].label}
					</dd>
				</div>

				<div>
					<dt>Venue</dt>
					<dd>
						<MarketVenueView
							selection={select(EntityType.MarketVenue, selection.entitySelector.$marketVenue)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
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
										Source.Coingecko_Rest,
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
						/>
					</dd>
				</div>
			</dl>
		</section>
	{/snippet}

	{#snippet Details()}
					{#if selection.entitySelector.marketKind === 'Spot'}
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

									{#snippet SectionMarketPrices({ id, label })}
										<MarketPricesView
											selection={selection.$$marketPrices}
											collapsible={false}
											title={label}
											emptyText='No spot market prices.'
											id={`${id}-list`}
										/>
									{/snippet}

									{#snippet SectionMarketOhlc({ id, label })}
										<Market_TimeInterval_TimestampsView
											selection={selection.$$marketTimeIntervalTimestamps}
											collapsible={false}
											title={label}
											emptyText='No OHLC candles.'
											id={`${id}-list`}
										/>
									{/snippet}

								</CollapsibleTabs>
							{/snippet}
						</ProjectionBoundary>
					{/if}

					{#if [
			'Perpetual',
			'Futures',
		].includes(selection.entitySelector.marketKind)}
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

									{#snippet SectionMarketDerivativeTimestamps({ id, label })}
										<Market_Derivative_TimestampsView
											selection={selection.$$derivativeTimestamps}
											collapsible={false}
											title={label}
											emptyText='No derivative observations.'
											id={`${id}-list`}
										/>
									{/snippet}

								</CollapsibleTabs>
							{/snippet}
						</ProjectionBoundary>
					{/if}
	{/snippet}
</EntityView>
