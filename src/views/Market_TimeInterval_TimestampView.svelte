<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Iso4217 } from '$/constants/Currency.ts'

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
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const marketTimeIntervalTimestamp = useEntity(
		EntityType.Market_TimeInterval_Timestamp,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				...marketOhlcCandleSources,
			],
			close: {},
			...(open && {
				open: {},
				high: {},
				low: {},
			}),
		},
	)


	const timeIntervalLabel = $derived(
		entityId.timeInterval.unit === MarketTimeIntervalUnit.Day ?
			`${String(entityId.timeInterval.value)}d`
		: entityId.timeInterval.unit === MarketTimeIntervalUnit.Hour ?
			`${String(entityId.timeInterval.value)}h`
		: entityId.timeInterval.unit === MarketTimeIntervalUnit.Minute ?
			`${String(entityId.timeInterval.value)}m`
		: entityId.timeInterval.unit === MarketTimeIntervalUnit.Second ?
			`${String(entityId.timeInterval.value)}s`
		:
			`${String(entityId.timeInterval.value)}`
	)

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
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title={`${timeIntervalLabel} OHLC candle`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			interval start (candle boundary)
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		{`${timeIntervalLabel} OHLC`}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if loadedMarketTimeIntervalTimestamp.close !== undefined}
				<div>
					<dt>Close</dt>
					<dd>
						<ResourceBoundary
							resource={marketTimeIntervalTimestamp}
							placeholderText="Loading OHLC candle…"
						>
							{#snippet children(loadedMarketTimeIntervalTimestamp)}
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={loadedMarketTimeIntervalTimestamp.close}
								/>
							{/snippet}
						</ResourceBoundary>
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
					<ResourceBoundary
						resource={marketTimeIntervalTimestamp}
						placeholderText="Loading OHLC candle…"
					>
						{#snippet children(loadedMarketTimeIntervalTimestamp)}
							<MarketView
								entityId={entityId.$market}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if (
				open
				&& marketTimeIntervalTimestamp.open !== undefined
			)}
				<div>
					<dt>Open</dt>
					<dd>
						<ResourceBoundary
							resource={marketTimeIntervalTimestamp}
							placeholderText="Loading OHLC candle…"
						>
							{#snippet children(loadedMarketTimeIntervalTimestamp)}
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={loadedMarketTimeIntervalTimestamp.open}
								/>
							{/snippet}
						</ResourceBoundary>
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
						<ResourceBoundary
							resource={marketTimeIntervalTimestamp}
							placeholderText="Loading OHLC candle…"
						>
							{#snippet children(loadedMarketTimeIntervalTimestamp)}
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={loadedMarketTimeIntervalTimestamp.high}
								/>
							{/snippet}
						</ResourceBoundary>
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
						<ResourceBoundary
							resource={marketTimeIntervalTimestamp}
							placeholderText="Loading OHLC candle…"
						>
							{#snippet children(loadedMarketTimeIntervalTimestamp)}
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={loadedMarketTimeIntervalTimestamp.low}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.Market_TimeInterval_Timestamp}
			{entityId}
		/>
	{/snippet}
</EntityView>

