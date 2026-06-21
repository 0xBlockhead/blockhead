<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Iso4217 } from '$/constants/Currency.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'

	import {
		MarketAssetKind,
		MarketTimeIntervalUnit,
	} from '$/constants/Market.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(selection.entitySelector.$market)),
			},
			),
			layout,
			open = $bindable(true),
			collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Market_TimeInterval_Timestamp>
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


	const marketTimeIntervalTimestamp = $derived(selection( { sources: [
				Source.Constants_Internal,
				...(open && layout !== EntityLayout.Summary ? [
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.Coinpaprika_OpenApi,
					Source.CoinMarketCap_Rest,
				] : []),
			], fields: { $parentMarket: true, ...(open && layout !== EntityLayout.Summary && ({ open: true, high: true, low: true, close: true, volume: true, quoteVolume: true, tradeCount: true, vwap: true })) } }))


	// (Derived)

	const quoteCurrency = $derived(
		selection.entitySelector.$market.$quote.kind === MarketAssetKind.Currency ?
			selection.entitySelector.$market.$quote.$currency.iso4217
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
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	title={`${(selection.entitySelector.timeInterval.unit === MarketTimeIntervalUnit.Day ?
			`${String(selection.entitySelector.timeInterval.value)}d`
		: selection.entitySelector.timeInterval.unit === MarketTimeIntervalUnit.Hour ?
			`${String(selection.entitySelector.timeInterval.value)}h`
		: selection.entitySelector.timeInterval.unit === MarketTimeIntervalUnit.Minute ?
			`${String(selection.entitySelector.timeInterval.value)}m`
		: selection.entitySelector.timeInterval.unit === MarketTimeIntervalUnit.Second ?
			`${String(selection.entitySelector.timeInterval.value)}s`
		:
			`${String(selection.entitySelector.timeInterval.value)}`)} OHLC candle`}
	{...EntityViewProps}
>
	{#snippet Value()}
		{#if layout === EntityLayout.Summary}
			<Timestamp
				timestamp={selection.entitySelector.timestampMs}
			/>
		{:else}
			<ResourceBoundary
				resource={marketTimeIntervalTimestamp}
				placeholderText="Loading OHLC candle…"
			>
				{#snippet children(marketTimeIntervalTimestamp)}
					{#if marketTimeIntervalTimestamp.close !== undefined}
						<CurrencyAmount
							currency={quoteCurrency}
							showDecimalPlaces={6}
							value={marketTimeIntervalTimestamp.close}
						/>
					{:else}
						<Timestamp
							timestamp={selection.entitySelector.timestampMs}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.Summary}
			<Timestamp
				timestamp={selection.entitySelector.timestampMs}
			/>
		{:else}
			<ResourceBoundary
				resource={marketTimeIntervalTimestamp}
				placeholderText="Loading OHLC candle…"
			>
				{#snippet children(marketTimeIntervalTimestamp)}
					{#if marketTimeIntervalTimestamp.close !== undefined}
						<CurrencyAmount
							currency={quoteCurrency}
							showDecimalPlaces={6}
							value={marketTimeIntervalTimestamp.close}
						/>
					{:else}
						<Timestamp
							timestamp={selection.entitySelector.timestampMs}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={marketTimeIntervalTimestamp}
			placeholderText="Loading OHLC candle…"
		>
			{#snippet children(marketTimeIntervalTimestamp)}
				<dl data-column-item="center">
					{#if marketTimeIntervalTimestamp.close !== undefined}
						<div>
							<dt>Close</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.close}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Interval start</dt>
						<dd>
							<Timestamp
								timestamp={selection.entitySelector.timestampMs}
							/>
						</dd>
					</div>

					<div>
						<dt>Market</dt>
						<dd>
							<MarketView
								selection={select(EntityType.Market, marketTimeIntervalTimestamp.$parentMarket?.[EntityMetaKey.Selector] ?? selection.entitySelector.$market)}
								layout={EntityLayout.Title}

								open={false}
								/>
						</dd>
					</div>

					{#if (
						open
						&& marketTimeIntervalTimestamp.open !== undefined
					)}
						<div>
							<dt>Open</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.open}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.high !== undefined
					)}
						<div>
							<dt>High</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.high}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.low !== undefined
					)}
						<div>
							<dt>Low</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.low}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.volume !== undefined
					)}
						<div>
							<dt>Volume</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									value={marketTimeIntervalTimestamp.volume}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.quoteVolume !== undefined
					)}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									value={marketTimeIntervalTimestamp.quoteVolume}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.tradeCount !== undefined
					)}
						<div>
							<dt>Trade count</dt>
							<dd>
								<NumberValue
									value={marketTimeIntervalTimestamp.tradeCount}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimeIntervalTimestamp.vwap !== undefined
					)}
						<div>
							<dt>VWAP</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimeIntervalTimestamp.vwap}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
