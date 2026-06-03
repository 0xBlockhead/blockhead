<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Iso4217 } from '$/constants/Currency.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'

	import {
		MarketAssetKind,
		MarketTimeIntervalUnit,
		marketOhlcCandleSources,
	} from '$/constants/Market.ts'

	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(entityId.$market)),
			},
		),
		layout,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>
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

	const marketTimeIntervalTimestamp = useEntity(
		EntityType.Market_TimeInterval_Timestamp,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				...marketOhlcCandleSources,
			],
			$parentMarket: {},
			close: {},
			...(open && {
				open: {},
				high: {},
				low: {},
				volume: {},
				quoteVolume: {},
				tradeCount: {},
				vwap: {},
			}),
		},
	)


	// (Derived)

	const quoteCurrency = $derived(
		entityId.$market.$quote.kind === MarketAssetKind.Currency ?
			entityId.$market.$quote.$currency.iso4217
		:
			Iso4217.USD
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	title={`${(entityId.timeInterval.unit === MarketTimeIntervalUnit.Day ?
			`${String(entityId.timeInterval.value)}d`
		: entityId.timeInterval.unit === MarketTimeIntervalUnit.Hour ?
			`${String(entityId.timeInterval.value)}h`
		: entityId.timeInterval.unit === MarketTimeIntervalUnit.Minute ?
			`${String(entityId.timeInterval.value)}m`
		: entityId.timeInterval.unit === MarketTimeIntervalUnit.Second ?
			`${String(entityId.timeInterval.value)}s`
		:
			`${String(entityId.timeInterval.value)}`)} OHLC candle`}
	{...EntityViewProps}
>
	{#snippet Value()}
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
						timestamp={entityId.timestampMs}
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
				{#if marketTimeIntervalTimestamp.close !== undefined}
					<CurrencyAmount
						currency={quoteCurrency}
						showDecimalPlaces={6}
						value={marketTimeIntervalTimestamp.close}
					/>
				{:else}
					<Timestamp
						timestamp={entityId.timestampMs}
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
								timestamp={entityId.timestampMs}
							/>
						</dd>
					</div>

					<div>
						<dt>Market</dt>
						<dd>
							<MarketView
								entityId={marketTimeIntervalTimestamp.$parentMarket?.[EntityMetaKey.Id] ?? entityId.$market}
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

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
