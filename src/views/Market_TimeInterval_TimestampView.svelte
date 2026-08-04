<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Market_TimeInterval_Timestamp>, 'prefetched'> = $props()

	const market = $derived(selection.entitySelector.$market)
	const candle = $derived(selection({
		fields: {
			open: true,
			high: true,
			low: true,
			close: true,
			quoteVolume: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? (`${selection.entitySelector.timeInterval.value}${selection.entitySelector.timeInterval.unit}` || 'OHLC candle')}
	href={
		href === undefined ?
			resolve(
				'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]',
				{
					marketVenue: market.$marketVenue.marketVenueId,
					baseKind: marketAssetRouteLabelByKind[market.$base.kind],
					base: market.$base.assetKey,
					quoteKind: marketAssetRouteLabelByKind[market.$quote.kind],
					quote: market.$quote.assetKey,
					marketKind: market.marketKind,
					timeIntervalUnit: selection.entitySelector.timeInterval.unit,
					timeIntervalValue: String(selection.entitySelector.timeInterval.value),
					timestampMs: String(selection.entitySelector.timestampMs),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={candle}>
			{#snippet children(entity)}
				{@const close = entity.close}
				{#if close != null}
					<NumberValue
						value={Number(close) / 1e8}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={candle}>
			{#snippet children(entity)}
				<dl data-column-item="center">
					{#if entity.open != null}
						<div>
							<dt>Open</dt>
							<dd>
								<NumberValue
									value={Number(entity.open) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}

					{#if entity.high != null}
						<div>
							<dt>High</dt>
							<dd>
								<NumberValue
									value={Number(entity.high) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}

					{#if entity.low != null}
						<div>
							<dt>Low</dt>
							<dd>
								<NumberValue
									value={Number(entity.low) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}

					{#if entity.close != null}
						<div>
							<dt>Close</dt>
							<dd>
								<NumberValue
									value={Number(entity.close) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				</dl>

				<dl data-column-item="center">
					{#if entity.quoteVolume != null}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<NumberValue
									value={Number(entity.quoteVolume) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Market</dt>
						<dd>
							<MarketView
								selection={select(EntityType.Market, selection.entitySelector.$market)}
								layout={EntityLayout.Value}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
