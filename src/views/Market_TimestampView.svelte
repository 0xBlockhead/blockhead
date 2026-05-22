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
		collapsible = true,
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
			$: [
				Source.Blockscout_Rest,
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.TradingView_Rest,
			],
			price: {},
			...(open && {
				caip19: {},
				marketCap: {},
				volume24h: {},
				transport: {},
				providerAssetId: {},
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
		<dl data-column-item="center">
					{#if marketTimestamp.price !== undefined}
						<div>
							<dt>Last (index, {quoteIso4217FromMarketId(entityId.$market)})</dt>
							<dd>
								<ResourceBoundary
									placeholderText="Loading quote…"
									resource={marketTimestamp}
								>
									{#snippet children(marketTimestamp)}
										<CurrencyAmount
											currency={quoteIso4217FromMarketId(entityId.$market)}
											showDecimalPlaces={6}
											value={marketTimestamp.price}
										/>
									{/snippet}
								</ResourceBoundary>
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
							<ResourceBoundary
								placeholderText="Loading quote…"
								resource={marketTimestamp}
							>
								{#snippet children(marketTimestamp)}
									<MarketView
										entityId={entityId.$market}
										href={resolve(
											'/(assets)/(markets)/market/[marketKey]',
											{
												marketKey: encodeURIComponent(stringify(entityId.$market)),
											},
										)}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					{#if open}
						{#if marketTimestamp.marketCap !== undefined}
							<div>
								<dt>Market cap</dt>
								<dd>
									<ResourceBoundary
										placeholderText="Loading quote…"
										resource={marketTimestamp}
									>
										{#snippet children(marketTimestamp)}
											<CurrencyAmount
												currency={quoteIso4217FromMarketId(entityId.$market)}
												value={marketTimestamp.marketCap}
											/>
										{/snippet}
									</ResourceBoundary>
								</dd>
							</div>
						{/if}

						{#if marketTimestamp.volume24h !== undefined}
							<div>
								<dt>24h volume</dt>
								<dd>
									<ResourceBoundary
										placeholderText="Loading quote…"
										resource={marketTimestamp}
									>
										{#snippet children(marketTimestamp)}
											<CurrencyAmount
												currency={quoteIso4217FromMarketId(entityId.$market)}
												value={marketTimestamp.volume24h}
											/>
										{/snippet}
									</ResourceBoundary>
								</dd>
							</div>
						{/if}

						{#if marketTimestamp.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>
									<ResourceBoundary
										placeholderText="Loading quote…"
										resource={marketTimestamp}
									>
										{#snippet children(marketTimestamp)}
											<code>{marketTimestamp.caip19}</code>
										{/snippet}
									</ResourceBoundary>
								</dd>
							</div>
						{/if}

						{#if marketTimestamp.transport !== undefined}
							<div>
								<dt>Transport</dt>
								<dd>
									<ResourceBoundary
										placeholderText="Loading quote…"
										resource={marketTimestamp}
									>
										{#snippet children(marketTimestamp)}
											{marketTimestamp.transport}
										{/snippet}
									</ResourceBoundary>
								</dd>
							</div>
						{/if}

						{#if marketTimestamp.providerAssetId !== undefined}
							{#if marketTimestamp.providerAssetId !== null}
								<div>
									<dt>Provider asset id</dt>
									<dd>
										<ResourceBoundary
											placeholderText="Loading quote…"
											resource={marketTimestamp}
										>
											{#snippet children(marketTimestamp)}
												{marketTimestamp.providerAssetId}
											{/snippet}
										</ResourceBoundary>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}
				</dl>
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
