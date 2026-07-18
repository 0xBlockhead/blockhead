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
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.Market_TimeInterval_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Market_TimeInterval_Timestamp>>
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
	const marketTimeIntervalTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			close: true,
		},
	}))
	const titleFallback = $derived([pendingEntity.timeInterval == null ? '' : String((`${(pendingEntity.timeInterval).value}${(pendingEntity.timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || 'OHLC candle')
	const viewDomId = $derived('market-time-interval-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.timeInterval !== undefined && pendingEntity.timeInterval.unit !== undefined && pendingEntity.timeInterval.value !== undefined && pendingEntity.$market !== undefined && pendingEntity.$market.marketKind !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.assetKey !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.assetKey !== undefined && pendingEntity.$market.$marketVenue !== undefined && pendingEntity.$market.$marketVenue.marketVenueId !== undefined && pendingEntity.$base !== undefined && pendingEntity.$base.kind !== undefined && pendingEntity.$quote !== undefined && pendingEntity.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			timeIntervalUnit: String(pendingEntity.timeInterval.unit ?? ''),
			timeIntervalValue: String(pendingEntity.timeInterval.value ?? ''),
			marketKind: String(pendingEntity.$market.marketKind ?? ''),
			base: String(pendingEntity.$market.$base.assetKey ?? ''),
			quote: String(pendingEntity.$market.$quote.assetKey ?? ''),
			marketVenue: String(pendingEntity.$market.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$base.kind)] ?? ''),
			quoteKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$quote.kind)] ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[pendingEntity.timeInterval == null ? '' : String((`${(pendingEntity.timeInterval).value}${(pendingEntity.timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[resolvedEntity.timeInterval == null ? '' : String((`${(resolvedEntity.timeInterval).value}${(resolvedEntity.timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const close0 = pendingEntity.close}
					{#if close0 !== undefined && close0 !== null}
						<NumberValue
							value={Number(close0) / 1e8}
							formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const close0 = resolvedEntity.close}
					{#if close0 !== undefined && close0 !== null}
						<NumberValue
							value={Number(close0) / 1e8}
							formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market, {})}
						href={
							(selection.entitySelector.$market.marketKind !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.assetKey !== undefined && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.assetKey !== undefined && selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base.kind !== undefined && selection.entitySelector.$market.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
								base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
								quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Time Interval</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timeInterval: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timeInterval = resolvedEntity.timeInterval}
							{#if timeInterval !== undefined && timeInterval !== null}
								{timeInterval == null ? '' : String((`${(timeInterval).value}${(timeInterval).unit}`) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							open: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const open = resolvedEntity.open}
					{#if open !== undefined && open !== null}
						<div>
							<dt>Open</dt>
							<dd>
								<NumberValue
									value={Number(open) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							high: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const high = resolvedEntity.high}
					{#if high !== undefined && high !== null}
						<div>
							<dt>High</dt>
							<dd>
								<NumberValue
									value={Number(high) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							low: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const low = resolvedEntity.low}
					{#if low !== undefined && low !== null}
						<div>
							<dt>Low</dt>
							<dd>
								<NumberValue
									value={Number(low) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							close: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const close = resolvedEntity.close}
					{#if close !== undefined && close !== null}
						<div>
							<dt>Close</dt>
							<dd>
								<NumberValue
									value={Number(close) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							quoteVolume: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteVolume = resolvedEntity.quoteVolume}
					{#if quoteVolume !== undefined && quoteVolume !== null}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<NumberValue
									value={Number(quoteVolume) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection.$parentMarket({
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.Coinpaprika_OpenApi,
									Source.CoinMarketCap_Rest,
								],
							})
						}
					>
						{#snippet children(market)}
							{#if market != null && market[EntityMetaKey.Selector] != null}
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
