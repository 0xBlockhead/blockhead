<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Iso4217 } from '$/constants/Currency.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'

	import {
		MarketAssetKind,
		MarketTimeIntervalUnit,
		marketOhlcCandleSources,
	} from '$/constants/Market.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(selector.$market)),
			},
		),
		layout,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()

	const marketTimeIntervalTimestamp = subscribe(EntityType.Market_TimeInterval_Timestamp,
		selector,
		({ sources: [
				Source.Constants_Internal,
				...marketOhlcCandleSources,
			], fields: { $parentMarket: true, close: true, ...(open && ({ open: true, high: true, low: true, volume: true, quoteVolume: true, tradeCount: true, vwap: true })) } }),
	)


	// (Derived)

	const quoteCurrency = $derived(
		selector.$market.$quote.kind === MarketAssetKind.Currency ?
			selector.$market.$quote.$currency.iso4217
		:
			Iso4217.USD
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	title={`${(selector.timeInterval.unit === MarketTimeIntervalUnit.Day ?
			`${String(selector.timeInterval.value)}d`
		: selector.timeInterval.unit === MarketTimeIntervalUnit.Hour ?
			`${String(selector.timeInterval.value)}h`
		: selector.timeInterval.unit === MarketTimeIntervalUnit.Minute ?
			`${String(selector.timeInterval.value)}m`
		: selector.timeInterval.unit === MarketTimeIntervalUnit.Second ?
			`${String(selector.timeInterval.value)}s`
		:
			`${String(selector.timeInterval.value)}`)} OHLC candle`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={marketTimeIntervalTimestamp}
			placeholderText="Loading OHLC candle…"
		>
			{#snippet children(marketTimeIntervalTimestamp)}
				{#if marketTimeIntervalTimestamp.fields.close !== undefined}
					<CurrencyAmount
						currency={quoteCurrency}
						showDecimalPlaces={6}
						value={marketTimeIntervalTimestamp.fields.close}
					/>
				{:else}
					<Timestamp
						timestamp={selector.timestampMs}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={marketTimeIntervalTimestamp}
			placeholderText="Loading OHLC candle…"
		>
			{#snippet children(marketTimeIntervalTimestamp)}
				{#if marketTimeIntervalTimestamp.fields.close !== undefined}
					<CurrencyAmount
						currency={quoteCurrency}
						showDecimalPlaces={6}
						value={marketTimeIntervalTimestamp.fields.close}
					/>
				{:else}
					<Timestamp
						timestamp={selector.timestampMs}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={marketTimeIntervalTimestamp}
			placeholderText="Loading OHLC candle…"
		>
			{#snippet children(marketTimeIntervalTimestamp)}
				<dl data-column-item="center">
					{#if marketTimeIntervalTimestamp.fields.close !== undefined}
						<div>
							<dt>Close</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.fields.close}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Interval start</dt>
						<dd>
							<Timestamp
								timestamp={selector.timestampMs}
							/>
						</dd>
					</div>

					<div>
						<dt>Market</dt>
						<dd>
							<MarketView
								selector={marketTimeIntervalTimestamp.fields.$parentMarket?.[EntityMetaKey.Selector] ?? selector.$market}
								layout={EntityLayout.Title}
								open={false}
							/>
						</dd>
					</div>

					{#if (
						open
						&& marketTimeIntervalTimestamp.fields.open !== undefined
					)}
						<div>
							<dt>Open</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.fields.open}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.fields.high !== undefined
					)}
						<div>
							<dt>High</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.fields.high}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.fields.low !== undefined
					)}
						<div>
							<dt>Low</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.fields.low}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.fields.volume !== undefined
					)}
						<div>
							<dt>Volume</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									value={marketTimeIntervalTimestamp.fields.volume}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.fields.quoteVolume !== undefined
					)}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									value={marketTimeIntervalTimestamp.fields.quoteVolume}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.fields.tradeCount !== undefined
					)}
						<div>
							<dt>Trade count</dt>
							<dd>
								<NumberValue
									value={marketTimeIntervalTimestamp.fields.tradeCount}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.fields.vwap !== undefined
					)}
						<div>
							<dt>VWAP</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.fields.vwap}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
