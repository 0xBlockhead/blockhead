<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


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
	}: EntitySelectionViewProps<EntityType.Market_TimeInterval_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const marketTimeIntervalTimestamp = $derived(selection({
		fields: {
			close: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.timeInterval == null ? '' : `${pendingEntity.timeInterval.value}${pendingEntity.timeInterval.unit}`) || 'OHLC candle')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]',
			{
				marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId),
				baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)]),
				base: String(selection.entitySelector.$market.$base.assetKey),
				quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)]),
				quote: String(selection.entitySelector.$market.$quote.assetKey),
				marketKind: String(selection.entitySelector.$market.marketKind),
				timeIntervalUnit: String(selection.entitySelector.timeInterval.unit),
				timeIntervalValue: String(selection.entitySelector.timeInterval.value),
				timestampMs: String(selection.entitySelector.timestampMs),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.timeInterval == null ? '' : `${pendingEntity.timeInterval.value}${pendingEntity.timeInterval.unit}`) || 'OHLC candle'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketTimeIntervalTimestamp}>
			{#snippet children(entity)}
				{@const close0 = entity.close}
				{#if close0 != null}
					<NumberValue
						value={Number(close0) / 1e8}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Time Interval</dt>
				<dd>
					{`${pendingEntity.timeInterval.value}${pendingEntity.timeInterval.unit}`}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							open: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const open = entity.open}
					{#if open != null}
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
						fields: {
							high: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const high = entity.high}
					{#if high != null}
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
						fields: {
							low: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const low = entity.low}
					{#if low != null}
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
				resource={marketTimeIntervalTimestamp}
			>
				{#snippet children(entity)}
					{@const close = entity.close}
					{#if close != null}
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
						fields: {
							quoteVolume: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quoteVolume = entity.quoteVolume}
					{#if quoteVolume != null}
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
						resource={selection.$parentMarket}
					>
						{#snippet children(market)}
							<MarketView
								selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
								prefetched={market}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
