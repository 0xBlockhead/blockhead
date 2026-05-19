<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { quoteIso4217FromMarketId } from '$/constants/Currency.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


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
			entityId: EntityId<typeof schema, EntityType.Market_Timestamp>
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
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const marketTimestamp = useEntity(
		EntityType.Market_Timestamp,
		entityId,
		{
			$: [Source.TradingView_Rest],
			price: {},
			...(open && {
				caip19: {},
				marketCap: {},
				volume24h: {},
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
	entityType={EntityType.Market_Timestamp}
	{entityId}
	href={href ?? resolve(
		'/(assets)/(markets)/market/[marketKey]',
		{
			marketKey: encodeURIComponent(stringify(entityId.$market)),
		},
	)}
	{layout}
	bind:open
	title="Spot"
	{...entityViewRest}
>
	{#snippet Heading()}
		<Timestamp
			format={TimestampFormat.Both}
			timestamp={entityId.timestampMs}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A timestamped spot or index observation for the quoted base/against pair.
		</p>
		<p>
			Fields like price, market cap, or volume appear when the upstream feed supplies them.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading quote…"
			resource={marketTimestamp}
		>
			{#snippet children(marketTimestamp)}
				<dl data-column-item="center">
					{#if marketTimestamp.price !== undefined}
						<div>
							<dt>Last (index, {quoteIso4217FromMarketId(entityId.$market)})</dt>
							<dd>
								<CurrencyAmount
									currency={quoteIso4217FromMarketId(entityId.$market)}
									showDecimalPlaces={6}
									value={marketTimestamp.price}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Quote time</dt>
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
						{#if marketTimestamp.marketCap !== undefined}
							<div>
								<dt>Market cap</dt>
								<dd>
									<CurrencyAmount
										currency={quoteIso4217FromMarketId(entityId.$market)}
										value={marketTimestamp.marketCap}
									/>
								</dd>
							</div>
						{/if}

						{#if marketTimestamp.volume24h !== undefined}
							<div>
								<dt>24h volume</dt>
								<dd>
									<CurrencyAmount
										currency={quoteIso4217FromMarketId(entityId.$market)}
										value={marketTimestamp.volume24h}
									/>
								</dd>
							</div>
						{/if}

						{#if marketTimestamp.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>
									<code>{marketTimestamp.caip19}</code>
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
			entityType={EntityType.Market_Timestamp}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
