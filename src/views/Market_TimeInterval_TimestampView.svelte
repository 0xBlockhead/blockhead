<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { quoteIso4217FromMarketId } from '$/constants/Currency.ts'
	import { formatMarketTimeIntervalLabel } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const marketTimeIntervalTimestamp = useEntity(
		EntityType.Market_TimeInterval_Timestamp,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.Constants_Internal,
			],
			close: {},
			...(open && {
				open: {},
				high: {},
				low: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{entityId}
	href={href ?? resolve(
		'/(assets)/(markets)/market/[marketKey]',
		{
			marketKey: encodeURIComponent(stringify(entityId.$market)),
		},
	)}
	{layout}
	bind:open
	title={`Market interval OHLC · ${formatMarketTimeIntervalLabel(entityId.timeInterval)} · candle at interval boundary`}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			interval start (candle boundary)
		</span>
	{/snippet}

	{#snippet Heading()}
		{`${formatMarketTimeIntervalLabel(entityId.timeInterval)} OHLC`}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
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
									currency={quoteIso4217FromMarketId(entityId.$market)}
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
								format={TimestampFormat.Both}
								timestamp={entityId.timestampMs}
							/>
						</dd>
					</div>

					<div>
						<dt>Market</dt>
						<dd>
							<MarketView
								entityId={entityId.$market}
								href={resolve(
									'/(assets)/(markets)/market/[marketKey]',
									{
										marketKey: encodeURIComponent(stringify(entityId.$market)),
									},
								)}
								layout={EntityLayout.Id}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>

					{#if open}
						{#if marketTimeIntervalTimestamp.open !== undefined}
							<div>
								<dt>Open</dt>
								<dd>
									<CurrencyAmount
										currency={quoteIso4217FromMarketId(entityId.$market)}
										showDecimalPlaces={6}
										value={marketTimeIntervalTimestamp.open}
									/>
								</dd>
							</div>
						{/if}

						{#if marketTimeIntervalTimestamp.high !== undefined}
							<div>
								<dt>High</dt>
								<dd>
									<CurrencyAmount
										currency={quoteIso4217FromMarketId(entityId.$market)}
										showDecimalPlaces={6}
										value={marketTimeIntervalTimestamp.high}
									/>
								</dd>
							</div>
						{/if}

						{#if marketTimeIntervalTimestamp.low !== undefined}
							<div>
								<dt>Low</dt>
								<dd>
									<CurrencyAmount
										currency={quoteIso4217FromMarketId(entityId.$market)}
										showDecimalPlaces={6}
										value={marketTimeIntervalTimestamp.low}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Market_TimeInterval_Timestamp}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
