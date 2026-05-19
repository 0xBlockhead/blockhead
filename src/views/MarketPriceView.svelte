<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
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

	const priceLive = useEntity(
		EntityType.MarketPrice,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
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
			timestampNs: {},
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
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	{entityId}
	href={
		href
		?? (
			entityId.$market.$base.kind !== MarketAssetKind.Coin ?
				undefined
			:	resolve(
					'/(assets)/(coins)/coin/[coinId]',
					{ coinId: entityId.$market.$base.$coin.coinId },
				)
		)
	}
	{open}
	title={
		(
			entityId.$market.$base.kind === MarketAssetKind.Coin ?
				entityId.$market.$base.$coin.coinId
			:
				undefined
		)
		?? 'Spot / index quote'
	}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			spot / index quote
		</span>
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
			resource={priceLive}
			placeholderText="Loading price…"
		>
			{#snippet children(loaded)}
				{#if (
					loaded.price !== undefined
					|| loaded.caip19 !== undefined
					|| loaded.timestampNs !== undefined
					|| open && (
						loaded.updatedAt !== undefined
						|| loaded.transport !== undefined
						|| loaded.providerAssetId !== undefined
					)
				)}
					<dl data-column-item="center">
						{#if loaded.price !== undefined}
							<div>
								<dt>Quoted price USD (spot or composite index)</dt>
								<dd>
									<NumberValue
										value={Number(loaded.price) / 1e8}
										options={{
											minimumFractionDigits: 2,
											maximumFractionDigits: 6,
										}}
									/>
								</dd>
							</div>
						{/if}

						{#if loaded.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>
									<code>{loaded.caip19}</code>
								</dd>
							</div>
						{/if}

						{#if loaded.timestampNs !== undefined}
							<div>
								<dt>Index / quote clock</dt>
								<dd>
									<Timestamp
										timestamp={Number(loaded.timestampNs / 1_000_000n)}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
							{#if loaded.price !== undefined}
								<div>
									<dt>Price (fixed 1e8)</dt>
									<dd>{String(loaded.price)}</dd>
								</div>
							{/if}

							{#if loaded.timestampNs !== undefined}
								<div>
									<dt>Quote time (ns)</dt>
									<dd>{String(loaded.timestampNs)}</dd>
								</div>
							{/if}

							{#if loaded.updatedAt !== undefined}
								<div>
									<dt>Updated</dt>
									<dd>
										<Timestamp
											timestamp={loaded.updatedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}

							{#if loaded.transport !== undefined}
								<div>
									<dt>Transport</dt>
									<dd>{loaded.transport}</dd>
								</div>
							{/if}

							{#if loaded.providerAssetId !== undefined}
								{#if loaded.providerAssetId !== null}
									<div>
										<dt>Provider asset id</dt>
										<dd>{loaded.providerAssetId}</dd>
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
				href={resolve('/(assets)/coins/market/[marketKey]', {
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
					'/(assets)/coins/market/[marketKey]',
					{
						marketKey: (
							encodeURIComponent(
								stringify(entityId.$market),
							)
						),
					},
				)}
				id={`${stringify(entityId)}:parent-market`}
				layout={EntityLayout.Summary}
				open={false}
			/>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
