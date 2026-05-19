<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import { quoteIso4217FromMarketId } from '$/constants/Currency.ts'
	import { formatMarketIdLabel } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.MarketPrice>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const marketPrice = useEntity(
		EntityType.MarketPrice,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.TradingView_Rest,
			],
			$$parentMarket: {},
			...(open && {
				$$quotes: {
					$: [
						Source.TradingView_Rest,
					],
				},
			}),
			caip19: {},
			price: {},
			providerAssetId: {},
			timestampMs: {},
			transport: {},
			updatedAt: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	{entityId}
	href={
		href
		?? resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(entityId.$market)),
			},
		)
	}
	{open}
	title={formatMarketIdLabel(entityId.$market)}
	{...entityViewRest}
>
	{#snippet Heading()}
		{formatMarketIdLabel(entityId.$market)}
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{(
				entityId.feedKey != null && entityId.feedKey !== '' ?
					entityId.feedKey
				: entityId.$network != null ?
					`Chain ${String(entityId.$network.chainId)}`
				:
					'Quote stream'
			)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={marketPrice}
			placeholderText="Loading price…"
		>
			{#snippet children(marketPrice)}
				{#if (
					marketPrice.price !== undefined
					|| marketPrice.caip19 !== undefined
					|| marketPrice.timestampMs !== undefined
					|| open && (
						marketPrice.updatedAt !== undefined
						|| marketPrice.transport !== undefined
						|| marketPrice.providerAssetId !== undefined
					)
				)}
					<dl data-column-item="center">
						{#if marketPrice.price !== undefined}
							<div>
								<dt>Quoted price ({quoteIso4217FromMarketId(entityId.$market)}, spot or composite index)</dt>
								<dd>
									<CurrencyAmount
										currency={quoteIso4217FromMarketId(entityId.$market)}
										showDecimalPlaces={6}
										value={marketPrice.price}
									/>
								</dd>
							</div>
						{/if}

						{#if marketPrice.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>
									<code>{marketPrice.caip19}</code>
								</dd>
							</div>
						{/if}

						{#if marketPrice.timestampMs !== undefined}
							<div>
								<dt>Index / quote clock</dt>
								<dd>
									<Timestamp
										timestamp={marketPrice.timestampMs}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
							{#if marketPrice.updatedAt !== undefined}
								<div>
									<dt>Updated</dt>
									<dd>
										<Timestamp
											timestamp={marketPrice.updatedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}

							{#if marketPrice.transport !== undefined}
								<div>
									<dt>Transport</dt>
									<dd>{marketPrice.transport}</dd>
								</div>
							{/if}

							{#if marketPrice.providerAssetId !== undefined}
								{#if marketPrice.providerAssetId !== null}
									<div>
										<dt>Provider asset id</dt>
										<dd>{marketPrice.providerAssetId}</dd>
									</div>
								{/if}
							{/if}
						{/if}
					</dl>
				{:else}
					<div data-row="wrap align-center gap-2">
						<p data-text="muted">
							No spot or index quote yet.
						</p>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									OHLC ranges aggregate trades or mids into open, high, low, close buckets per interval for the same base/quote/venue.
								</p>
								<p>
									A market price row is one timestamped spot or index print—not a rolled candle.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Quote vs OHLC ranges"
							>ⓘ</abbr>
						</Tooltip>
					</div>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.MarketPrice}
			{entityId}
		/>

		<section data-scroll-marker-label="Quote history">
			<Market_TimestampsView
				collapsible={false}
				entityFieldReference={{
					entityType: EntityType.MarketPrice,
					entityId,
					fieldName: '$$quotes',
				}}
				href={resolve('/(assets)/(markets)/market/[marketKey]', {
					marketKey: encodeURIComponent(stringify(entityId.$market)),
				})}
				id={`${stringify(entityId)}:quotes`}
				title="Quotes (timestamped)"
			/>
		</section>

		<section data-scroll-marker-label="Pair market">
			<MarketView
				entityId={entityId.$market}
				href={resolve(
					'/(assets)/(markets)/market/[marketKey]',
					{
						marketKey: (
							encodeURIComponent(
								stringify(entityId.$market),
							)
						),
					},
				)}
				id={`${stringify(entityId)}:parent-market`}
				layout={EntityLayout.Id}
				open={false}
				showTypeAnnotation={false}
			/>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
